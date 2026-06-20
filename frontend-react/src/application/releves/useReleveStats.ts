import { useQueries } from "@tanstack/react-query";
import { releveService } from "../../infrastructure/releveService";
import { releveKeys } from "./releveKeys";
import type { Classe } from "../../domain/classe";
import type { Releve } from "../../domain/releve";

export interface ClasseStats {
  classe: Classe;
  releves: Releve[];
  admis: number;
  ajournes: number;
  tauxReussite: number;
}

export function useReleveStats(classes: Classe[] | undefined) {
  const queries = useQueries({
    queries: (classes ?? []).map((classe) => ({
      queryKey: releveKeys.byClasse(classe.id),
      queryFn: () => releveService.findByClasse(classe.id),
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const hasError = queries.some((q) => q.isError);

  const statsParClasse: ClasseStats[] = (classes ?? []).map((classe, index) => {
    const releves = queries[index]?.data ?? [];
    const admis = releves.filter((r) => r.statut === "ADMIS").length;
    const ajournes = releves.length - admis;
    const tauxReussite =
      releves.length > 0 ? (admis / releves.length) * 100 : 0;
    return { classe, releves, admis, ajournes, tauxReussite };
  });

  const totalReleves = statsParClasse.reduce(
    (sum, s) => sum + s.releves.length,
    0,
  );
  const totalAdmis = statsParClasse.reduce((sum, s) => sum + s.admis, 0);
  const tauxGlobal = totalReleves > 0 ? (totalAdmis / totalReleves) * 100 : 0;

  return {
    statsParClasse,
    totalReleves,
    totalAdmis,
    tauxGlobal,
    isLoading,
    hasError,
  };
}
