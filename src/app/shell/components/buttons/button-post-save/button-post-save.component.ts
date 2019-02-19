import { Component, OnInit, OnDestroy, AfterViewInit, NgZone } from '@angular/core';
import { EditorService, editorEvents } from '@app/shared/services/editor.service';
import { Post } from '@app/shared/interfaces/index';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-button-post-save',
  templateUrl: './button-post-save.component.html',
  styleUrls: ['./button-post-save.component.scss']
})
export class ButtonPostSaveComponent implements OnInit, OnDestroy {
  public shouldShowButtons: boolean;
  public isPostLoaded: boolean;
  public isSaving: boolean;
  public isPublished: boolean;
  public post: Post;
  public editorLoaded: BehaviorSubject<string>;
  public editorChanged: BehaviorSubject<string>;
  public postLoaded: BehaviorSubject<string>;
  public postChanged: BehaviorSubject<string>;

  constructor(private ngZone: NgZone, private router: Router, private editorService: EditorService) {
    this.shouldShowButtons = false;
    this.isPostLoaded = false;
    this.isSaving = false;
    this.isPublished = false;
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
        this.ngZone.run(() => (this.shouldShowButtons = true));
      }
    );

    this.postLoaded.subscribe(
      (status: string) => {},
      (error: string) => {},
      () => {
        this.ngZone.run(() => {
          this.post = this.editorService.getPost();
          this.isPublished = this.post.status === 'published' ? true : false;
          this.isPostLoaded = true;
        });
      }
    );

    this.postChanged.subscribe(status => {
      this.ngZone.run(() => {
        if (status === editorEvents.post.saved) {
          this.isSaving = false;
        }

        if (status === editorEvents.post.published) {
          this.isSaving = false;
          this.isPublished = true;
        }

        if (status === editorEvents.post.publishCancelled) {
          this.isSaving = false;
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

  saveDraft() {
    this.isSaving = true;
    this.editorService.saveDraft();
  }

  publishPost() {
    this.isSaving = true;
    this.editorService.saveDraft(() => {
      this.isSaving = true;
      this.editorService.publishPost();
    });
  }

  writePost() {
    this.router.navigate(['/markdown/write']);
  }
}
