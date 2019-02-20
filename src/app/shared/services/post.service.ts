import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '@app/shared/interfaces';
import { Observable } from 'rxjs';

export interface DraftContext {
  parentPostId?: number;
  postId?: number;
}

const routes = {
  getPost: (id: number) => `/post/${id}`,
  draft: (c: DraftContext = {}) =>
    c.parentPostId ? `/draft?parentPostId=${c.parentPostId}` : c.postId ? `/post/${c.postId}` : '/draft',
  savePostProperty: (p: Post, property: 'title' | 'body' | 'hashtags') => `/draft/${p.id}/${property}`,
  saveDraft: (p: Post) => `/draft/${p.id}/body`,
  publishPost: (p: Post) => `/draft/${p.id}/publish`
};

@Injectable()
export class PostService {
  constructor(private httpClient: HttpClient) {}

  getPost(id: number): Observable<Post> {
    return this.httpClient.get<Post>(routes.getPost(id));
  }

  loadPostDraft(draftContext: DraftContext): Observable<Post> {
    return this.httpClient.get<Post>(routes.draft(draftContext));
  }

  savePostProperty(post: Post, property: 'title' | 'body' | 'hashtags'): Observable<Post> {
    return this.httpClient.put<Post>(routes.savePostProperty(post, property), post);
  }

  saveDraft(post: Post): Observable<Post> {
    return this.httpClient.put<Post>(routes.saveDraft(post), {
      body: post.bodyMD
    });
  }

  publishPost(post: Post): Observable<Post> {
    return this.httpClient.put<Post>(routes.publishPost(post), post);
  }
}
