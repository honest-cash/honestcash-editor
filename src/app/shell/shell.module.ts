import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ShellComponent } from './shell.component';
import { HeaderComponent } from './header/header.component';

import { PostService } from '@app/shared/services/post.service';
import { EditorService } from '@app/shared/services/editor.service';

@NgModule({
  imports: [CommonModule, SharedModule, TranslateModule, NgbModule, RouterModule],
  declarations: [HeaderComponent, ShellComponent],
  providers: [PostService, EditorService]
})
export class ShellModule {}
