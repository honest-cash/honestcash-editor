import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ShellComponent } from './shell.component';
import { HeaderComponent } from '@app/shell/components/partials/header/header.component';

import { PostService } from '@app/shared/services/post.service';
import { EditorService } from '@app/shared/services/editor.service';
import { NotAuthorizedComponent } from '@app/shell/components/pages/not-authorized/not-authorized.component';
import { NotAuthorizedRoutingModule } from '@app/shell/components/pages/not-authorized/not-authorized-routing.module';
import { HttpErrorRoutingModule } from '@app/shell/components/pages/http-error/http-error-routing.module';
import { HttpErrorComponent } from '@app/shell/components/pages/http-error/http-error.component';
import { PostPublishModalComponent } from '@app/shell/components/modals/post-publish-modal/post-publish-modal.component';
import { ButtonPostSaveComponent } from '@app/shell/components/buttons/button-post-save/button-post-save.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { ToastrModule } from 'ngx-toastr';
import { PartialPostDetailsComponent } from '@app/shell/components/partials/partial-post-details/partial-post-details.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TagInputModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      toastClass: 'ngx-toast',
      positionClass: 'toast-bottom-right'
    }),
    TranslateModule,
    NgbModule,
    RouterModule,
    NotAuthorizedRoutingModule,
    HttpErrorRoutingModule
  ],
  declarations: [
    HeaderComponent,
    ShellComponent,
    PostPublishModalComponent,
    ButtonPostSaveComponent,
    PartialPostDetailsComponent,
    NotAuthorizedComponent,
    HttpErrorComponent
  ],
  exports: [PostPublishModalComponent, ButtonPostSaveComponent, PartialPostDetailsComponent],
  providers: [PostService, EditorService],
  entryComponents: [PostPublishModalComponent]
})
export class ShellModule {}
