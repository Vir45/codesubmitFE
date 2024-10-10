import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { APIConfig } from '../apiService/api.conf';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  public loggedIn$ = this.loggedInSubject.asObservable();

  constructor() {
    if (sessionStorage.getItem(APIConfig.tokenStorageKey)) {
      this.loggedInSubject.next(true);
    }
  }

  login(accessToken: string, refreshToken: string): void {
    sessionStorage.setItem(APIConfig.tokenStorageKey, accessToken);
    sessionStorage.setItem(APIConfig.refreshTokenStorageKey, refreshToken);
    this.loggedInSubject.next(true);
  }

  logout(): void {
    sessionStorage.removeItem(APIConfig.tokenStorageKey);
    sessionStorage.removeItem(APIConfig.refreshTokenStorageKey);
    this.loggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }
}
