import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ViewMode } from '../../../../../../../app/core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { Context } from '../../../../../../../app/core/shared/context.model';
import { PublicationComponent as BaseComponent } from '../../../../../../../app/item-page/simple/item-types/publication/publication.component';

interface LicenseInfo {
  url: string;
  badgeUrl: string | null;
  label: string;
}

@listableObjectComponent('Publication', ViewMode.StandalonePage, Context.Any, 'umet')
@Component({
  selector: 'ds-publication',
  styleUrls: ['./publication.component.scss'],
  templateUrl: './publication.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicationComponent extends BaseComponent {

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

  get typeLabel(): string {
    const raw = this.object.firstMetadataValue('dc.type') ?? '';
    const mapped = PublicationComponent.TYPE_MAP[raw.toLowerCase().trim()];
    if (mapped) { return mapped; }
    if (!raw && this.object.allMetadata(['dc.contributor.advisor']).length > 0) {
      return 'Trabajo de Grado';
    }
    return raw || '';
  }

  get typeClass(): string {
    const raw = this.object.firstMetadataValue('dc.type') ?? '';
    if (!raw && this.object.allMetadata(['dc.contributor.advisor']).length > 0) {
      return 'thesis';
    }
    return PublicationComponent.CLASS_MAP[raw.toLowerCase().trim()] ?? 'other';
  }

  get accessType(): { label: string; cssClass: string } | null {
    const value = this.object.firstMetadataValue('dc.rights');
    if (!value) { return null; }

    const accessMap: Record<string, { label: string; cssClass: string }> = {
      'open access':          { label: 'Acceso Abierto',     cssClass: 'open' },
      'restricted access':    { label: 'Acceso Restringido', cssClass: 'restricted' },
      'embargoed access':     { label: 'Acceso Embargado',   cssClass: 'embargoed' },
      'metadata only access': { label: 'Solo Metadatos',     cssClass: 'metadata' },
    };

    const mapped = accessMap[value.toLowerCase()];
    return mapped || { label: value, cssClass: 'other' };
  }

  get licenseInfo(): LicenseInfo | null {
    const value = this.object.firstMetadataValue('dc.rights.uri')
      || this.object.firstMetadataValue('dc.rights.license')
      || this.object.firstMetadataValue('dc.license');

    if (!value) { return null; }

    // "All rights reserved" - no es un enlace
    if (value.toLowerCase() === 'all rights reserved') {
      return { url: '', badgeUrl: null, label: 'Todos los derechos reservados' };
    }

    // CC0 Public Domain
    const cc0 = value.match(/creativecommons\.org\/publicdomain\/zero\/([\d.]+)/i);
    if (cc0) {
      return { url: value, badgeUrl: `https://licensebuttons.net/p/zero/${cc0[1]}/88x31.png`, label: 'CC0 Dominio Público' };
    }

    // Creative Commons licenses
    const cc = value.match(/creativecommons\.org\/licenses\/([\w-]+)\/([\d.]+)/i);
    if (cc) {
      const labels: Record<string, string> = {
        'by': 'CC BY', 'by-sa': 'CC BY-SA', 'by-nd': 'CC BY-ND',
        'by-nc': 'CC BY-NC', 'by-nc-sa': 'CC BY-NC-SA', 'by-nc-nd': 'CC BY-NC-ND',
      };
      return {
        url: value,
        badgeUrl: `https://licensebuttons.net/l/${cc[1]}/${cc[2]}/88x31.png`,
        label: labels[cc[1]] || `CC ${cc[1].toUpperCase()}`,
      };
    }

    // Otros valores - mostrar tal cual
    return { url: value.startsWith('http') ? value : '', badgeUrl: null, label: value };
  }
}
