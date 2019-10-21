import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';

import { User } from './user.model';

export interface AuthRespose {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthService {
  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient,
              private router: Router) {}

  signup(email: string, password: string) {
    const data = {
      email,
      password,
      returnSecureToken: true
    };

    return this.http
      .post<AuthRespose>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDbzqPQqrtvPmuL1VHgr-Spaf1kpA3nTUg', data)
      .pipe(
        catchError(this.handleError),
        tap(response => {
          this.handleSuccess(response);
        })
      );
  }

  login(email: string, password: string) {
    const data = {
      email,
      password,
      returnSecureToken: true
    };

    return this.http
      .post<AuthRespose>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDbzqPQqrtvPmuL1VHgr-Spaf1kpA3nTUg', data)
      .pipe(
        catchError(this.handleError),
        tap(response => {
          this.handleSuccess(response);
        })
      );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
  }

  private handleSuccess(response: AuthRespose) {
    const expirationDate = new Date(
      new Date().getTime() + (+response.expiresIn * 1000)
    );
    const user = new User(
      response.localId,
      response.email,
      response.idToken,
      expirationDate
    );

    this.user.next(user);
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'An unknown error ocurred.';

    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMessage);
    }

    switch(errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'The email already exists.';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'The email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'The password is not correct.';
        break;
    }

    return throwError(errorMessage);
  }
}
