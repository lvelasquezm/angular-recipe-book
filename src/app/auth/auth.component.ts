import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

import { AuthService, AuthRespose } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isLoading: boolean = false;
  isLoginMode: boolean = true;
  error: string = null;

  constructor(private authService: AuthService) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;

    const email = form.value.email;
    const password = form.value.password;

    let authObservable: Observable<AuthRespose>;
    this.isLoading = true;

    if (this.isLoginMode) {
      authObservable = this.authService.login(email, password);
    } else {
      authObservable = this.authService.signup(email, password);
    }

    authObservable
      .subscribe(
        response => {
          this.isLoading = false;
          console.log('AuthSuccess => ', response)
        },
        errorMessage => {
          this.isLoading = false;
          this.error = errorMessage;
          console.log('AuthError => ', errorMessage);
        },
      );

    form.reset();
  }
}
