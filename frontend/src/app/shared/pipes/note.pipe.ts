import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'note', standalone: true })
export class NotePipe implements PipeTransform {
  transform(valeur: number): string {
    if (valeur >= 16) return 'Très bien';
    if (valeur >= 14) return 'Bien';
    if (valeur >= 12) return 'Assez bien';
    if (valeur >= 10) return 'Passable';
    if (valeur >= 8) return 'Médiocre';
    return 'Insuffisant';
  }
}
