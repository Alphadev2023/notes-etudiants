import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail } from "lucide-react";
import { useUsers } from "../../../application/users/useUsers";
import { useRegister } from "../../../application/auth/useRegister";
import { getNomComplet } from "../../../domain/user";
import type { Role } from "../../../domain/user";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";

const compteSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  role: z.enum(["ADMIN", "ENSEIGNANT", "ETUDIANT"]),
});

type CompteFormValues = z.infer<typeof compteSchema>;

function getRoleBadge(roles: Role[]): {
  label: string;
  variant: "danger" | "success" | "primary";
} {
  if (roles.includes("ROLE_ADMIN"))
    return { label: "Admin", variant: "danger" };
  if (roles.includes("ROLE_ENSEIGNANT"))
    return { label: "Enseignant", variant: "success" };
  return { label: "Étudiant", variant: "primary" };
}

export function ComptesPage() {
  const { data: users, isLoading, error } = useUsers();
  const {
    mutate: createCompte,
    isPending,
    error: registerError,
  } = useRegister();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompteFormValues>({
    resolver: zodResolver(compteSchema),
    defaultValues: { role: "ETUDIANT" },
  });

  function onSubmit(data: CompteFormValues) {
    createCompte(data, {
      onSuccess: () =>
        reset({
          nom: "",
          prenom: "",
          email: "",
          password: "",
          role: "ETUDIANT",
        }),
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-neutral-800">Comptes</h1>

      <Card>
        <h2 className="text-sm font-semibold text-neutral-700 mb-4">
          Créer un compte
        </h2>

        {registerError && (
          <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg">
            <p className="text-danger-700 text-sm">{registerError.message}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-start"
        >
          <Input
            label="Prénom"
            placeholder="Ex : Mariama"
            error={errors.prenom?.message}
            {...register("prenom")}
          />
          <Input
            label="Nom"
            placeholder="Ex : Camara"
            error={errors.nom?.message}
            {...register("nom")}
          />
          <Input
            label="Email"
            type="email"
            placeholder="exemple@email.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />
          <Select
            label="Rôle"
            options={[
              { value: "ETUDIANT", label: "Étudiant" },
              { value: "ENSEIGNANT", label: "Enseignant" },
              { value: "ADMIN", label: "Admin" },
            ]}
            error={errors.role?.message}
            {...register("role")}
          />

          <div className="sm:col-span-5">
            <Button type="submit" isLoading={isPending}>
              Créer le compte
            </Button>
          </div>
        </form>
      </Card>

      {isLoading && <Spinner size="lg" />}

      {error && (
        <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-sm">
          Impossible de charger les comptes.
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users?.map((user) => {
            const badge = getRoleBadge(user.roles);
            return (
              <Card key={user.id}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 text-sm font-bold">
                      {user.prenom.charAt(0)}
                    </span>
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-semibold text-neutral-800 text-sm truncate">
                      {getNomComplet(user)}
                    </p>
                    <p className="text-xs text-neutral-400 flex items-center gap-1 truncate">
                      <Mail size={12} />
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                  <Badge variant={user.actif ? "success" : "neutral"}>
                    {user.actif ? "Actif" : "Inactif"}
                  </Badge>
                </div>
              </Card>
            );
          })}

          {users?.length === 0 && (
            <p className="text-sm text-neutral-400 col-span-full text-center py-8">
              Aucun compte créé pour le moment.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
