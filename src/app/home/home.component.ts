import { Component, OnInit } from '@angular/core';
import { PostService } from '@app/shared/services/post.service';
import { EditorService } from '@app/shared/services/editor.service';
import { Post } from '@app/shared/interfaces/index';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  post: Post;
  isLoading: boolean;

  constructor(
    private editorService: EditorService,
    private postService: PostService
    ) {}

  ngOnInit() {
    this.isLoading = true;

    this.editorService.setEditor();

    this.postService.loadPostDraft({postId: 1862}).subscribe((post: Post) => {
      this.post = post;
      this.editorService.setPost(post);
    });


  }
}
