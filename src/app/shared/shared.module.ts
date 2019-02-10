import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { ToastrModule } from 'ngx-toastr';

import { LoaderComponent } from './loader/loader.component';
import { PostPublishModalComponent } from './components/modals/post-publish-modal/post-publish-modal.component';
import { ButtonPostSaveComponent } from './components/buttons/button-post-save/button-post-save.component';

@NgModule({
  imports: [
    CommonModule,
    TagInputModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      toastClass: 'ngx-toast',
      positionClass: 'toast-bottom-right'
    })
  ],
  declarations: [LoaderComponent, ButtonPostSaveComponent, PostPublishModalComponent],
  exports: [LoaderComponent, ButtonPostSaveComponent, PostPublishModalComponent],
  entryComponents: [PostPublishModalComponent]
})
export class SharedModule {}
