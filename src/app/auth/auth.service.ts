import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

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
        catchError(this.handleError)
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
        catchError(this.handleError)
      );
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
