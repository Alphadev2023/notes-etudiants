import { useMutation, useQueryClient } from "@tanstack/react-query";
import { classeService } from "../../infrastructure/classeService";
import { classeKeys } from "./classeKeys";
import type { CreateClasseDto } from "../../domain/classe";

export function useCreateClasse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClasseDto) => classeService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classeKeys.list() });
    },
  });
}
