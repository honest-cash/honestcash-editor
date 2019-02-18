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
  private loaded: BehaviorSubject<string> = new BehaviorSubject('none');
  private editor: any;
  private post: Post;

  constructor(private postService: PostService, private toastr: ToastrService, private modalService: NgbModal) {}

  setEditor(domId: string = 'honest-editor') {
    console.log('seteditor');
    this.editor = new HonestEditor(domId);

    this.editor.subscribe((markdown: string) => {
      this.loaded.next(editorEvents.editor.changed);
      this.post.bodyMD = markdown;
    });

    this.loaded.next(editorEvents.editor.loaded);
  }

  getEventStream(): BehaviorSubject<string> {
    return this.loaded;
  }

  getEditor(): any {
    return this.editor;
  }

  setPost(post: Post): void {
    this.post = post;
    this.editor.setContent(post.bodyMD);
    this.loaded.next(editorEvents.post.loaded);
  }

  getPost(): Post {
    return this.post;
  }

  saveDraft(): void {
    this.postService
      .saveDraft(this.post)
      .toPromise()
      .then(d => {
        this.loaded.next(editorEvents.post.saved);
      });
  }

  publishPost(): ActiveToast<any> {
    if (this.post.bodyMD.length < 50) {
      return this.toastr.error('The story needs to be at least 50 characters.');
    } else {
      const modalRef = this.modalService.open(PostPublishModalComponent);

      (modalRef.componentInstance as PostPublishModalComponent).post = this.post;

      modalRef.result.then(
        hashtags => {
          this.post.hashtags = hashtags;

          this.postService
            .publishPost(this.post)
            .toPromise()
            .then(() => {
              this.toastr.success('Post has been published.');
              this.loaded.next(editorEvents.post.published);
            });
        },
        dismiss => {
          this.loaded.next(editorEvents.post.publishCancelled);
        }
      );
    }
  }
}
