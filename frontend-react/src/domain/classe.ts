export type Niveau =
  | "L1"
  | "L2"
  | "L3"
  | "M1"
  | "M2"
  | "BTS1"
  | "BTS2"
  | "DUT1"
  | "DUT2";

export const NIVEAUX: Niveau[] = [
  "L1",
  "L2",
  "L3",
  "M1",
  "M2",
  "BTS1",
  "BTS2",
  "DUT1",
  "DUT2",
];

export interface Classe {
  id: number;
  nom: string;
  niveau: string;
  annee: string;
  actif: boolean;
  enseignantIds: number[];
  etudiantIds: number[];
}

export interface CreateClasseDto {
  nom: string;
  niveau: string;
  annee: string;
}

export function getAnneeActuelle(): string {
  const y = new Date().getFullYear();
  return `${y}-${y + 1}`;
}

export function countEtudiants(classe: Classe): number {
  return classe.etudiantIds.length;
}

export function countEnseignants(classe: Classe): number {
  return classe.enseignantIds.length;
}
