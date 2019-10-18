import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';

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
  user = new Subject<User>();

  constructor(private http: HttpClient) {}

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
        tap(this.handleSuccess)
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
        tap(this.handleSuccess)
      );
  }

  private handleSuccess(response: AuthRespose) {
    const expirationDate = new Date(
      new Date().getTime() + +response.expiresIn
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
