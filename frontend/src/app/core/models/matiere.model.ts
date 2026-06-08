export interface Matiere {
  id: number;
  nom: string;
  code: string;
  coefficient: number;
  semestre: number;
  classeId: number;
}

export interface MatiereRequest {
  nom: string;
  code: string;
  coefficient: number;
  semestre: number;
  classeId: number;
}
