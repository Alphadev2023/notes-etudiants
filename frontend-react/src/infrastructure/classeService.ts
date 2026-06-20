import { apiClient } from "./apiClient";
import type { Classe, CreateClasseDto } from "../domain/classe";

export const classeService = {
  create: (data: CreateClasseDto): Promise<Classe> =>
    apiClient.post("/classes", data).then((res) => res.data),

  findAll: (): Promise<Classe[]> =>
    apiClient.get("/classes").then((res) => res.data),

  findById: (id: number): Promise<Classe> =>
    apiClient.get(`/classes/${id}`).then((res) => res.data),

  findByEnseignant: (enseignantId: number): Promise<Classe[]> =>
    apiClient
      .get(`/classes/enseignant/${enseignantId}`)
      .then((res) => res.data),

  findByEtudiant: (etudiantId: number): Promise<Classe[]> =>
    apiClient.get(`/classes/etudiant/${etudiantId}`).then((res) => res.data),

  update: (id: number, data: CreateClasseDto): Promise<Classe> =>
    apiClient.put(`/classes/${id}`, data).then((res) => res.data),

  ajouterEnseignant: (
    classeId: number,
    enseignantId: number,
  ): Promise<Classe> =>
    apiClient
      .post(`/classes/${classeId}/enseignants/${enseignantId}`)
      .then((res) => res.data),

  ajouterEtudiant: (classeId: number, etudiantId: number): Promise<Classe> =>
    apiClient
      .post(`/classes/${classeId}/etudiants/${etudiantId}`)
      .then((res) => res.data),

  delete: (id: number): Promise<void> =>
    apiClient.delete(`/classes/${id}`).then(() => undefined),
};
