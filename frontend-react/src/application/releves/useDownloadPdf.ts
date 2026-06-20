import { useMutation } from "@tanstack/react-query";
import {
  releveService,
  downloadBlob,
} from "../../infrastructure/releveService";

export function useDownloadPdf() {
  return useMutation({
    mutationFn: async (releveId: number) => {
      const blob = await releveService.exportPdf(releveId);
      downloadBlob(blob, `releve_${releveId}.pdf`);
    },
  });
}
