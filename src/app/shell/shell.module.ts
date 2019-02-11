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
import { NotAuthorizedComponent } from '@app/shared/components/pages/not-authorized/not-authorized.component';
import { NotAuthorizedRoutingModule } from '@app/shared/components/pages/not-authorized/not-authorized-routing.module';
import { HttpErrorRoutingModule } from '@app/shared/components/pages/http-error/http-error-routing.module';
import { HttpErrorComponent } from '@app/shared/components/pages/http-error/http-error.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
    NgbModule,
    RouterModule,
    NotAuthorizedRoutingModule,
    HttpErrorRoutingModule
  ],
  declarations: [HeaderComponent, ShellComponent, NotAuthorizedComponent, HttpErrorComponent],
  providers: [PostService, EditorService]
})
export class ShellModule {}
