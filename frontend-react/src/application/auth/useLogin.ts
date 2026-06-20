import { useMutation } from "@tanstack/react-query";
import { authService, type LoginDto } from "../../infrastructure/authService";
import { useAuth } from "./useAuth";

export function useLogin() {
  const setAuth = useAuth((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginDto) => authService.login(data),
    onSuccess: (response) => {
      setAuth(response.user, response.accessToken, response.refreshToken);
    },
  });
}
