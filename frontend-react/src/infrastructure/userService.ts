import { apiClient } from "./apiClient";
import type { User } from "../domain/user";

export const userService = {
  me: (): Promise<User> => apiClient.get("/users/me").then((res) => res.data),

  findAll: (): Promise<User[]> =>
    apiClient.get("/users").then((res) => res.data),

  findById: (id: number): Promise<User> =>
    apiClient.get(`/users/${id}`).then((res) => res.data),
};
