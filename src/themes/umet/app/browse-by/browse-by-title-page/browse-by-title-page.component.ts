import { Component } from '@angular/core';
import { BrowseByTitlePageComponent as BaseComponent } from '../../../../../app/browse-by/browse-by-title-page/browse-by-title-page.component';

/** Icon mapping by browse ID (Font Awesome class names) */
const BROWSE_ICONS: Record<string, string> = {
  title:      'fa-book-open',
  author:     'fa-user-friends',
  dateissued: 'fa-calendar-alt',
  subject:    'fa-tags',
  type:       'fa-layer-group',
};

@Component({
  selector: 'ds-browse-by-title-page',
  styleUrls: ['../browse-by-metadata-page/browse-by-metadata-page.component.scss'],
  templateUrl: '../browse-by-metadata-page/browse-by-metadata-page.component.html'
})
export class BrowseByTitlePageComponent extends BaseComponent {

  /** Returns the Font Awesome icon class for the current browse type */
  getBrowseIcon(): string {
    return BROWSE_ICONS[this.browseId] ?? 'fa-search';
  }
}
