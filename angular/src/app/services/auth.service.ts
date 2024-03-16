import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { catchError, map, tap } from 'rxjs/operators';
import { JwtResponseI } from '../models/jwt-response';
import { Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url: string = "http://localhost:4000/api";
  private imageSource = new BehaviorSubject<string>('');
  currentImage = this.imageSource.asObservable();

  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) { }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  changeImage(imageUrl: string) {
    this.imageSource.next(imageUrl);
  }

  createUser(userData: any): Observable<any> {
    const user = JSON.parse(this.cookieService.get('user') || '{}');
    const token = user.accessToken;

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    const url_api = `${this.url}/app-admin/register`;

    return this.http.post<any>(url_api, userData, { headers: headers });
  }

  loginUserUsuario(email: string, password: string): Observable<JwtResponseI> {
    const url_api = `${this.url}/adminLogin/login`
    return this.http.post<JwtResponseI>(url_api, { email, password }, { headers: this.headers })
      .pipe(map(res => {
        if (res && res.data && res.data.accessToken) {
          this.setUser(res.data);
          return res;
        } else {
          let errorMessage = 'Unknown error';
          if (res && res.message) {
            errorMessage = res.message;
          }
          throw new Error(errorMessage);
        }
      }));
  }

  isTokenExpired(): boolean {
    const token = this.cookieService.get('user');
    if (!token) return true;

    const decodedToken = jwtDecode(token) as { exp: number };

    if (decodedToken && decodedToken.exp) {
      const expirationDate = new Date(decodedToken.exp * 1000);
      return expirationDate <= new Date();
    }

    return true;
  }

  setUser(user: any): void {
    this.cookieService.set('user', JSON.stringify(user));
  }

  getRoleFromToken(): string | null {
    const user = this.getUser();
    if (!user || !user.accessToken) {
      return null;
    }
    const decodedToken = jwtDecode(user.accessToken) as any;
    return decodedToken.role;
  }

  isAdmin(): boolean {
    const role = this.getRoleFromToken();
    return role === 'Admin';
  }

  getUserDetails(): Observable<any> {
    const user = this.getUser();
    const decodedToken = jwtDecode(user.accessToken) as any;
    const userId = decodedToken.id;
    return this.getUserById(userId);
  }

  getUserByIdAdmin(id: string): Observable<any> {
    const url_api = `${this.url}/getuser/${id}`;
    return this.http.get(url_api);
  }

  getUserById(id: string): Observable<any> {
    const url_api = `${this.url}/user/${id}`;
    return this.http.get(url_api);
  }

  getUserAll(): Observable<any> {
    const url_api = `${this.url}/users`;
    return this.http.get(url_api);
  }

  actualizarEstadoPostulacion(usuarioId: string, ofertaId: string, nuevoEstado: string): Observable<any> {
    return this.http.put(`${this.url}/users/${usuarioId}/update-application-status`, { ofertaId, estado: nuevoEstado });
  }

  getUser(): any {
    const user = JSON.parse(this.cookieService.get('user') || '{}');
    return user;
  }

  getToken() {
    const user = this.getUser();
    return user.accessToken;
  }

  logoutUser(): Observable<any> {
    let user = this.getUser();
    let accessToken = user.accessToken;
    const url_api = `${this.url}/adminLogin/logout?accessToken=${accessToken}`;
    this.cookieService.deleteAll();
    return this.http.post(url_api, { headers: this.headers });
  }

  isLoggedIn(): boolean {
    const user = this.getUser();
    const accessToken = user.accessToken;
    return !!accessToken;
  }

  updateUser(id: string, userData: any): Observable<any> {
    if (!this.isLoggedIn()) {
      return throwError({ error: 'User is not authenticated' });
    }

    const url_api = `${this.url}/updateuser/${id}`;

    const user = JSON.parse(this.cookieService.get('user') || '{}');
    const token = user.accessToken;
    const headers = { 'Authorization': 'Bearer ' + token };

    return this.http.put(url_api, userData, { headers })
      .pipe(
        map((res) => res),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  deleteUser(id: string): Observable<any> {
    const user = JSON.parse(this.cookieService.get('user') || '{}');
    const token = user.accessToken;
    const headers = { 'Authorization': 'Bearer ' + token };

    const url_api = `${this.url}/deleteuser/${id}`;
    return this.http.delete(url_api, { headers: headers });
  }

  requestPasswordReset(email: string): Observable<any> {
    const url_api = `${this.url}/request-password-reset`;
    return this.http.post(url_api, { email }, { headers: this.headers }).pipe(
      catchError((error) => {
        console.error('Error al solicitar el cambio de contraseña:', error);
        throw error;
      })
    );
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    const url_api = `${this.url}/reset-password`;
    return this.http.post(url_api, { token, newPassword }, { headers: this.headers }).pipe(
      catchError((error) => {
        console.error('Error al cambiar la contraseña:', error);
        throw error;
      })
    );
  }

}
