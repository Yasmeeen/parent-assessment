import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent} from '@angular/common/http';

import { Observable, throwError, of, EMPTY } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
    ) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(request).pipe(
        catchError((error) => {
          if (error.status === 401) {
            console.error('Unauthorized: Redirect to login');
            // Optionally redirect to the login page
          }
          return throwError(error); // Pass the error along
        })
      );
    }
}
