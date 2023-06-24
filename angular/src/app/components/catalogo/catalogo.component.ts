import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CatalogosService } from '../../services/catalogos.service';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent {
  
  items: any[] = [];
  letra: any;

  constructor(private route: ActivatedRoute, private catalogoService: CatalogosService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const opcion = params.get('opcion');
      this.letra = opcion;
      if (opcion) {
        this.catalogoService.obtenerCatalogoPorOpcion(opcion).subscribe((data: any) => {
          this.items = data;
        });      
      }
    });
  }
}
