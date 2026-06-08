export interface Note {
  id: number;
  valeur: number;
  typeNote: string;
  commentaire?: string;
  etudiantId: number;
  matiereId: number;
  enseignantId: number;
  createdAt: string;
}

export interface NoteRequest {
  valeur: number;
  typeNote: string;
  commentaire?: string;
  etudiantId: number;
  matiereId: number;
}

export interface MoyenneResponse {
  valeur: number;
  totalNotes: number;
  coefficientTotal: number;
  mention: string;
  admis: boolean;
}
