import { Component, ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CatalogosService } from '../../services/catalogos.service';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css'],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 }))
      ]),
      state('intermediate', style({ opacity: 0.5 })),
    ]),
  ]
})
export class CatalogoComponent implements AfterViewInit {
  @ViewChild('footer') footer!: ElementRef;
  @ViewChild('indice') indice!: ElementRef;
  private originalIndiceTop: number = 27.8;
  items: any[] = [];
  letra: any;
  productosPorFila: number = 4;
  animationState: string = 'visible';
  selectedSvg: string | null = null;
  isLoading: boolean = true;
  isLoading2: boolean = false;
  isAnimationReady: boolean = false;

  constructor(private router: Router, private changeDetectorRef: ChangeDetectorRef, private route: ActivatedRoute, private catalogoService: CatalogosService, private ngZone: NgZone) {
    this.onWindowScroll = this.onWindowScroll.bind(this);
  }

  ngOnInit(): void {
    this.adjustIndicePosition();
    this.selectSvg('svg3');
    this.route.paramMap.subscribe(params => {
      const opcion = params.get('opcion');
      if (opcion) {
        this.letra = opcion;
        if (opcion === "Todo") {
          this.catalogoService.obtenerCatalogoPorTodo().subscribe(this.procesarDatos());
        } else {
          this.catalogoService.obtenerCatalogoPorOpcion(opcion).subscribe(this.procesarDatos());
        }
      }
    });
  }

  private procesarDatos() {
    return (data: any) => {
      const tiempoEsperaMinimo = 1000;

      setTimeout(() => {
        this.isLoading = false;
        this.isLoading2 = false;
        this.items = data;
        this.changeDetectorRef.detectChanges();
        this.adjustIndicePosition();
        this.startFadeAnimation();
      }, tiempoEsperaMinimo);
    };
  }


  onCategoriaChange(categoria: string) {
    this.isLoading2 = true;
    this.changeDetectorRef.detectChanges();

    this.router.navigate(['/catalogos', categoria]).then(() => {
      setTimeout(() => {
        this.cargarItems(categoria);
      }, 100);
    });
  }

  private cargarItems(categoria: string) {
    this.items = [];

    if (categoria === "Todo") {
      this.catalogoService.obtenerCatalogoPorTodo().subscribe(this.procesarDatos());
    } else {
      this.catalogoService.obtenerCatalogoPorOpcion(categoria).subscribe(this.procesarDatos());
    }
  }


  trackByFn(index: any, item: any) {
    return item._id;
  }

  private startFadeAnimation() {
    const elements = document.querySelectorAll('.divProductos');
    elements.forEach(el => (el as HTMLElement).classList.remove('fade-animation'));

    if (elements.length > 0) {
      void (elements[0] as HTMLElement).offsetWidth;
    }

    elements.forEach(el => (el as HTMLElement).classList.add('fade-animation'));
    this.changeDetectorRef.detectChanges();
  }


  ngAfterViewInit() {
    this.adjustIndicePosition();
    window.addEventListener('scroll', this.onWindowScroll);
    this.changeDetectorRef.detectChanges();
  }

  private onWindowScroll() {
    this.adjustIndicePosition();
  }

  private adjustIndicePosition() {
    if (!this.footer?.nativeElement || !this.indice?.nativeElement) {
      return;
    }

    const footerRect = this.footer.nativeElement.getBoundingClientRect();
    const indiceRect = this.indice.nativeElement.getBoundingClientRect();
    const footerTop = footerRect.top;
    const indiceHeight = indiceRect.height;

    if (footerTop - indiceHeight < -199) {
      this.indice.nativeElement.style.position = 'fixed';
      this.indice.nativeElement.style.bottom = '0';
      this.indice.nativeElement.style.top = '1.8%';
    } else {
      this.indice.nativeElement.style.position = 'fixed';
      this.indice.nativeElement.style.top = `${this.originalIndiceTop}%`;
      this.indice.nativeElement.style.bottom = 'auto';
    }
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onWindowScroll);
  }

  toggleFadeAnimation() {
    this.animationState = 'invisible';
    setTimeout(() => this.animationState = 'visible', 0);
  }

  selectSvg(id: string) {
    ['svg1', 'svg2', 'svg3', 'svg4', 'svg5'].forEach(svgId => {
      const svg = document.getElementById(svgId);
      if (svg) {
        svg.style.fill = '#D1D2D1';
      }
    });

    const selectedSvg = document.getElementById(id);
    if (selectedSvg) {
      selectedSvg.style.fill = 'black';
    }

    if (id === 'svg1') {
      this.productosPorFila = 2;
    } else if (id === 'svg2') {
      this.productosPorFila = 3;
    } else if (id === 'svg3') {
      this.productosPorFila = 4;
    } else if (id === 'svg4') {
      this.productosPorFila = 5;
    } else if (id === 'svg5') {
      this.productosPorFila = 1;
    }

    const elements = document.querySelectorAll('.divProductos');

    // Remover la clase que aplica la animación
    elements.forEach(el => (el as HTMLElement).classList.remove('fade-animation'));

    // Forzar el reflujo del DOM
    if (elements.length > 0) {
      void (elements[0] as HTMLElement).offsetWidth;
    }

    // Volver a aplicar la clase para reiniciar la animación
    elements.forEach(el => (el as HTMLElement).classList.add('fade-animation'));
  }

}
