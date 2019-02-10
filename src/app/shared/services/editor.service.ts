import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Post } from '@app/shared/interfaces';
import { PostService } from '@app/shared/services/post.service';
import { ToastrService, ActiveToast } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PostPublishModalComponent } from '@app/shared/components/modals/post-publish-modal/post-publish-modal.component';

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
    published: 'post-published'
  }
};

@Injectable()
export class EditorService {
  public loaded = new BehaviorSubject('none');
  public isLoaded = this.loaded.asObservable();

  private editor: any;
  private post: Post;

  constructor(private postService: PostService, private toastr: ToastrService, private modalService: NgbModal) {}

  setEditor(domId: string = 'honest-editor') {
    this.editor = new HonestEditor(domId);

    this.editor.subscribe((markdown: string) => {
      this.loaded.next(editorEvents.editor.changed);
      this.post.bodyMD = markdown;
    });

    this.loaded.next(editorEvents.editor.loaded);
  }

  getEditor() {
    return this.editor;
  }

  setPost(post: Post) {
    this.post = post;
    console.log(this.post);
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
      const modalRef = this.modalService.open(PostPublishModalComponent, {
        backdrop: 'static'
      });

      (modalRef.componentInstance as PostPublishModalComponent).post = this.post;

      modalRef.result.then(
        hashtags => {
          this.post.hashtags = hashtags;

          this.postService
            .publishPost(this.post)
            .toPromise()
            .then(d => {
              this.toastr.success('Post has been published.');
              this.loaded.next(editorEvents.post.published);
            });
        },
        e => console.log('error', e)
      );
    }
  }
}
