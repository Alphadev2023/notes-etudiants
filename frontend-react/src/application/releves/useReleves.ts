import { useQuery } from "@tanstack/react-query";
import { releveService } from "../../infrastructure/releveService";
import { releveKeys } from "./releveKeys";

export function useReleves(classeId: number | null) {
  return useQuery({
    queryKey: releveKeys.byClasse(classeId ?? 0),
    queryFn: () => releveService.findByClasse(classeId as number),
    enabled: classeId !== null,
  });
}
