import { apiClient, apiClientBlob } from "./apiClient";
import type { Releve, GenererReleveDto } from "../domain/releve";

export const releveService = {
  generer: (data: GenererReleveDto): Promise<Releve> =>
    apiClient
      .post("/releves/generer", null, { params: data })
      .then((res) => res.data),

  findByEtudiant: (etudiantId: number): Promise<Releve[]> =>
    apiClient.get(`/releves/etudiant/${etudiantId}`).then((res) => res.data),

  findByClasse: (classeId: number): Promise<Releve[]> =>
    apiClient.get(`/releves/classe/${classeId}`).then((res) => res.data),

  exportPdf: (releveId: number): Promise<Blob> =>
    apiClientBlob.get(`/releves/${releveId}/pdf`).then((res) => res.data),

  exportExcel: (classeId: number): Promise<Blob> =>
    apiClientBlob
      .get(`/releves/classe/${classeId}/excel`)
      .then((res) => res.data),
};

// Helper de téléchargement, réutilisable par tous les hooks
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
