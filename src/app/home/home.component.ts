import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PostService } from '@app/shared/services/post.service';
import { EditorService } from '@app/shared/services/editor.service';
import { Post, User } from '@app/shared/interfaces/index';
import { switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UserService } from '@app/shared/services/user.service';
import { Logger } from '@app/core';

const log = new Logger('HomeComponent');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  post: Post;
  user: User;
  isLoading: boolean;
  mode: 'write' | 'edit' | 'respond';
  postId: number;
  parentPostId: number;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private editorService: EditorService,
    private postService: PostService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.isLoading = true;
  }

  ngAfterViewInit() {
    this.userService.getUser().subscribe(
      (user: User) => {
        this.user = user;

        this.activatedRoute.url.subscribe(url => {
          if (url[0].toString() === 'write') {
            if (url[1] && url[1].toString() === 'response') {
              this.mode = 'respond';
              this.parentPostId = parseInt(url[2].toString());
            } else {
              this.mode = 'write';
            }
          } else if (url[0].toString() === 'edit') {
            this.mode = 'edit';
            this.postId = parseInt(url[1].toString());
          }

          let draft: any = {};

          if (this.mode === 'edit') {
            draft = {
              postId: this.postId
            };
          }

          this.postService.loadPostDraft(draft).subscribe(
            (post: Post) => {
              if (post.userId !== this.user.id) {
                return this.router.navigate(['/not-authorized']);
              }

              if (this.mode === 'respond') {
                post.parentPostId = this.parentPostId;
              }

              this.editorService.setEditor();
              this.post = post;
              this.editorService.setPost(post);
            },
            error => {
              log.error(error);
              this.router.navigate(['/http-error']);
            }
          );
        });
      },
      error => {
        log.error(error);
        this.router.navigate(['/http-error']);
      }
    );
  }
}
