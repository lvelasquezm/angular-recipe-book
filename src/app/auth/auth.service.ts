import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface AuthRespose {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
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
        catchError(errorResponse => {
          let errorMessage = 'An unknown error ocurred.';

          if (!errorResponse.error || !errorResponse.error.error) {
            return throwError(errorMessage);
          }

          switch(errorResponse.error.error.message) {
            case 'EMAIL_EXISTS':
              errorMessage = 'The email already exists.';
              break;
          }

          return throwError(errorMessage);
        })
      );
  }
}
