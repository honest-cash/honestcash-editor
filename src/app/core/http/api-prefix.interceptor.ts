import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@env/environment';
import { AuthenticationService } from '../authentication/authentication.service';

/**
 * Prefixes all requests with `environment.serverUrl`.
 */
@Injectable()
export class ApiPrefixInterceptor implements HttpInterceptor {
  constructor(private authentificationService: AuthenticationService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!/^(http|https):/i.test(request.url)) {
      request = request.clone({
        url: environment.serverUrl + request.url
      });
    }

    request = request.clone({
      setHeaders: {
        'x-auth-token': `${this.authentificationService.credentials.token}`
      }
    });

    return next.handle(request);
  }
}
