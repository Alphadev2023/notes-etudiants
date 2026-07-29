import { useMutation, useQueryClient } from "@tanstack/react-query";
import { classeService } from "../../infrastructure/classeService";
import { classeKeys } from "./classeKeys";

export function useAssignerEtudiant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      classeId,
      etudiantId,
    }: {
      classeId: number;
      etudiantId: number;
    }) => classeService.ajouterEtudiant(classeId, etudiantId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: classeKeys.list() });
    },
  });
}
