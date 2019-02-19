import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService, I18nService } from '@app/core';
import { UserService } from '@app/shared/services/user.service';
import { User } from '@app/shared/interfaces/index';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  menuHidden = true;
  public user: User;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private i18nService: I18nService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.getUser().subscribe(user => {
      this.user = user;
    });
  }

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  logout() {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  goTo(path: string) {
    switch (path) {
      case 'profile':
        window.location.href = `/profile/${this.user.username}`;
        break;
      case 'posts':
        window.location.href = `/posts`;
        break;
      case 'wallet':
        window.location.href = `/wallet`;
        break;
      case 'help':
        window.location.href = `/honest_cash/frequently-asked-questions`;
        break;
      case 'terms-of-service':
        window.location.href = `/honest_cash/honest-cash-terms-of-service-124`;
        break;
      case 'privacy-policy':
        window.location.href = `/honest_cash/honestcash-privacy-policy`;
        break;
      default:
        break;
    }
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }
}
