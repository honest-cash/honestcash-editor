import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { PostService } from '@app/shared/services/post.service';
import { EditorService } from '@app/shared/services/editor.service';
import { Post, User } from '@app/shared/interfaces/index';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '@app/shared/services/user.service';
import { Logger } from '@app/core';
import { BehaviorSubject } from 'rxjs';

import blankBody from './blankBody';

const log = new Logger('HomeComponent');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy, AfterViewInit {
  post: Post;
  user: User;
  mode: 'write' | 'edit' | 'respond';
  postId: number;
  parentPostId: number;
  getUser: BehaviorSubject<User>;
  editorLoaded: BehaviorSubject<string>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private editorService: EditorService,
    private postService: PostService,
    private userService: UserService
  ) {
    this.getUser = this.userService.getUser();

    const streams = this.editorService.getEventStreams();
    this.editorLoaded = streams.editorLoaded;
  }

  ngAfterViewInit() {
    this.getUser.subscribe(
      (user: User) => {
        if (!this.user) {
          this.user = user;

          this.activatedRoute.url.subscribe(url => {
            if (url[1].toString() === 'write') {
              if (url[2] && url[2].toString() === 'response') {
                this.mode = 'respond';
                this.parentPostId = parseInt(url[3].toString());
              } else {
                this.mode = 'write';
              }
            } else if (url[1].toString() === 'edit') {
              this.mode = 'edit';
              this.postId = parseInt(url[2].toString());
            }

            let draft: any = {};

            if (this.mode === 'edit') {
              draft = {
                postId: this.postId
              };
            }

            this.postService.loadPostDraft(draft).subscribe(
              (post: Post) => {
                if (!this.post) {
                  if (post.userId !== this.user.id) {
                    return this.router.navigate(['/not-authorized']);
                  }

                  if (this.mode === 'respond') {
                    post.parentPostId = this.parentPostId;
                    this.postService.getPost(this.parentPostId).subscribe(p => {
                      post.parentPost = p;
                      post.bodyMD = blankBody;
                      this.post = post;

                      this.editorService.setEditor();

                      this.editorLoaded.subscribe(
                        status => {},
                        error => {},
                        () => {
                          this.editorService.setPost(this.post);
                        }
                      );
                    });
                  }

                  if (this.mode === 'write' && !post.bodyMD) {
                    post.bodyMD = blankBody;
                    this.post = post;

                    this.editorService.setEditor();

                    this.editorLoaded.subscribe(
                      status => {},
                      error => {},
                      () => {
                        this.editorService.setPost(this.post);
                      }
                    );
                  } else if (this.mode === 'write' && post.bodyMD) {
                    this.post = post;

                    this.editorService.setEditor();

                    this.editorLoaded.subscribe(
                      status => {},
                      error => {},
                      () => {
                        this.editorService.setPost(this.post);
                      }
                    );
                  }
                }
              },
              error => {
                log.error(error);
                this.router.navigate(['/http-error']);
              }
            );
          });
        }
      },
      error => {
        log.error(error);
        this.router.navigate(['/http-error']);
      }
    );
  }

  ngOnDestroy() {
    this.getUser.unsubscribe();
    this.editorLoaded.unsubscribe();
  }
}
