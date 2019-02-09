import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ShellComponent } from './shell.component';
import { HeaderComponent } from './header/header.component';
import { ButtonPostSaveComponent } from './button-post-save/button-post-save.component';

import { PostService } from '@app/shared/services/post.service';
import { EditorService } from '@app/shared/services/editor.service';
import { PostPublishModalComponent } from '@app/shared/components/modals/post-publish-modal/post-publish-modal.component';

@NgModule({
  imports: [CommonModule, TranslateModule, NgbModule, RouterModule],
  declarations: [HeaderComponent, ShellComponent, ButtonPostSaveComponent, PostPublishModalComponent],
  providers: [PostService, EditorService],
  entryComponents: [PostPublishModalComponent]
})
export class ShellModule {}
