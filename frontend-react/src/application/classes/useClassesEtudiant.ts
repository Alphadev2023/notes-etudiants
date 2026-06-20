import { useQuery } from "@tanstack/react-query";
import { classeService } from "../../infrastructure/classeService";
import { classeKeys } from "./classeKeys";
import { useAuth } from "../auth/useAuth";

export function useClassesEtudiant() {
  const currentUser = useAuth((state) => state.currentUser);
  const etudiantId = currentUser?.id ?? null;

  return useQuery({
    queryKey: classeKeys.byEtudiant(etudiantId ?? 0),
    queryFn: () => classeService.findByEtudiant(etudiantId as number),
    enabled: etudiantId !== null,
  });
}
