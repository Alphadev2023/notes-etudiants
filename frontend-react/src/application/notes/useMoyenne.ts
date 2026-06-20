import { useQuery } from "@tanstack/react-query";
import { noteService } from "../../infrastructure/noteService";
import { useAuth } from "../auth/useAuth";

export function useMoyenne(classeId: number | null) {
  const currentUser = useAuth((state) => state.currentUser);
  const etudiantId = currentUser?.id ?? null;

  return useQuery({
    queryKey: ["moyenne", "etudiant", etudiantId ?? 0, "classe", classeId ?? 0],
    queryFn: () =>
      noteService.calculerMoyenne(etudiantId as number, classeId as number),
    enabled: etudiantId !== null && classeId !== null,
  });
}
