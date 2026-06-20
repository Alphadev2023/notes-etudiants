import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export function useLogout() {
  const clearAuth = useAuth((state) => state.clearAuth);
  const queryClient = useQueryClient();

  return () => {
    clearAuth();
    queryClient.clear(); // vide tout le cache TanStack Query — évite les fuites de données entre utilisateurs
  };
}
