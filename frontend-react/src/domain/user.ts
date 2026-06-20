export type Role = "ROLE_ADMIN" | "ROLE_ENSEIGNANT" | "ROLE_ETUDIANT";

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  roles: Role[];
  actif: boolean;
}

export function getNomComplet(user: User): string {
  return `${user.prenom} ${user.nom}`;
}

export function hasRole(user: User, role: Role): boolean {
  return user.roles.includes(role);
}

export function isAdmin(user: User): boolean {
  return hasRole(user, "ROLE_ADMIN");
}

export function isEnseignant(user: User): boolean {
  return hasRole(user, "ROLE_ENSEIGNANT");
}

export function isEtudiant(user: User): boolean {
  return hasRole(user, "ROLE_ETUDIANT");
}
