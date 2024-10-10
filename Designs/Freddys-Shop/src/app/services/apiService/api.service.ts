// src/app/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { APIConfig } from "./api.conf";
import { OrdersResponse, GetDashboardDataResponse } from '../../types/types';


interface RefreshTokenResponse {
  access_token: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

@Injectable({
  providedIn: 'root',
})

export class ApiService {

  constructor(private http: HttpClient) { }

  private getAccessToken(): string | null {
    return sessionStorage.getItem(APIConfig.tokenStorageKey);
  }

  private getRefreshToken(): string | null {
    return sessionStorage.getItem(APIConfig.refreshTokenStorageKey);
  }

  private refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${refreshToken}`,
      });

      return this.http.post<RefreshTokenResponse>(`${APIConfig.apiBaseUrl}/refresh`, {}, { headers });
    }
    return throwError(() => new Error('No refresh token found.'));
  }

  login(username: string, password: string): Observable<LoginResponse> {
    const loginUrl = `${APIConfig.apiBaseUrl}/login`;
    return this.http.post<LoginResponse>(loginUrl, { username, password }).pipe(
      catchError((error) => {
        console.error('Login error:', error);
        throw error;
      })
    );
  }

  getDashboardData(): Observable<GetDashboardDataResponse> {
    const accessToken = this.getAccessToken();
    if (accessToken) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      });
      const url = `${APIConfig.apiBaseUrl}/dashboard`;
      return this.http.get<GetDashboardDataResponse>(url, { headers }).pipe(
        catchError((error) => {
          if (error.status === 401) {
            return this.refreshToken().pipe(
              switchMap((newToken: RefreshTokenResponse) => {
                const newHeaders = new HttpHeaders({
                  Authorization: `Bearer ${newToken.access_token}`,
                });
                return this.http.get<GetDashboardDataResponse>(url, {
                  headers: newHeaders,
                });
              })
            );
          } else {
            return throwError(() => new Error('Failed to fetch dashboard data.'));
          }
        })
      );
    }
    return throwError(() => new Error('No access token found.'));
  }


  getOrders(page: number, searchTerm: string): Observable<OrdersResponse> {
    const accessToken = this.getAccessToken();
    if (accessToken) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      });

      const url = `${APIConfig.apiBaseUrl}/orders?page=${page}&q=${searchTerm}`;

      return this.http.get<OrdersResponse>(url, { headers }).pipe(
        catchError((error) => {
          if (error.status === 401) {
            return this.refreshToken().pipe(
              switchMap((newToken: RefreshTokenResponse) => {
                const newHeaders = new HttpHeaders({
                  Authorization: `Bearer ${newToken.access_token}`,
                });
                return this.http.get<OrdersResponse>(url, {
                  headers: newHeaders,
                });
              })
            );
          } else {
            return throwError(() => new Error('Failed to fetch orders.'));
          }
        })
      );
    }
    return throwError(() => new Error('No access token found.'));
  }
}
