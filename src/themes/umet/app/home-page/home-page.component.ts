import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HomePageComponent as BaseComponent } from '../../../../app/home-page/home-page.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'ds-home-page',
  styleUrls: [
    '../../../../app/home-page/home-page.component.scss',
    './home-page.component.scss'
  ],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent extends BaseComponent implements OnInit {

  totalDocumentos = 0;
  totalAutores = 0;
  totalColecciones = 0;
  totalDescargas = 15290; // Valor fijo hasta conectar Solr Statistics

  private http = inject(HttpClient);

  override ngOnInit(): void {
    super.ngOnInit();

    const restUrl = `${environment.rest.ssl ? 'https' : 'http'}://${environment.rest.host}:${environment.rest.port}${environment.rest.nameSpace}`;

    // Documentos: usar discover/search (accesible sin autenticación)
    // La respuesta tiene estructura: _embedded.searchResult.page.totalElements
    this.http.get<any>(`${restUrl}/api/discover/search/objects?dsoType=ITEM&size=1`).subscribe(data => {
      const total = data?._embedded?.searchResult?.page?.totalElements;
      if (total != null) {
        this.totalDocumentos = total;
      }
    });

    // Colecciones: endpoint público con paginación estándar
    this.http.get<any>(`${restUrl}/api/core/collections?size=1`).subscribe(data => {
      if (data.page?.totalElements != null) {
        this.totalColecciones = data.page.totalElements;
      }
    });

    // Autores: índice de browse, paginación estándar
    this.http.get<any>(`${restUrl}/api/discover/browses/author/entries?size=1`).subscribe(data => {
      if (data.page?.totalElements != null) {
        this.totalAutores = data.page.totalElements;
      }
    });
  }
}
