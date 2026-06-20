import { useQuery } from "@tanstack/react-query";
import { classeService } from "../../infrastructure/classeService";
import { classeKeys } from "./classeKeys";

export function useClasses() {
  return useQuery({
    queryKey: classeKeys.list(),
    queryFn: classeService.findAll,
  });
}
