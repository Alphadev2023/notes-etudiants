export type Mention =
  | "TRES_BIEN"
  | "BIEN"
  | "ASSEZ_BIEN"
  | "PASSABLE"
  | "INSUFFISANT";

export interface Moyenne {
  valeur: number;
  totalNotes: number;
  coefficientTotal: number;
  mention: Mention;
  admis: boolean;
}

const MENTION_LABELS: Record<Mention, string> = {
  TRES_BIEN: "Très bien",
  BIEN: "Bien",
  ASSEZ_BIEN: "Assez bien",
  PASSABLE: "Passable",
  INSUFFISANT: "Insuffisant",
};

export function getMentionLabel(mention: Mention): string {
  return MENTION_LABELS[mention];
}

export function calculerStatut(admis: boolean): "Admis" | "Ajourné" {
  return admis ? "Admis" : "Ajourné";
}
