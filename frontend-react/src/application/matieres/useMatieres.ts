import { useQuery } from "@tanstack/react-query";
import { matiereService } from "../../infrastructure/matiereService";
import { matiereKeys } from "./matiereKeys";

export function useMatieres(classeId: number | null) {
  return useQuery({
    queryKey: matiereKeys.byClasse(classeId ?? 0),
    queryFn: () => matiereService.findByClasse(classeId as number),
    enabled: classeId !== null,
  });
}
