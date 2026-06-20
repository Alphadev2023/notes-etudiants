export const matiereKeys = {
  all: ["matieres"] as const,
  byClasse: (classeId: number) =>
    [...matiereKeys.all, "classe", classeId] as const,
  detail: (id: number) => [...matiereKeys.all, "detail", id] as const,
};
