import { apiClient } from "./apiClient";
import type { User } from "../domain/user";

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: User;
}

export const authService = {
  login: (data: LoginDto): Promise<LoginResponse> =>
    apiClient.post("/auth/login", data).then((res) => res.data),

  register: (data: RegisterDto): Promise<User> =>
    apiClient.post("/auth/register", data).then((res) => res.data),
};
