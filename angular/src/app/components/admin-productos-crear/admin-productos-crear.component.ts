import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CatalogosService } from '../../services/catalogos.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { CurrencyService } from 'src/app/services/currency.service';
import { Router } from '@angular/router';

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

  constructor(private router: Router, private route: ActivatedRoute, private fb: FormBuilder, private catalogosService: CatalogosService, private cd: ChangeDetectorRef, private currencyService: CurrencyService) {
    this.formularioCatalogo = this.fb.group({
      tipoMaquina: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precioComercial: ['$ 0', Validators.required],
      precio: ['$ 0', Validators.required],
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
          precioComercial: this.formatSalary(data.precioComercial),
          precio: this.formatSalary(data.precio),
          estado: data.estado,
          imagenes: data.imagenes
        });
        this.imagenesSeleccionadas = data.imagenes.map((imagenes: { url: any; }) => imagenes.url);
      })
      this.titulo = 'Actualización de Catalogo';
    }
  }

  agregarImagenes() {
    this.imagenesSeleccionadas = []

    const input = document.getElementById('imagenes') as HTMLInputElement;
    if (input.files) {
      const files: FileList = input.files;
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.readAsDataURL(files[i]);
        reader.onload = () => {
          if (this.imagenesSeleccionadas) {
            this.imagenesSeleccionadas.push(reader.result as string);
            this.cd.detectChanges();
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
    formData.append('precioComercial', this.desformatearMoneda(this.formularioCatalogo.get('precioComercial')?.value).toString());
    formData.append('precio', this.desformatearMoneda(this.formularioCatalogo.get('precio')?.value).toString());
    formData.append('estado', this.formularioCatalogo.get('estado')?.value);

    for (let i = 0; i < this.imagenesSeleccionadas.length; i++) {
      const imagen = this.imagenesSeleccionadas[i];
      if (this.esURIdeDatos(imagen)) {
        const blob = this.dataURItoBlob(imagen);
        formData.append('imagenes', blob, `image-${i + 1}`);
      }else{
        console.log('Manejando una URL de imagen:', imagen);  
      }
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
          title: 'Catálogo actualizado',
          text: 'El catálogo ha sido actualizado exitosamente',
          showConfirmButton: false,
          timer: 2000
        });
        this.router.navigate(['/adminProductos/todo']);
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
          this.router.navigate(['/adminProductos/todo']);
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

  esURIdeDatos(cadena: string): boolean {
    return cadena.startsWith('data:');
  }

  dataURItoBlob(dataURI: string): Blob {
    if (!this.esURIdeDatos(dataURI)) {
      console.error('La cadena proporcionada no es una URI de datos:', dataURI);
      throw new Error('La cadena proporcionada no es una URI de datos.');
    }

    const parts = dataURI.split(',');
    if (parts[0].indexOf('base64') === -1) {
      throw new Error('La URI de datos no está codificada en base64.');
    }

    try {
      const byteString = atob(parts[1]);
      const mimeString = parts[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    } catch (error) {
      console.error('Error al convertir la URI de datos en blob:', error);
      return new Blob(); // Retornar un Blob vacío como medida de seguridad
    }
  }


  unformatCurrency(value: string): number {
    const numericValue = value.replace(/[^0-9,]/g, '').replace('.', '').replace(',', '.');
    return numericValue ? parseFloat(numericValue) : 0;
  }

  onCurrencyInput2(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let inputValue = this.unformatCurrency(inputElement.value);
    if (!isNaN(inputValue)) {
      const formattedValue = this.currencyService.formatCurrency(inputValue);
      inputElement.value = formattedValue;
    } else {
      inputElement.value = '';
    }
  }

  desformatearMoneda(valorFormateado: any): number {
    const valorComoCadena = (valorFormateado ?? '').toString();
    const valorNumerico = valorComoCadena.replace(/[^\d-]/g, '');
    const resultado = parseFloat(valorNumerico);
    return !isNaN(resultado) ? resultado : 0;
  }

  formatSalary(salary: any): string {
    if (typeof salary === 'string' && salary.includes('$')) {
      return salary;
    }

    let numberSalary = typeof salary === 'string' ? parseFloat(salary) : salary;

    if (isNaN(numberSalary) || numberSalary === null) {
      return '-';
    }

    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numberSalary);
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