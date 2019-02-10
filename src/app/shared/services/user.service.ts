import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '@app/shared/interfaces';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class UserService {
  private user: BehaviorSubject<User | undefined> = new BehaviorSubject(undefined);

  constructor(private httpClient: HttpClient) {
    this.getMe();
  }

  public getUser() {
    return this.user;
  }

  private getMe() {
    this.httpClient.get('/me').subscribe((user: User) => {
      this.user.next(user);
    });
  }
}
