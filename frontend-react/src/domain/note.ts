export type TypeNote = "EXAMEN" | "DEVOIR" | "TP" | "PROJET" | "ORAL";

export const TYPES_NOTE: TypeNote[] = [
  "EXAMEN",
  "DEVOIR",
  "TP",
  "PROJET",
  "ORAL",
];

export interface Note {
  id: number;
  valeur: number;
  typeNote: string;
  commentaire: string | null;
  etudiantId: number;
  matiereId: number;
  enseignantId: number;
  createdAt: string;
}

export interface CreateNoteDto {
  valeur: number;
  typeNote: string;
  commentaire?: string;
  etudiantId: number;
  matiereId: number;
}

// Règle métier pure — testable sans React, sans API, sans navigateur
export function calculerMention(valeur: number): string {
  if (valeur >= 16) return "Très bien";
  if (valeur >= 14) return "Bien";
  if (valeur >= 12) return "Assez bien";
  if (valeur >= 10) return "Passable";
  return "Insuffisant";
}

export function isNoteValide(valeur: number): boolean {
  return valeur >= 0 && valeur <= 20;
}

export function isAdmis(valeur: number): boolean {
  return valeur >= 10;
}

export function getBadgeColor(
  valeur: number,
): "success" | "primary" | "warning" | "danger" {
  if (valeur >= 14) return "success";
  if (valeur >= 10) return "primary";
  if (valeur >= 8) return "warning";
  return "danger";
}
