import { Component, OnInit } from '@angular/core';
import { ViewMode } from '../../../../../../../../app/core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { Item } from '../../../../../../../../app/core/shared/item.model';
import { Context } from '../../../../../../../../app/core/shared/context.model';
import { ItemListElementComponent as BaseComponent } from '../../../../../../../../app/shared/object-list/item-list-element/item-types/item/item-list-element.component';
import { getItemPageRoute } from '../../../../../../../../app/item-page/item-page-routing-paths';

@listableObjectComponent('Publication', ViewMode.ListElement, Context.Any, 'umet')
@listableObjectComponent(Item, ViewMode.ListElement, Context.Any, 'umet')
@Component({
  selector: 'ds-umet-item-list-element',
  styleUrls: ['./item-list-element.component.scss'],
  templateUrl: './item-list-element.component.html',
})
export class ItemListElementComponent extends BaseComponent implements OnInit {

  itemPageRoute: string;

  private static readonly TYPE_MAP: Record<string, string> = {
    'article':          'Artículo',
    'book':             'Libro',
    'book chapter':     'Capítulo de Libro',
    'thesis':           'Tesis',
    'bachelor thesis':  'Trabajo de Grado',
    'master thesis':    'Tesis de Maestría',
    'working paper':    'Documento de Trabajo',
    'report':           'Informe',
    'conference paper': 'Ponencia',
    'dataset':          'Conjunto de Datos',
    'image':            'Imagen',
    'video':            'Video',
    'audio':            'Audio',
    'software':         'Software',
    'other':            'Documento',
  };

  private static readonly CLASS_MAP: Record<string, string> = {
    'article':          'article',
    'book':             'book',
    'book chapter':     'book',
    'thesis':           'thesis',
    'bachelor thesis':  'thesis',
    'master thesis':    'thesis',
    'working paper':    'report',
    'report':           'report',
    'conference paper': 'conference',
    'dataset':          'dataset',
    'software':         'dataset',
    'image':            'media',
    'video':            'media',
    'audio':            'media',
  };

  get dso(): Item {
    return this.object;
  }

  get itemTypeLabel(): string {
    const raw = this.dso.firstMetadataValue('dc.type') ?? '';
    const mapped = ItemListElementComponent.TYPE_MAP[raw.toLowerCase().trim()];
    if (mapped) { return mapped; }

    const hasAdvisor = this.dso.allMetadata(['dc.contributor.advisor']).length > 0;
    if (hasAdvisor) { return 'Trabajo de Grado'; }

    return raw || '';
  }

  get typeClass(): string {
    const raw = this.dso.firstMetadataValue('dc.type') ?? '';
    const hasAdvisor = !raw && this.dso.allMetadata(['dc.contributor.advisor']).length > 0;
    if (hasAdvisor) { return 'thesis'; }
    return ItemListElementComponent.CLASS_MAP[raw.toLowerCase().trim()] ?? 'other';
  }

  get isOpenAccess(): boolean {
    return this.dso.allMetadataValues('dc.rights')
      .some(v => v.toLowerCase().trim() === 'openaccess');
  }

  allMetadataValues(keys: string[]): string[] {
    return this.dso.allMetadataValues(keys);
  }

  ngOnInit(): void {
    this.itemPageRoute = getItemPageRoute(this.dso);
  }
}
