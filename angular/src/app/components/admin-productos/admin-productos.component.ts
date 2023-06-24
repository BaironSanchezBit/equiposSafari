import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogosService } from 'src/app/services/catalogos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-productos',
  templateUrl: './admin-productos.component.html',
  styleUrls: ['./admin-productos.component.css']
})
export class AdminProductosComponent {
  items: any[] = [];
  item: any;

  constructor(private route: ActivatedRoute, private catalogoService: CatalogosService, private router: Router) { }

  onSubmit(): void {
  }

  dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const opcion = params.get('opcion') ?? 'todo';
      if (opcion == 'todo') {
        this.catalogoService.obtenerCatalogoPorTodo().subscribe((data: any) => {
          this.items = data;
        });
      } else {
        this.catalogoService.obtenerCatalogoPorOpcion(opcion).subscribe((data: any) => {
          this.items = data;
        });
      }
    });
  }

  redirectToFiltro(value: string) {
    let timerInterval: any;
    Swal.fire({
      title: 'Redirigiendo!',
      timer: 800,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      this.router.navigate(['/adminProductos', value]);
    });
  }

  eliminarCatalogoPorId(id: string) {
    Swal.fire({
      title: '¿Está seguro?',
      text: '¿Desea eliminar el producto seleccionado?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.catalogoService.eliminarCatalogoPorId(id).subscribe(
          res => {
            this.items = this.items.filter(item => item._id !== id);
          }
        );
        Swal.fire(
          '¡Eliminada!',
          'El producto ha sido eliminada.',
          'success'
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // El usuario hizo clic en el botón "Cancelar" o cerró la alerta
        Swal.fire(
          'Cancelado',
          'El producto no ha sido eliminada.',
          'error'
        );
      }
    });
  }


}
