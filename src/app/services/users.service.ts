import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = 'https://reqres.in/api/users';

  constructor(private http: HttpClient) {}

  getUsers(page: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}`);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${userId}`);
  }

  createUser(userData: any): Observable<any> {
    return this.http.post(this.apiUrl, userData);
  }

  getUser(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }

  updateUser(userId:number,params: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}`, params);
  }
}
