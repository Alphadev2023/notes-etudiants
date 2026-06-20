import { useMutation } from "@tanstack/react-query";
import {
  releveService,
  downloadBlob,
} from "../../infrastructure/releveService";

export function useDownloadExcel() {
  return useMutation({
    mutationFn: async (classeId: number) => {
      const blob = await releveService.exportExcel(classeId);
      downloadBlob(blob, `notes_classe_${classeId}.xlsx`);
    },
  });
}
