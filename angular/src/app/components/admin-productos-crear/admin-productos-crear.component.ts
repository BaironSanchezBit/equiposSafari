import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CatalogosService } from '../../services/catalogos.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-productos-crear',
  templateUrl: './admin-productos-crear.component.html',
  styleUrls: ['./admin-productos-crear.component.css']
})
export class AdminProductosCrearComponent {
  formularioCatalogo: FormGroup;
  selectedFiles: FileList | null = null;
  imagenesSeleccionadas: string[] = [];
  item: any;
  id: string | null = "";
  titulo = 'Creación de Catalogo';

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private catalogosService: CatalogosService, private cd: ChangeDetectorRef) {
    this.formularioCatalogo = this.fb.group({
      tipoMaquina: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precioComercial: ['', Validators.required],
      precio: ['', Validators.required],
      estado: ['', Validators.required],
      imagenes: [null]
    });
  }

  get formularioCatalogoControls() {
    return this.formularioCatalogo.controls;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.catalogosService.obtenerCatalogoPorId(id).subscribe((data: any) => {
          this.item = data;
        });
      }
    });
    this.id = this.route.snapshot.paramMap.get('id');
    this.accionSolicitada();
  }

  accionSolicitada() {
    if (this.id !== null) {
      this.catalogosService.obtenerCatalogoPorId(this.id).subscribe((data: any) => {
        this.formularioCatalogo.setValue({
          tipoMaquina: data.tipoMaquina,
          nombre: data.nombre,
          descripcion: data.descripcion,
          precioComercial: data.precioComercial,
          precio: data.precio,
          estado: data.estado,
          imagenes: data.imagenes
        });
        this.imagenesSeleccionadas = data.imagenes.map((imagenes: { url: any; }) => imagenes.url);
      })
      this.titulo = 'Actualización de Catalogo';
    }
  }

  agregarImagenes() {
    const input = document.getElementById('imagenes') as HTMLInputElement;
    if (input.files) {
      const files: FileList = input.files;
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.readAsDataURL(files[i]);
        reader.onload = () => {
          if (this.imagenesSeleccionadas) {
            this.imagenesSeleccionadas.push(reader.result as string);
            this.cd.detectChanges(); // Agregar detección de cambios
          }
        };
      }
    }
  }

  onSubmit(): void {
    if (this.formularioCatalogo.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('tipoMaquina', this.formularioCatalogo.get('tipoMaquina')?.value);
    formData.append('nombre', this.formularioCatalogo.get('nombre')?.value);
    formData.append('descripcion', this.formularioCatalogo.get('descripcion')?.value);
    formData.append('precioComercial', this.formularioCatalogo.get('precioComercial')?.value);
    formData.append('precio', this.formularioCatalogo.get('precio')?.value);
    formData.append('estado', this.formularioCatalogo.get('estado')?.value);

    for (let i = 0; i < this.imagenesSeleccionadas.length; i++) {
      const blob = this.dataURItoBlob(this.imagenesSeleccionadas[i]);
      formData.append('imagenes', blob, `image-${i + 1}`);
    }

    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('imagenes', this.selectedFiles[i], this.selectedFiles[i].name);
      }
    }

    if (this.id !== null) {
      this.catalogosService.updateCatalogoPorId(this.id, formData).subscribe((data) => {
        Swal.fire({
          icon: 'success',
          title: 'Catálogo creado',
          text: 'El catálogo ha sido creado exitosamente',
          showConfirmButton: false,
          timer: 2000
        });
        this.formularioCatalogo.reset();
        this.selectedFiles = null;
        this.imagenesSeleccionadas = [];
      }, (err: any) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al crear el catálogo. Por favor, inténtelo de nuevo',
          confirmButtonText: 'Ok'
        });
      });
    } else {
      this.catalogosService.crearCatalogo(formData).subscribe(
        (_res) => {
          Swal.fire({
            icon: 'success',
            title: 'Catálogo creado',
            text: 'El catálogo ha sido creado exitosamente',
            showConfirmButton: false,
            timer: 2000
          });
          this.formularioCatalogo.reset();
          this.selectedFiles = null;
          this.imagenesSeleccionadas = [];
        },
        (err) => {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al crear el catálogo. Por favor, inténtelo de nuevo',
            confirmButtonText: 'Ok'
          });
        }
      );
    }
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

  eliminarImagen(index: number) {
    Swal.fire({
      title: '¿Está seguro?',
      text: '¿Desea eliminar la imagen seleccionada?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        // El usuario hizo clic en el botón "Sí, eliminar"
        this.imagenesSeleccionadas.splice(index, 1);
        const files = this.formularioCatalogo.get('imagenes')?.value as FileList;
        const nuevasImagenes: File[] = [];
        if (files && files.length) {
          for (let i = 0; i < files.length; i++) {
            if (i !== index) {
              nuevasImagenes.push(files[i]);
            }
          }
        }
        this.formularioCatalogo.patchValue({
          imagenes: nuevasImagenes
        });
        this.selectedFiles = null;
        Swal.fire(
          '¡Eliminada!',
          'La imagen ha sido eliminada.',
          'success'
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // El usuario hizo clic en el botón "Cancelar" o cerró la alerta
        Swal.fire(
          'Cancelado',
          'La imagen no ha sido eliminada.',
          'error'
        );
      }
    });
  }
}