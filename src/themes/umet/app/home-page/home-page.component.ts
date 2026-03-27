import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
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
  totalVisitas = 0;

  private http = inject(HttpClient);

  override ngOnInit(): void {
    super.ngOnInit();

    const restUrl = `${environment.rest.ssl ? 'https' : 'http'}://${environment.rest.host}:${environment.rest.port}${environment.rest.nameSpace}`;

    // Documentos: usar discover/search (accesible sin autenticación)
    this.http.get<any>(`${restUrl}/api/discover/search/objects?dsoType=ITEM&size=1`)
      .pipe(catchError(() => of(null)))
      .subscribe(data => {
        const total = data?._embedded?.searchResult?.page?.totalElements;
        if (total != null) {
          this.totalDocumentos = total;
        }
      });

    // Colecciones: endpoint público con paginación estándar
    this.http.get<any>(`${restUrl}/api/core/collections?size=1`)
      .pipe(catchError(() => of(null)))
      .subscribe(data => {
        if (data?.page?.totalElements != null) {
          this.totalColecciones = data.page.totalElements;
        }
      });

    // Autores: índice de browse, paginación estándar
    this.http.get<any>(`${restUrl}/api/discover/browses/author/entries?size=1`)
      .pipe(catchError(() => of(null)))
      .subscribe(data => {
        if (data?.page?.totalElements != null) {
          this.totalAutores = data.page.totalElements;
        }
      });

    // Visitas: obtener site UUID → consultar usagereport TotalVisits
    this.http.get<any>(`${restUrl}/api/core/sites`)
      .pipe(catchError(() => of(null)))
      .subscribe(siteData => {
        const siteId = siteData?._embedded?.sites?.[0]?.uuid;
        if (!siteId) { return; }

        // Usar el endpoint directo de usagereports: {siteId}_TotalVisits
        this.http.get<any>(`${restUrl}/api/statistics/usagereports/${siteId}_TotalVisits`)
          .pipe(catchError(() => of(null)))
          .subscribe(report => {
            if (!report?.points) { return; }
            const total = report.points.reduce((sum: number, point: any) => {
              return sum + (point.values?.views ?? 0);
            }, 0);
            this.totalVisitas = total;
          });
      });
  }
}
