import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

// @ts-ignore
import HonestEditor from 'honest-editor-js';
import { Post } from '@app/shared/interfaces';
import { PostService } from '@app/shared/services/post.service';

@Injectable()
export class EditorService {
  public loaded = new BehaviorSubject('none');
  isLoaded = this.loaded.asObservable();
  private editor: any;
  private post: Post;

  constructor(private postService: PostService) {}

  setEditor() {
    this.editor = new HonestEditor('honest-editor');
    this.loaded.next('editor');
  }

  getEditor() {
    return this.editor;
  }

  setPost(post: Post) {
    this.post = post;
    this.editor.setContent(post.bodyMD);
    this.loaded.next('post');
    this.setSubscriber();
  }

  getPost(): Post {
    return this.post;
  }

  setSubscriber() {
    this.editor.subscribe((markdown: string) => {
      this.loaded.next('bodyChanged');
      this.post.bodyMD = markdown;
    });
  }

  saveDraft() {
    return this.postService.saveDraft(this.post);
  }

  publishPost() {
    return this.postService.publishPost(this.post);
  }
}
