import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { ApiService } from "../../services/apiService/api.service";
import { AuthService } from "../../services/authService/auth.service";

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.css'
})
export class LoginDialogComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  apiService = inject(ApiService);
  authService = inject(AuthService);

  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.apiService.login(username, password).pipe(
        catchError((error) => {
          this.errorMessage = error?.error?.msg;
          return of(null);
        })
      ).subscribe(response => {
        if (response && response.access_token) {
          this.errorMessage = '';
          this.authService.login(response.access_token, response.refresh_token);
          this.dialogRef.close();
        } else {
          this.errorMessage ? this.errorMessage : 'Login failed. Please check your credentials.';
        }
      });
    }
  }
}
