import { Component } from '@angular/core';
import {
  listableObjectComponent
} from '../../../../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../../../../../../app/core/shared/view-mode.model';
import {
  ItemSearchResult
} from '../../../../../../../../../app/shared/object-collection/shared/item-search-result.model';
import {
  ItemSearchResultListElementComponent as BaseComponent
} from '../../../../../../../../../app/shared/object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component';
import { Context } from '../../../../../../../../../app/core/shared/context.model';

@listableObjectComponent('PublicationSearchResult', ViewMode.ListElement, Context.Any, 'umet')
@listableObjectComponent(ItemSearchResult, ViewMode.ListElement, Context.Any, 'umet')
@Component({
  selector: 'ds-item-search-result-list-element',
  styleUrls: ['./item-search-result-list-element.component.scss'],
  templateUrl: './item-search-result-list-element.component.html',
})
export class ItemSearchResultListElementComponent extends BaseComponent {

  private static readonly TYPE_MAP: Record<string, string> = {
    // Artículos
    'article':            'Artículo',
    'journal article':    'Artículo de Revista',
    // Libros
    'book':               'Libro',
    'book chapter':       'Capítulo de Libro',
    'bookchapter':        'Capítulo de Libro',
    // Tesis - variaciones
    'thesis':             'Tesis',
    'bachelor thesis':    'Tesis de Grado',
    'bachelorthesis':     'Tesis de Grado',
    'master thesis':      'Tesis de Maestría',
    'masterthesis':       'Tesis de Maestría',
    'doctoral thesis':    'Tesis Doctoral',
    'doctoralthesis':     'Tesis Doctoral',
    'phd thesis':         'Tesis Doctoral',
    'dissertation':       'Disertación',
    // Trabajos de grado
    'trabajo de grado':   'Trabajo de Grado',
    'tesis de grado':     'Tesis de Grado',
    'tesis de maestría':  'Tesis de Maestría',
    'tesis de maestria':  'Tesis de Maestría',
    'tesis doctoral':     'Tesis Doctoral',
    // Documentos académicos
    'working paper':      'Documento de Trabajo',
    'workingpaper':       'Documento de Trabajo',
    'report':             'Informe',
    'technical report':   'Informe Técnico',
    'conference paper':   'Ponencia',
    'conferencepaper':    'Ponencia',
    'conference object':  'Ponencia',
    'conference poster':  'Póster de Conferencia',
    'preprint':           'Preprint',
    // Multimedia
    'dataset':            'Conjunto de Datos',
    'image':              'Imagen',
    'video':              'Video',
    'audio':              'Audio',
    'software':           'Software',
    // Otros
    'learning object':    'Objeto de Aprendizaje',
    'patent':             'Patente',
    'review':             'Reseña',
    'lecture':            'Clase',
    'other':              'Documento',
  };

  private static readonly CLASS_MAP: Record<string, string> = {
    // Artículos
    'article':            'article',
    'journal article':    'article',
    // Libros
    'book':               'book',
    'book chapter':       'book',
    'bookchapter':        'book',
    // Tesis
    'thesis':             'thesis',
    'bachelor thesis':    'thesis',
    'bachelorthesis':     'thesis',
    'master thesis':      'thesis',
    'masterthesis':       'thesis',
    'doctoral thesis':    'thesis',
    'doctoralthesis':     'thesis',
    'phd thesis':         'thesis',
    'dissertation':       'thesis',
    'trabajo de grado':   'thesis',
    'tesis de grado':     'thesis',
    'tesis de maestría':  'thesis',
    'tesis de maestria':  'thesis',
    'tesis doctoral':     'thesis',
    // Documentos
    'working paper':      'report',
    'workingpaper':       'report',
    'report':             'report',
    'technical report':   'report',
    'preprint':           'report',
    // Conferencias
    'conference paper':   'conference',
    'conferencepaper':    'conference',
    'conference object':  'conference',
    'conference poster':  'conference',
    // Datos y software
    'dataset':            'dataset',
    'software':           'dataset',
    // Multimedia
    'image':              'media',
    'video':              'media',
    'audio':              'media',
    // Otros
    'learning object':    'other',
    'patent':             'other',
    'review':             'article',
    'lecture':            'other',
  };

  get itemTypeLabel(): string {
    const raw = this.dso.firstMetadataValue('dc.type') ?? '';
    const mapped = ItemSearchResultListElementComponent.TYPE_MAP[raw.toLowerCase().trim()];
    if (mapped) { return mapped; }

    const hasAdvisor = this.dso.allMetadata(['dc.contributor.advisor']).length > 0;
    if (hasAdvisor) { return 'Trabajo de Grado'; }

    return raw || '';
  }

  get typeClass(): string {
    const raw = this.dso.firstMetadataValue('dc.type') ?? '';
    const hasAdvisor = !raw && this.dso.allMetadata(['dc.contributor.advisor']).length > 0;
    if (hasAdvisor) { return 'thesis'; }
    return ItemSearchResultListElementComponent.CLASS_MAP[raw.toLowerCase().trim()] ?? 'other';
  }

  get isOpenAccess(): boolean {
    return this.dso.allMetadataValues('dc.rights')
      .some(v => v.toLowerCase().trim() === 'openaccess');
  }
}
