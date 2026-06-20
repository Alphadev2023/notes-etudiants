import { useQueries } from "@tanstack/react-query";
import { userService } from "../../infrastructure/userService";
import { userKeys } from "./userKeys";
import type { User } from "../../domain/user";

export function useUsersByIds(ids: number[]) {
  const queries = useQueries({
    queries: ids.map((id) => ({
      queryKey: userKeys.detail(id),
      queryFn: () => userService.findById(id),
    })),
  });

  const users: User[] = queries
    .map((q) => q.data)
    .filter((u): u is User => u !== undefined);

  const isLoading = queries.some((q) => q.isLoading);
  const hasError = queries.some((q) => q.isError);

  return { users, isLoading, hasError };
}
