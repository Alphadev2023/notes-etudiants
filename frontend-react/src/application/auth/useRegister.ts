import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authService,
  type RegisterDto,
} from "../../infrastructure/authService";
import { userKeys } from "../users/userKeys";

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterDto) => authService.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
    },
  });
}
