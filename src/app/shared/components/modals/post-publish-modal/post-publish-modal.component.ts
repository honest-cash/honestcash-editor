import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-post-publish-modal',
  templateUrl: './post-publish-modal.component.html'
})
export class PostPublishModalComponent {

  hashtags: any[];

  constructor(public activeModal: NgbActiveModal) {}

  public publish() {
    this.activeModal.close(this.hashtags);
  }
}
