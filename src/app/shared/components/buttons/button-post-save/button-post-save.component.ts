import { Component, OnInit } from '@angular/core';
import { EditorService, editorEvents } from '@app/shared/services/editor.service';
import { PostService } from '@app/shared/services/post.service';
import { Post } from '@app/shared/interfaces/index';
import { interval } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-button-post-save',
  templateUrl: './button-post-save.component.html',
  styleUrls: ['./button-post-save.component.scss']
})
export class ButtonPostSaveComponent implements OnInit {
  public shouldShowButtons: boolean;
  public isEditorLoaded: boolean;
  public isSaving: boolean;
  public isSaved: boolean;
  public isPublished: boolean;
  public isBodyChanged: boolean;
  public everyThreeSecs: any;
  public post: Post;
  private editor: any;

  constructor(private router: Router, private editorService: EditorService) {
    this.shouldShowButtons = false;
    this.isEditorLoaded = false;
    this.isSaving = false;
    this.isSaved = false;
    this.isPublished = false;
    this.isBodyChanged = true;
    this.everyThreeSecs = interval(3000);
  }

  ngOnInit() {
    this.editorService.isLoaded.subscribe(status => {
      if (status === editorEvents.editor.loaded) {
        this.editor = this.editorService.getEditor();
        this.shouldShowButtons = true;
      }

      if (status === editorEvents.post.loaded) {
        this.post = this.editorService.getPost();
        this.isPublished = this.post.status === 'published' ? true : false;
        this.isEditorLoaded = true;
        // this.initAutoSave();
      }

      if (status === editorEvents.editor.changed) {
        this.isBodyChanged = true;
        this.isSaved = false;
      }

      if (status === editorEvents.post.saved) {
        this.isBodyChanged = false;
        this.isSaving = false;
        this.isSaved = true;
      }

      if (status === editorEvents.post.published) {
        this.isBodyChanged = false;
        this.isSaving = false;
        this.isSaved = true;
        this.isPublished = true;
      }
    });
  }

  initAutoSave() {
    this.everyThreeSecs.subscribe(() => {
      if (!this.isPublished && this.isBodyChanged) {
        this.saveDraft();
        this.isBodyChanged = false;
      }
    });
  }

  saveDraft() {
    this.isSaving = true;
    this.editorService.saveDraft();
  }

  publishPost() {
    this.isSaving = true;
    this.editorService.publishPost();
  }

  writePost() {
    this.router.navigate(['/write']);
  }
}
