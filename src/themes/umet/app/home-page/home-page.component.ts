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
  totalDescargas = 0;

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

    // Descargas: obtener site UUID → consultar statistics/usagereports
    this.http.get<any>(`${restUrl}/api/core/sites`)
      .pipe(catchError(() => of(null)))
      .subscribe(siteData => {
        const siteLink = siteData?._embedded?.sites?.[0]?._links?.self?.href;
        if (!siteLink) { return; }

        this.http.get<any>(`${restUrl}/api/statistics/usagereports/search/object?uri=${encodeURIComponent(siteLink)}`)
          .pipe(catchError(() => of(null)))
          .subscribe(statsData => {
            const reports: any[] = statsData?._embedded?.usagereports ?? [];
            const downloadsReport = reports.find((r: any) => r.reportType === 'TotalDownloads');
            if (!downloadsReport) { return; }

            const total = (downloadsReport.points ?? []).reduce((sum: number, point: any) => {
              return sum + (point.values?.downloads ?? point.values?.views ?? 0);
            }, 0);
            this.totalDescargas = total;
          });
      });
  }
}
