export interface Matiere {
  id: number;
  nom: string;
  code: string;
  coefficient: number;
  semestre: 1 | 2;
  classeId: number;
}

export interface CreateMatiereDto {
  nom: string;
  code: string;
  coefficient: number;
  semestre: 1 | 2;
  classeId: number;
}

export function isCoefficientValide(coefficient: number): boolean {
  return coefficient > 0;
}
