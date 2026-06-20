import { useQuery } from "@tanstack/react-query";
import { noteService } from "../../infrastructure/noteService";
import { noteKeys } from "./noteKeys";
import { useAuth } from "../auth/useAuth";

export function useNotesEnseignant() {
  const currentUser = useAuth((state) => state.currentUser);
  const enseignantId = currentUser?.id ?? null;

  return useQuery({
    queryKey: noteKeys.byEnseignant(enseignantId ?? 0),
    queryFn: () => noteService.findByEnseignant(enseignantId as number),
    enabled: enseignantId !== null,
  });
}
