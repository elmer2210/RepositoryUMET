import { Component } from '@angular/core';
import { BrowseByMetadataPageComponent as BaseComponent } from '../../../../../app/browse-by/browse-by-metadata-page/browse-by-metadata-page.component';

/** Icon mapping by browse ID (Font Awesome class names) */
const BROWSE_ICONS: Record<string, string> = {
  title:      'fa-book-open',
  author:     'fa-user-friends',
  dateissued: 'fa-calendar-alt',
  subject:    'fa-tags',
  type:       'fa-layer-group',
};

@Component({
  selector: 'ds-browse-by-metadata-page',
  styleUrls: ['./browse-by-metadata-page.component.scss'],
  templateUrl: './browse-by-metadata-page.component.html'
})

/**
 * Component for determining what Browse-By component to use depending on the metadata (browse ID) provided
 */
export class BrowseByMetadataPageComponent extends BaseComponent {

  /** Returns the Font Awesome icon class for the current browse type */
  getBrowseIcon(): string {
    return BROWSE_ICONS[this.browseId] ?? 'fa-search';
  }
}
