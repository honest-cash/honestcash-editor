import { Component, OnInit } from '@angular/core';
import { PostService } from '@app/shared/services/post.service';
import { EditorService } from '@app/shared/services/editor.service';
import { Post, User } from '@app/shared/interfaces/index';
import { switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UserService } from '@app/shared/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  post: Post;
  user: User;
  isLoading: boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private editorService: EditorService,
    private postService: PostService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.userService.getUser().subscribe((user: User) => {
      this.user = user;
      this.postService
        .loadPostDraft({
          postId: 1614
        })
        .subscribe((post: Post) => {
          if (post.userId === this.user.id) {
            return this.router.navigate(['/not-authorized']);
          }
          this.editorService.setEditor();

          this.post = post;
          this.editorService.setPost(post);
        });
    });

    /* this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {
          console.log('id', params.get('id'));
        }
      )
    ); */
  }
}
