export interface Classe {
  id: number;
  nom: string;
  niveau: string;
  annee: string;
  actif: boolean;
  enseignantIds: number[];
  etudiantIds: number[];
}

export interface ClasseRequest {
  nom: string;
  niveau: string;
  annee: string;
}
