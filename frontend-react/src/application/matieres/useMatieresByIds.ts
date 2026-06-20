import { useQueries } from "@tanstack/react-query";
import { matiereService } from "../../infrastructure/matiereService";
import { matiereKeys } from "./matiereKeys";
import type { Matiere } from "../../domain/matiere";

export function useMatieresByIds(ids: number[]) {
  const uniqueIds = Array.from(new Set(ids));

  const queries = useQueries({
    queries: uniqueIds.map((id) => ({
      queryKey: matiereKeys.detail(id),
      queryFn: () => matiereService.findById(id),
    })),
  });

  const matieres: Matiere[] = queries
    .map((q) => q.data)
    .filter((m): m is Matiere => m !== undefined);

  const isLoading = queries.some((q) => q.isLoading);

  return { matieres, isLoading };
}
