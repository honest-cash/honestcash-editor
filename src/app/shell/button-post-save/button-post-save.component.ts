import { Component, OnInit } from '@angular/core';
import { EditorService } from '@app/shared/services/editor.service';
import { PostService } from '@app/shared/services/post.service';
import { Post } from '@app/shared/interfaces/index';
import { interval } from 'rxjs';

@Component({
  selector: 'app-button-post-save',
  templateUrl: './button-post-save.component.html',
  styleUrls: ['./button-post-save.component.scss']
})
export class ButtonPostSaveComponent implements OnInit {
  public isEditorLoaded: boolean;
  public isSaving: boolean;
  public isSaved: boolean;
  public isPublished: boolean;
  public isBodyChanged: boolean;
  public everyThreeSecs: any;
  public post: Post;
  private editor: any;

  constructor(private editorService: EditorService) {
    this.isEditorLoaded = false;
    this.isSaving = false;
    this.isSaved = false;
    this.isPublished = false;
    this.isBodyChanged = true;
    this.everyThreeSecs = interval(3000);
  }

  ngOnInit() {
    this.editorService.isLoaded.subscribe(status => {
      if (status === 'editor') {
        this.editor = this.editorService.getEditor();
      }

      if (status === 'post') {
        this.post = this.editorService.getPost();
        this.isPublished = this.post.status === 'published' ? true : false;
        this.isEditorLoaded = true;
        this.initAutoSave();
      }

      if (status === 'bodyChanged') {
        this.isBodyChanged = true;
        this.isSaved = false;
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
    return this.editorService.saveDraft().subscribe(d => {
      this.isSaving = false;
      this.isSaved = true;
    });
  }

  publishPost() {
    this.isSaving = true;
    return this.editorService.publishPost().subscribe(p => {
      this.isSaving = false;
      this.isSaved = true;
      this.isPublished = true;
    });
  }
}
