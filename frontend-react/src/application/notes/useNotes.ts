import { useQuery } from "@tanstack/react-query";
import { noteService } from "../../infrastructure/noteService";
import { noteKeys } from "./noteKeys";
import { useAuth } from "../auth/useAuth";

export function useNotes() {
  const currentUser = useAuth((state) => state.currentUser);
  const etudiantId = currentUser?.id ?? null;

  return useQuery({
    queryKey: noteKeys.byEtudiant(etudiantId ?? 0),
    queryFn: () => noteService.findByEtudiant(etudiantId as number),
    enabled: etudiantId !== null,
  });
}
