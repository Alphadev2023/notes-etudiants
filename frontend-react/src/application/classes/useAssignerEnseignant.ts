import { useMutation, useQueryClient } from "@tanstack/react-query";
import { classeService } from "../../infrastructure/classeService";
import { classeKeys } from "./classeKeys";

export function useAssignerEnseignant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      classeId,
      enseignantId,
    }: {
      classeId: number;
      enseignantId: number;
    }) => classeService.ajouterEnseignant(classeId, enseignantId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: classeKeys.list() });
    },
  });
}
