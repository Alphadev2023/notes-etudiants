export type StatutReleve = "ADMIS" | "AJOURNÉ";

export interface Releve {
  id: number;
  etudiantId: number;
  classeId: number;
  semestre: number;
  annee: string;
  moyenneGen: number | null;
  statut: string;
  fichierPdf: string | null;
  generatedAt: string;
}

export interface GenererReleveDto {
  etudiantId: number;
  classeId: number;
  semestre: number;
  annee: string;
}

export function isAdmis(releve: Releve): boolean {
  return releve.statut === "ADMIS";
}

export function getStatutBadgeColor(statut: string): "success" | "danger" {
  return statut === "ADMIS" ? "success" : "danger";
}
