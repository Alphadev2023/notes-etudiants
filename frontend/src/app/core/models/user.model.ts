export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  roles: Role[];
  actif: boolean;
}

export type Role = 'ROLE_ADMIN' | 'ROLE_ENSEIGNANT' | 'ROLE_ETUDIANT';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: User;
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  role?: string;
}
