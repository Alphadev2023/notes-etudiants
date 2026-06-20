export const releveKeys = {
  all: ["releves"] as const,
  byClasse: (classeId: number) =>
    [...releveKeys.all, "classe", classeId] as const,
  byEtudiant: (etudiantId: number) =>
    [...releveKeys.all, "etudiant", etudiantId] as const,
};
