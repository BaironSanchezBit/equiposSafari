import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Catalogo } from '../models/catalogo';
import { Observable, catchError, of, tap, throwError } from 'rxjs';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {

  private baseUrl = 'http://localhost:4000/api/';

  constructor(private http: HttpClient) { }

  crearCatalogo(catalogo: FormData): Observable<any> {
    const url = `${this.baseUrl}catalogos/crear`;
    return this.http.post(url, catalogo)
      .pipe(
        tap(() => {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Producto creado",
            showConfirmButton: false,
            timer: 1500,
          });
        }),
        catchError(error => {
          console.error(error);
          return throwError("Hubo un error al crear el catálogo");
        })
      );
  }

  obtenerCatalogoPorTodo(): Observable<any> {
    const url = `${this.baseUrl}adminProductos/Todo`;
    return this.http.get(url).pipe(
      catchError(error => {
        console.log(error);
        return of([]);
      })
    );
  }

  obtenerCatalogoPorOpcion(opcion: string): Observable<any> {
    const url = `${this.baseUrl}catalogos/${opcion}`;
    return this.http.get(url).pipe(
      catchError(error => {
        console.log(error);
        return of([]);
      })
    );
  }

  obtenerCatalogoPorId(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}catalogos/id/${id}`);
  }

  eliminarCatalogoPorId(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}adminProductos/delete/${id}`);
  }

  updateCatalogoPorId(id: string, catalogo: FormData): Observable<any>{
    return this.http.put(`${this.baseUrl}adminProductos/updateCatalogo/${id}`, catalogo);
  }
}
