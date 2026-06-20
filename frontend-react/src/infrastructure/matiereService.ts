import { apiClient } from "./apiClient";
import type { Matiere, CreateMatiereDto } from "../domain/matiere";

export const matiereService = {
  create: (data: CreateMatiereDto): Promise<Matiere> =>
    apiClient.post("/matieres", data).then((res) => res.data),

  findByClasse: (classeId: number): Promise<Matiere[]> =>
    apiClient.get(`/matieres/classe/${classeId}`).then((res) => res.data),

  findByClasseAndSemestre: (
    classeId: number,
    semestre: number,
  ): Promise<Matiere[]> =>
    apiClient
      .get(`/matieres/classe/${classeId}/semestre/${semestre}`)
      .then((res) => res.data),

  findById: (id: number): Promise<Matiere> =>
    apiClient.get(`/matieres/${id}`).then((res) => res.data),

  update: (id: number, data: CreateMatiereDto): Promise<Matiere> =>
    apiClient.put(`/matieres/${id}`, data).then((res) => res.data),

  delete: (id: number): Promise<void> =>
    apiClient.delete(`/matieres/${id}`).then(() => undefined),
};
