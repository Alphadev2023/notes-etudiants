import { useMutation, useQueryClient } from "@tanstack/react-query";
import { matiereService } from "../../infrastructure/matiereService";
import { matiereKeys } from "./matiereKeys";
import type { CreateMatiereDto } from "../../domain/matiere";

export function useCreateMatiere() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMatiereDto) => matiereService.create(data),
    onSuccess: (matiere) => {
      queryClient.invalidateQueries({
        queryKey: matiereKeys.byClasse(matiere.classeId),
      });
    },
  });
}
