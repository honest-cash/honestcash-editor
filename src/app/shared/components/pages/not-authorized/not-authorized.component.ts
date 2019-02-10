import { Component, OnInit } from '@angular/core';
import { EditorService, editorEvents } from '@app/shared/services/editor.service';
import { PostService } from '@app/shared/services/post.service';
import { Post } from '@app/shared/interfaces/index';
import { interval } from 'rxjs';

@Component({
  selector: 'app-not-authorized',
  templateUrl: './not-authorized.component.html',
  styleUrls: ['./not-authorized.component.scss']
})
export class NotAuthorizedComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
