import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { catchError, map } from 'rxjs/operators';
import { JwtResponseI } from '../models/jwt-response';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: any;

  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) { }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  registerUser(nombre: string, apellido: string, telefono: string, email: string, password: string): Observable<any> {
    const url_api = "http://localhost:4000/api/register";
    return this.http.post(url_api, { nombre, apellido, telefono, email, password }, { headers: this.headers })
      .pipe(map(res => res));
  }

  loginUserName(nombre: string, password: string): Observable<JwtResponseI> {
    const url_api = "http://localhost:4000/api/adminLogin/login"
    return this.http.post<JwtResponseI>(url_api, { nombre, password }, { headers: this.headers })
      .pipe(map(res => {
        if (res && res.data && res.data.accessToken) {
          this.setToken(res.data.accessToken);
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

  loginUser(email: string, password: string): Observable<JwtResponseI> {
    const url_api = "http://localhost:4000/api/login"
    return this.http.post<JwtResponseI>(url_api, { email, password }, { headers: this.headers })
      .pipe(map(res => {
        if (res && res.data && res.data.accessToken) {
          this.setToken(res.data.accessToken);
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

  setUser(user: any): void {
    this.cookieService.set('user', JSON.stringify(user));
  }

  getUserById(id: string): Observable<any> {
    const url_api = `http://localhost:4000/api/user/${id}`;
    return this.http.get(url_api);
  }

  getUser(): any {
    const user = JSON.parse(this.cookieService.get('user') || '{}');
    return user;
  }

  setToken(token: string): void {
    const user = this.getUser(); //obtener usuario actual
    user.accessToken = token;
}

  getToken() {
    const user = this.getUser(); //obtener usuario actual
    return user.accessToken;
  }

  logoutUser(): Observable<any> {
    let user = this.getUser(); //obtener usuario actual
    let accessToken = user.accessToken;
    const url_api = `http://localhost:4000/api/adminLogin/logout?accessToken=${accessToken}`;
    this.cookieService.deleteAll();
    return this.http.post(url_api, { headers: this.headers });
  }

  isLoggedIn(): boolean {
    const user = this.getUser(); //obtener usuario actual
    const accessToken = user.accessToken;
    return !!accessToken; // retorna verdadero si el token existe y es válido
  }

  updateUser(id: string, nombre: string, apellido: string, telefono: string): Observable<any> {
    // Verifica si el usuario está autenticado
    if (!this.isLoggedIn()) {
      return throwError({ error: 'User is not authenticated' });
    }

    const url_api = `http://localhost:4000/api/users/${id}`;
    const accessToken = this.getToken();

    // Agregar el token de acceso a los headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    });

    const body = { nombre: nombre, apellido: apellido, telefono: telefono }; // Crear el objeto con el nombre a actualizar

    return this.http.put(url_api, body, { headers }) // Enviar el objeto como cuerpo de la petición
      .pipe(
        map((res) => res),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  validPassword(id: string, password: string): Observable<any> {
    const url_api = `http://localhost:4000/api/comparePassword`;
    const data = { id, password };
    return this.http.post(url_api, data);
  }

}


