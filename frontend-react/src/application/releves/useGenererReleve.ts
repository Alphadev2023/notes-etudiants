import { useMutation, useQueryClient } from "@tanstack/react-query";
import { releveService } from "../../infrastructure/releveService";
import { releveKeys } from "./releveKeys";
import { useAuth } from "../auth/useAuth";
import type { GenererReleveDto } from "../../domain/releve";

export function useGenererReleve() {
  const queryClient = useQueryClient();
  const currentUser = useAuth((state) => state.currentUser);

  return useMutation({
    mutationFn: (data: Omit<GenererReleveDto, "etudiantId">) =>
      releveService.generer({ ...data, etudiantId: currentUser?.id ?? 0 }),
    onSuccess: () => {
      if (currentUser) {
        queryClient.invalidateQueries({
          queryKey: releveKeys.byEtudiant(currentUser.id),
        });
      }
    },
  });
}
