import { apiClient } from "./apiClient";
import type { Note, CreateNoteDto } from "../domain/note";
import type { Moyenne } from "../domain/moyenne";

export const noteService = {
  create: (data: CreateNoteDto): Promise<Note> =>
    apiClient.post("/notes", data).then((res) => res.data),

  findByEtudiant: (etudiantId: number): Promise<Note[]> =>
    apiClient.get(`/notes/etudiant/${etudiantId}`).then((res) => res.data),

  findByEnseignant: (enseignantId: number): Promise<Note[]> =>
    apiClient.get(`/notes/enseignant/${enseignantId}`).then((res) => res.data),

  calculerMoyenne: (etudiantId: number, classeId: number): Promise<Moyenne> =>
    apiClient
      .get(`/notes/moyenne/etudiant/${etudiantId}/classe/${classeId}`)
      .then((res) => res.data),

  update: (id: number, data: CreateNoteDto): Promise<Note> =>
    apiClient.put(`/notes/${id}`, data).then((res) => res.data),

  delete: (id: number): Promise<void> =>
    apiClient.delete(`/notes/${id}`).then(() => undefined),
};
