export const classeKeys = {
  all: ["classes"] as const,
  list: () => [...classeKeys.all, "list"] as const,
  detail: (id: number) => [...classeKeys.all, "detail", id] as const,
  byEnseignant: (enseignantId: number) =>
    [...classeKeys.all, "enseignant", enseignantId] as const,
  byEtudiant: (etudiantId: number) =>
    [...classeKeys.all, "etudiant", etudiantId] as const,
};
