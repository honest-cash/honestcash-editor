import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Post } from '@app/shared/interfaces';

export interface RandomQuoteContext {
  // The quote's category: 'dev', 'explicit'...
  category: string;
}

export interface DraftContext {
  parentPostId?: number;
  postId?: number;
}

const routes = {
  quote: (c: RandomQuoteContext) => `/jokes/random?category=${c.category}`,
  draft: (c: DraftContext = {}) =>
    c.parentPostId ? `/draft?parentPostId=${c.parentPostId}` : c.postId ? `/post/${c.postId}` : '/draft',
  saveDraft: (p: Post) => `/draft/${p.id}/body`,
  publishPost: (p: Post) => `/draft/${p.id}/publish`,
};

@Injectable()
export class PostService {
  constructor(private httpClient: HttpClient) {}

  getRandomQuote(context: RandomQuoteContext): Observable<any> {
    return this.httpClient.cache().get(routes.quote(context));
  }

  loadPostDraft(draftContext: DraftContext) {
    return this.httpClient.get(routes.draft(draftContext));
  }

  saveDraft(post: Post) {
    return this.httpClient.put(routes.saveDraft(post), post);
  }

  publishPost(post: Post) {
    return this.httpClient.put(routes.publishPost(post), post);
  }
}
