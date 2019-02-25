import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Post } from '@app/shared/interfaces';
import { PostService } from '@app/shared/services/post.service';
import { ToastrService, ActiveToast } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PostPublishModalComponent } from '@app/shell/components/modals/post-publish-modal/post-publish-modal.component';

// @ts-ignore
declare var HonestEditor: any;

export const editorEvents = {
  editor: {
    loaded: 'editor-loaded',
    changed: 'editor-changed'
  },
  post: {
    loaded: 'post-loaded',
    saved: 'post-saved',
    published: 'post-published',
    publishCancelled: 'publish-cancelled'
  }
};

@Injectable()
export class EditorService {
  private isEditorInitialized = false;
  private editorLoaded: BehaviorSubject<string> = new BehaviorSubject('none');
  private editorChanged: BehaviorSubject<string> = new BehaviorSubject('none');
  private postLoaded: BehaviorSubject<string> = new BehaviorSubject('none');
  private postChanged: BehaviorSubject<string> = new BehaviorSubject('none');
  private editor: any;
  private post: Post;

  constructor(private postService: PostService, private toastr: ToastrService, private modalService: NgbModal) {}

  setEditor(domId: string = 'honest-editor') {
    if (!this.editor) {
      const token =
        localStorage.getItem('HC_USER_TOKEN') ||
        (localStorage.getItem('HC_USER_CREDENTIALS') && JSON.parse(localStorage.getItem('HC_USER_CREDENTIALS')).token);

      this.editor = new HonestEditor(domId, {
        upload: {
          image: {
            url: 'https://honest.cash/api/upload/image',
            requireAuth: true,
            tokenKey: 'x-auth-token',
            token
          }
        }
      });

      this.editor.getStore().subscribe((state: { type: string; payload: any }) => {
        if (!this.isEditorInitialized && state.type === 'discussion/setCurrentDiscussionId') {
          // this type is loaded last so we can assume that the editor is loaded
          this.isEditorInitialized = true;
          this.editorLoaded.complete();
        }

        if (this.isEditorInitialized && this.post && state.type === 'content/patchItem') {
          // this is when the content is updated
          const markdown = state.payload.text;
          this.post.bodyMD = markdown;
          const title = markdown.match(/\#(.*)/);
          if (!this.post.title || this.post.title === '' || this.post.title !== title[1]) {
            this.post.title = title ? title[1] : '';
          }
          this.editorChanged.next(editorEvents.editor.changed);
        }
      });
    }
  }

  getEventStreams(): {
    editorLoaded: BehaviorSubject<string>;
    editorChanged: BehaviorSubject<string>;
    postLoaded: BehaviorSubject<string>;
    postChanged: BehaviorSubject<string>;
  } {
    return {
      editorLoaded: this.editorLoaded,
      editorChanged: this.editorChanged,
      postLoaded: this.postLoaded,
      postChanged: this.postChanged
    };
  }

  getEditor(): any {
    return this.editor;
  }

  setPost(post: Post): void {
    if (!this.post) {
      this.post = post;
      this.editor.setContent(post.bodyMD);
      this.postLoaded.complete();
    }
  }

  getPost(): Post {
    return this.post;
  }

  saveDraft(cb?: () => void): void {
    this.toastr.info('Saving...');
    this.postService
      .saveDraft(this.post)
      .toPromise()
      .then(d => {
        this.toastr.success('Saved.');
        this.postChanged.next(editorEvents.post.saved);
        if (cb) {
          cb();
        }
      });
  }

  publishPost(): ActiveToast<any> {
    if (this.post.bodyMD.length < 50) {
      this.postChanged.next(editorEvents.post.publishCancelled);
      return this.toastr.error('The story needs to be at least 50 characters.');
    } else if (!this.post.title || this.post.title === '') {
      this.postChanged.next(editorEvents.post.publishCancelled);
      return this.toastr.error('The story needs to have a title. Please write a heading in your story.');
    } else if (this.post.title && this.post.title.length < 10) {
      this.postChanged.next(editorEvents.post.publishCancelled);
      return this.toastr.error('The title is too short. Please keep it longer than 9 characters.');
    }

    this.saveDraft(() => {
      const modalRef = this.modalService.open(PostPublishModalComponent);

      (modalRef.componentInstance as PostPublishModalComponent).post = this.post;

      modalRef.result.then(
        hashtags => {
          this.post.hashtags = hashtags;

          this.toastr.info('Publishing...');

          this.postService
            .publishPost(this.post)
            .toPromise()
            .then(() => {
              this.toastr.success('Published.');
              this.postChanged.next(editorEvents.post.published);
            });
        },
        dismiss => {
          this.postChanged.next(editorEvents.post.publishCancelled);
        }
      );
    });
  }
}
