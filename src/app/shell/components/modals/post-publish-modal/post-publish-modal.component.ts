import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PostService } from '@app/shared/services/post.service';
import { Post } from '@app/shared/interfaces';

@Component({
  selector: 'app-post-publish-modal',
  templateUrl: './post-publish-modal.component.html'
})
export class PostPublishModalComponent {
  post: Post;

  constructor(public activeModal: NgbActiveModal, private postService: PostService) {}

  public onAddRemovePaste() {
    this.post.hashtags = this.transformTags(this.post.userPostHashtags);
    this.postService
      .savePostProperty(this.post, 'hashtags')
      .toPromise()
      .then(() => console.log('added'));
  }

  public publish() {
    this.activeModal.close(this.transformTags(this.post.userPostHashtags));
  }

  private transformTags(tags: any[]) {
    return tags.map(h => h.hashtag).join(',');
  }
}
