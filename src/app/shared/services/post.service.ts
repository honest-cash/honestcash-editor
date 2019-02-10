import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '@app/shared/interfaces';

export interface DraftContext {
  parentPostId?: number;
  postId?: number;
}

const routes = {
  draft: (c: DraftContext = {}) =>
    c.parentPostId ? `/draft?parentPostId=${c.parentPostId}` : c.postId ? `/post/${c.postId}` : '/draft',
  savePostProperty: (p: Post, property: 'title' | 'body' | 'hashtags') => `/draft/${p.id}/${property}`,
  saveDraft: (p: Post) => `/draft/${p.id}/body`,
  publishPost: (p: Post) => `/draft/${p.id}/publish`
};

@Injectable()
export class PostService {
  constructor(private httpClient: HttpClient) {}

  loadPostDraft(draftContext: DraftContext) {
    return this.httpClient.get(routes.draft(draftContext));
  }

  savePostProperty(post: Post, property: 'title' | 'body' | 'hashtags') {
    return this.httpClient.put(routes.savePostProperty(post, property), post);
  }

  saveDraft(post: Post) {
    return this.httpClient.put(routes.saveDraft(post), post);
  }

  publishPost(post: Post) {
    return this.httpClient.put(routes.publishPost(post), post);
  }
}
