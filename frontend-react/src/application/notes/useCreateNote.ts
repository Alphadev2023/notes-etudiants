import { useMutation, useQueryClient } from "@tanstack/react-query";
import { noteService } from "../../infrastructure/noteService";
import { noteKeys } from "./noteKeys";
import { useAuth } from "../auth/useAuth";
import type { CreateNoteDto } from "../../domain/note";

export function useCreateNote() {
  const queryClient = useQueryClient();
  const currentUser = useAuth((state) => state.currentUser);

  return useMutation({
    mutationFn: (data: CreateNoteDto) => noteService.create(data),
    onSuccess: () => {
      if (currentUser) {
        queryClient.invalidateQueries({
          queryKey: noteKeys.byEnseignant(currentUser.id),
        });
      }
    },
  });
}
