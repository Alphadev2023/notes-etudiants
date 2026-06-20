import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { useLogin } from "../../../application/auth/useLogin";
import { isAdmin, isEnseignant } from "../../../domain/user";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useLocation } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useLogin();
  const location = useLocation();
  const justRegistered = (location.state as { registered?: boolean })
    ?.registered;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(data: LoginFormValues) {
    mutate(data, {
      onSuccess: (response) => {
        if (isAdmin(response.user)) {
          navigate("/admin/dashboard");
        } else if (isEnseignant(response.user)) {
          navigate("/enseignant/dashboard");
        } else {
          navigate("/etudiant/dashboard");
        }
      },
    });
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
          <p className="text-neutral-500 mt-1 text-sm">
            Connectez-vous à votre espace
          </p>
        </div>

        <Card className="shadow-lg">
          {error && (
            <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg">
              <p className="text-danger-700 text-sm">{error.message}</p>
            </div>
          )}

          {justRegistered && (
            <div className="mb-4 p-3 bg-success-50 border border-success-200 rounded-lg">
              <p className="text-success-700 text-sm">
                Compte créé avec succès, connectez-vous.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            <Button type="submit" isLoading={isPending} className="w-full">
              Se connecter
            </Button>

            <p className="text-center text-sm text-neutral-500">
              Pas de compte ?{" "}
              <Link
                to="/auth/register"
                className="text-primary-600 hover:underline font-medium"
              >
                S'inscrire
              </Link>
            </p>
          </form>
        </Card>

        <Card className="mt-4 bg-neutral-50 text-xs text-neutral-500 space-y-1">
          <p className="font-medium text-neutral-600 mb-2">Comptes de test :</p>
          <p>Admin : admin@notes.com / Admin1234!</p>
          <p>Enseignant : enseignant@notes.com / Enseignant1234!</p>
          <p>Étudiant : etudiant@notes.com / Etudiant1234!</p>
        </Card>
      </div>
    </div>
  );
}
