export interface Releve {
  id: number;
  etudiantId: number;
  classeId: number;
  semestre: number;
  annee: string;
  moyenneGen: number;
  statut: string;
  fichierPdf?: string;
  generatedAt: string;
}
