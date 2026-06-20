import { useQuery } from "@tanstack/react-query";
import { releveService } from "../../infrastructure/releveService";
import { releveKeys } from "./releveKeys";
import { useAuth } from "../auth/useAuth";

export function useMesReleves() {
  const currentUser = useAuth((state) => state.currentUser);
  const etudiantId = currentUser?.id ?? null;

  return useQuery({
    queryKey: releveKeys.byEtudiant(etudiantId ?? 0),
    queryFn: () => releveService.findByEtudiant(etudiantId as number),
    enabled: etudiantId !== null,
  });
}
