import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'statut', standalone: true })
export class StatutPipe implements PipeTransform {
  transform(statut: string): string {
    const map: Record<string, string> = {
      ADMIS: 'Admis',
      AJOURNE: 'Ajourné',
      AJOURNÉ: 'Ajourné',
      EXAMEN: 'Examen',
      DEVOIR: 'Devoir',
      TP: 'Travaux Pratiques',
      PROJET: 'Projet',
      ORAL: 'Oral',
    };
    return map[statut] ?? statut;
  }
}
