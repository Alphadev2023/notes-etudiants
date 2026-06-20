import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GraduationCap, Users, UserCheck } from "lucide-react";
import { useClasses } from "../../../application/classes/useClasses";
import { useCreateClasse } from "../../../application/classes/useCreateClasse";
import {
  NIVEAUX,
  getAnneeActuelle,
  countEtudiants,
  countEnseignants,
} from "../../../domain/classe";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";

const classeSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  niveau: z.string().min(1, "Sélectionnez un niveau"),
  annee: z.string().min(4, "Année invalide"),
});

type ClasseFormValues = z.infer<typeof classeSchema>;

export function ClassesPage() {
  const { data: classes, isLoading, error } = useClasses();
  const { mutate: createClasse, isPending } = useCreateClasse();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClasseFormValues>({
    resolver: zodResolver(classeSchema),
    defaultValues: { annee: getAnneeActuelle() },
  });

  function onSubmit(data: ClasseFormValues) {
    createClasse(data, {
      onSuccess: () =>
        reset({ nom: "", niveau: "", annee: getAnneeActuelle() }),
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-neutral-800">Classes</h1>

      <Card>
        <h2 className="text-sm font-semibold text-neutral-700 mb-4">
          Créer une nouvelle classe
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start"
        >
          <Input
            label="Nom"
            placeholder="Ex : Informatique A"
            error={errors.nom?.message}
            {...register("nom")}
          />

          <Select
            label="Niveau"
            placeholder="Choisir un niveau"
            options={NIVEAUX.map((n) => ({ value: n, label: n }))}
            error={errors.niveau?.message}
            {...register("niveau")}
          />

          <Input
            label="Année"
            placeholder="2026-2027"
            error={errors.annee?.message}
            {...register("annee")}
          />

          <div className="pt-7">
            <Button type="submit" isLoading={isPending} className="w-full">
              Créer
            </Button>
          </div>
        </form>
      </Card>

      {isLoading && <Spinner size="lg" />}

      {error && (
        <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-sm">
          Impossible de charger les classes.
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes?.map((classe) => (
            <Card key={classe.id}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center">
                    <GraduationCap size={18} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-800 text-sm">
                      {classe.nom}
                    </p>
                    <p className="text-xs text-neutral-400">{classe.annee}</p>
                  </div>
                </div>
                <Badge variant={classe.actif ? "success" : "neutral"}>
                  {classe.actif ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-neutral-500">
                <span className="flex items-center gap-1">
                  <Users size={14} />
                  {countEtudiants(classe)} étudiants
                </span>
                <span className="flex items-center gap-1">
                  <UserCheck size={14} />
                  {countEnseignants(classe)} enseignants
                </span>
              </div>

              <Badge variant="primary">{classe.niveau}</Badge>
            </Card>
          ))}

          {classes?.length === 0 && (
            <p className="text-sm text-neutral-400 col-span-full text-center py-8">
              Aucune classe créée pour le moment.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
