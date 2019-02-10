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
        // this.initAutoSave();

        const id = indexedDB.open('stackedit-db', 1);

        id.onerror = event => console.log('error', event);
        id.onsuccess = (event: any) => {
          const db = event.target.result;
          const tx = db.transaction(['objects']).objectStore('objects');
          const req = tx.get('lastOpened');

          req.onsuccess = (event2: any) => {
            // console.log('event', event.target);
            const lastOpenedList = Object.entries(event2.target.result.data);
            const lastOpenedItem = lastOpenedList[lastOpenedList.length - 1];
            const lastOpenedTx = lastOpenedItem[0];

            const req2 = tx.get(`${lastOpenedTx}/content`);

            req2.onsuccess = (event3: any) => {
              // console.log(event3.target.result.text);
            };
          };
        };
      }

      if (status === 'bodyChanged') {
        this.isBodyChanged = true;
        this.isSaved = false;
      }

      if (status === 'draftSaved') {
        this.isBodyChanged = false;
        this.isSaving = false;
        this.isSaved = true;
      }

      if (status === 'postPublished') {
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
}
