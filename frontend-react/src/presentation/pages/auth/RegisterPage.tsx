import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { useRegister } from "../../../application/auth/useRegister";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";

const registerSchema = z
  .object({
    nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
    email: z.string().email("Adresse email invalide"),
    password: z
      .string()
      .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    confirmPassword: z.string().min(1, "Confirmez le mot de passe"),
    role: z.enum(["ETUDIANT", "ENSEIGNANT", "ADMIN"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "ETUDIANT" },
  });

  function onSubmit(data: RegisterFormValues) {
    mutate(
      {
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        password: data.password,
        role: data.role,
      },
      {
        onSuccess: () => {
          navigate("/auth/login", { state: { registered: true } });
        },
      },
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-xl font-bold">N</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-800">
            Gestion des Notes
          </h1>
          <p className="text-neutral-500 mt-1 text-sm">Créez votre compte</p>
        </div>

        <Card className="shadow-lg">
          {error && (
            <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg">
              <p className="text-danger-700 text-sm">{error.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Prénom"
                placeholder="Mariama"
                error={errors.prenom?.message}
                {...register("prenom")}
              />
              <Input
                label="Nom"
                placeholder="Camara"
                error={errors.nom?.message}
                {...register("nom")}
              />
            </div>

            <Input
              type="email"
              label="Adresse email"
              placeholder="exemple@email.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              type="password"
              label="Mot de passe"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />

            <Input
              type="password"
              label="Confirmer le mot de passe"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            <Select
              label="Vous êtes"
              options={[
                { value: "ETUDIANT", label: "Étudiant" },
                { value: "ENSEIGNANT", label: "Enseignant" },
                { value: "ADMIN", label: "Admin" },
              ]}
              error={errors.role?.message}
              {...register("role")}
            />

            <Button type="submit" isLoading={isPending} className="w-full">
              Créer mon compte
            </Button>

            <p className="text-center text-sm text-neutral-500">
              Déjà un compte ?{" "}
              <Link
                to="/auth/login"
                className="text-primary-600 hover:underline font-medium"
              >
                Se connecter
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
