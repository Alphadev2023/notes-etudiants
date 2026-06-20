import { useQuery } from "@tanstack/react-query";
import { userService } from "../../infrastructure/userService";
import { userKeys } from "./userKeys";

export function useUsers() {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: userService.findAll,
  });
}
