import { Component, OnInit } from '@angular/core';
import { PostService } from '@app/shared/services/post.service';
import { EditorService } from '@app/shared/services/editor.service';
import { Post } from '@app/shared/interfaces/index';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  post: Post;
  isLoading: boolean;

  constructor(private route: ActivatedRoute, private editorService: EditorService, private postService: PostService) {}

  ngOnInit() {
    this.isLoading = true;

    this.editorService.setEditor();

    /* this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
          console.log('id', params.get('id'));
        }
      )
    ); */

    this.postService
      .loadPostDraft({
        postId: 1614
      })
      .subscribe((post: Post) => {
        this.post = post;
        this.editorService.setPost(post);
      });
  }
}
