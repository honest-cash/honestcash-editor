import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '@app/shared/interfaces';
import { BehaviorSubject } from 'rxjs';
import { Logger } from '@app/core';
import { Router } from '@angular/router';

const log = new Logger('UserService');

@Injectable()
export class UserService {
  private user: BehaviorSubject<User | undefined> = new BehaviorSubject(undefined);

  constructor(private router: Router, private httpClient: HttpClient) {
    this.getMe();
  }

  public getUser() {
    return this.user;
  }

  private getMe() {
    this.httpClient.get('/me').subscribe(
      (user: User) => {
        this.user.next(user);
      },
      error => {
        log.error(error);
        this.router.navigate(['/http-error']);
      }
    );
  }
}
