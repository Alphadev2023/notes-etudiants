import { useMutation, useQueryClient } from "@tanstack/react-query";
import { releveService } from "../../infrastructure/releveService";
import { releveKeys } from "./releveKeys";

interface GenererMasseParams {
  classe: { id: number; etudiantIds: number[] };
  semestre: 1 | 2;
  annee: string;
}

interface GenererMasseResult {
  succes: number;
  echecs: { etudiantId: number; message: string }[];
}

export function useGenererMasse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classe,
      semestre,
      annee,
    }: GenererMasseParams): Promise<GenererMasseResult> => {
      const resultats = await Promise.allSettled(
        classe.etudiantIds.map((etudiantId) =>
          releveService.generer({
            etudiantId,
            classeId: classe.id,
            semestre,
            annee,
          }),
        ),
      );

      const echecs: GenererMasseResult["echecs"] = [];
      let succes = 0;

      resultats.forEach((resultat, index) => {
        if (resultat.status === "fulfilled") {
          succes += 1;
        } else {
          echecs.push({
            etudiantId: classe.etudiantIds[index],
            message:
              resultat.reason instanceof Error
                ? resultat.reason.message
                : "Erreur inconnue",
          });
        }
      });

      return { succes, echecs };
    },
    onSuccess: (_result, { classe }) => {
      queryClient.invalidateQueries({
        queryKey: releveKeys.byClasse(classe.id),
      });
    },
  });
}
