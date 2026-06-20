import { useQuery } from "@tanstack/react-query";
import { classeService } from "../../infrastructure/classeService";
import { classeKeys } from "./classeKeys";
import { useAuth } from "../auth/useAuth";

export function useClassesEnseignant() {
  const currentUser = useAuth((state) => state.currentUser);
  const enseignantId = currentUser?.id ?? null;

  return useQuery({
    queryKey: classeKeys.byEnseignant(enseignantId ?? 0),
    queryFn: () => classeService.findByEnseignant(enseignantId as number),
    enabled: enseignantId !== null,
  });
}
