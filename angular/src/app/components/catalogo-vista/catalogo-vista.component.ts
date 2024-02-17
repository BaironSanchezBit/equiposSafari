import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CatalogosService } from 'src/app/services/catalogos.service';
import { ImageModalComponent } from '../image-modal/image-modal.component';

@Component({
  selector: 'app-catalogo-vista',
  templateUrl: './catalogo-vista.component.html',
  styleUrls: ['./catalogo-vista.component.css']
})

export class CatalogoVistaComponent implements OnInit {
  @ViewChild('zoomLens', { static: false }) zoomLens?: ElementRef;
  @ViewChild(ImageModalComponent) modalComponent!: ImageModalComponent;
  item: any = { imagenes: [] };
  imagenPrincipalUrl?: string;
  imagenSeleccionada: string = '';
  imageObject: Array<string> = [];
  imagenSeleccionadaIndex: number = 0;
  showModal: boolean = false;

  constructor(private route: ActivatedRoute, private catalogoService: CatalogosService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.catalogoService.obtenerCatalogoPorId(id).subscribe((data: any) => {
          this.item = data;

          if (this.item && this.item.imagenes.length > 0) {
            this.imagenSeleccionada = this.item.imagenes[0].url;
            this.imagenPrincipalUrl = this.item.imagenes[0].url;

          }

          this.imageObject = this.item.imagenes.map((imagen: any) => imagen.url);
        });
      }
    });
  }

  abrirImagenEnModal(index: number): void {
    this.imagenSeleccionadaIndex = index;
    this.showModal = true;

    if (this.modalComponent) {
      this.modalComponent.title = this.item?.nombre;
    }
  }

  onCloseModal(event: MouseEvent): void {
    const element = event.target as HTMLElement;
    if (element.classList.contains('modal-container')) {
      this.showModal = false;
    }
  }

  zoomImage(event: MouseEvent): void {
    const img = event.target as HTMLElement;
    const rect = img.getBoundingClientRect();

    let x = (event.clientX - rect.left) / rect.width * 100;
    let y = (event.clientY - rect.top) / rect.height * 100;

    x = Math.max(Math.min(x, 100), 0);
    y = Math.max(Math.min(y, 100), 0);

    img.style.transformOrigin = `${x}% ${y}%`;
    img.style.transform = 'scale(3)';
  }

  removeZoom(): void {
    const img = (event?.target as HTMLElement);
    img.style.transformOrigin = 'center center';
    img.style.transform = 'scale(1)';
  }

  cambiarImagenPrincipal(url: string, index: number): void {
    const imgElement = document.querySelector('.img-principal');
    imgElement?.classList.add('fade-out');

    setTimeout(() => {
      this.imagenPrincipalUrl = url;
      this.imagenSeleccionada = url;
      this.imagenSeleccionadaIndex = index;
      imgElement?.classList.remove('fade-out');
    }, 300);
  }

}
