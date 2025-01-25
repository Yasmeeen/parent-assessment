import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  private apiUrl = 'https://reqres.in/api';

  constructor(private http: HttpClient, private router: Router) {}


  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    console.log("localStorage.getItem('token')",localStorage.getItem('token'));

    return !!localStorage.getItem('token'); // Check if token exists
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
