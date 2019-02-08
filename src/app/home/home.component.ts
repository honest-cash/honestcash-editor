import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { PostService } from './post.service';

// @ts-ignore
import HonestEditor from '../../../honest-editor-js/dist/static/js/app.js';

interface Post {
  id: number;
  bodyMD: string;
  title: string;
  status: 'draft' | 'published';
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.scss'
  ]
})
export class HomeComponent implements OnInit {
  post: Post;
  isLoading: boolean;

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.isLoading = true;

    const honestEditor: any = new HonestEditor('honest-editor');

    this.postService
      .loadPostDraft({})
      .subscribe((post: Post) => {
        this.post = post;

        honestEditor.setContent(post.bodyMD);
      });

    honestEditor.subscribe((markdown: string) => {
      console.log(markdown);
    });
  }
}
