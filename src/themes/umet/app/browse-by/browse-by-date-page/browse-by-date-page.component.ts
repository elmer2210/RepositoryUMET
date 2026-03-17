import { Component } from '@angular/core';
import { BrowseByDatePageComponent as BaseComponent } from '../../../../../app/browse-by/browse-by-date-page/browse-by-date-page.component';

/** Icon mapping by browse ID */
const BROWSE_ICONS: Record<string, string> = {
  title:      'fa-book-open',
  author:     'fa-user-friends',
  dateissued: 'fa-calendar-alt',
  subject:    'fa-tags',
  type:       'fa-layer-group',
};

@Component({
  selector: 'ds-browse-by-date-page',
  styleUrls: ['../browse-by-metadata-page/browse-by-metadata-page.component.scss'],
  templateUrl: '../browse-by-metadata-page/browse-by-metadata-page.component.html'
})
export class BrowseByDatePageComponent extends BaseComponent {

  getBrowseIcon(): string {
    return BROWSE_ICONS[this.browseId] ?? 'fa-search';
  }
}
