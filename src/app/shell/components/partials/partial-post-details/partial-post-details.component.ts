import { Component, OnInit, OnDestroy, AfterViewInit, NgZone } from '@angular/core';
import { EditorService, editorEvents } from '@app/shared/services/editor.service';
import { Post } from '@app/shared/interfaces/index';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-partial-post-details',
  templateUrl: './partial-post-details.component.html',
  styleUrls: ['./partial-post-details.component.scss']
})
export class PartialPostDetailsComponent implements OnInit, OnDestroy {
  public shouldShowPartial: boolean;
  public isPostLoaded: boolean;
  public post: Post;
  public isResponse: boolean;
  public editorLoaded: BehaviorSubject<string>;
  public editorChanged: BehaviorSubject<string>;
  public postLoaded: BehaviorSubject<string>;
  public postChanged: BehaviorSubject<string>;

  constructor(private ngZone: NgZone, private router: Router, private editorService: EditorService) {
    this.shouldShowPartial = false;
    this.isPostLoaded = false;
    this.isResponse = false;
  }

  ngOnInit() {
    const streams = this.editorService.getEventStreams();
    this.editorLoaded = streams.editorLoaded;
    this.editorChanged = streams.editorChanged;
    this.postLoaded = streams.postLoaded;
    this.postChanged = streams.postChanged;

    this.editorLoaded.subscribe(
      status => {},
      error => {},
      () => {
        this.ngZone.run(() => (this.shouldShowPartial = true));
      }
    );

    this.editorChanged.subscribe(status => {
      if (status === editorEvents.editor.changed) {
        this.ngZone.run(() => {
          this.post = this.editorService.getPost();
        });
      }
    });

    this.postLoaded.subscribe(
      (status: string) => {},
      (error: string) => {},
      () => {
        this.ngZone.run(() => {
          this.post = this.editorService.getPost();
          this.isResponse = this.post.parentPostId ? true : false;
          this.isPostLoaded = true;
        });
      }
    );

    this.postChanged.subscribe(status => {
      this.ngZone.run(() => {
        if (status === editorEvents.post.published) {
          this.post = this.editorService.getPost();
        }
      });
    });
  }

  ngOnDestroy() {
    this.editorLoaded.unsubscribe();
    this.editorChanged.unsubscribe();
    this.postLoaded.unsubscribe();
    this.postChanged.unsubscribe();
  }
}
