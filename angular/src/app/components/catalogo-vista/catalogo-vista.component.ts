import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CatalogosService } from 'src/app/services/catalogos.service';

@Component({
  selector: 'app-catalogo-vista',
  templateUrl: './catalogo-vista.component.html',
  styleUrls: ['./catalogo-vista.component.css']
})
export class CatalogoVistaComponent {

  item: any;

  constructor(private route: ActivatedRoute, private catalogoService: CatalogosService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.catalogoService.obtenerCatalogoPorId(id).subscribe((data: any) => {
          this.item = data;
        });
      }
    });
  }
}
