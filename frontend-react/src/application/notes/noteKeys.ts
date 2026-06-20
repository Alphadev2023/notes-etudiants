export const noteKeys = {
  all: ["notes"] as const,
  byEtudiant: (etudiantId: number) =>
    [...noteKeys.all, "etudiant", etudiantId] as const,
  byEnseignant: (enseignantId: number) =>
    [...noteKeys.all, "enseignant", enseignantId] as const,
};
