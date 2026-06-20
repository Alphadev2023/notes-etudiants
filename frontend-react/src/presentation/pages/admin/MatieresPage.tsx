import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BookOpen } from "lucide-react";
import { useClasses } from "../../../application/classes/useClasses";
import { useMatieres } from "../../../application/matieres/useMatieres";
import { useCreateMatiere } from "../../../application/matieres/useCreateMatiere";
import { isCoefficientValide } from "../../../domain/matiere";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";

const matiereSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  code: z.string().min(1, "Le code est requis"),
  coefficient: z
    .string()
    .min(1, "Le coefficient est requis")
    .refine(
      (val) => isCoefficientValide(Number(val)),
      "Le coefficient doit être positif",
    ),
  semestre: z.enum(["1", "2"]),
});

type MatiereFormValues = z.infer<typeof matiereSchema>;

export function MatieresPage() {
  const [selectedClasseId, setSelectedClasseId] = useState<number | null>(null);

  const { data: classes, isLoading: classesLoading } = useClasses();
  const {
    data: matieres,
    isLoading: matieresLoading,
    error,
  } = useMatieres(selectedClasseId);
  const { mutate: createMatiere, isPending } = useCreateMatiere();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MatiereFormValues>({
    resolver: zodResolver(matiereSchema),
    defaultValues: { coefficient: "1", semestre: "1" },
  });

  function onSubmit(data: MatiereFormValues) {
    if (selectedClasseId === null) return;

    createMatiere(
      {
        nom: data.nom,
        code: data.code,
        coefficient: Number(data.coefficient),
        semestre: Number(data.semestre) as 1 | 2,
        classeId: selectedClasseId,
      },
      {
        onSuccess: () =>
          reset({ nom: "", code: "", coefficient: "1", semestre: "1" }),
      },
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-neutral-800">Matières</h1>

      <Card>
        <Select
          label="Classe"
          placeholder="Choisir une classe"
          options={
            classes?.map((c) => ({
              value: String(c.id),
              label: `${c.nom} (${c.niveau})`,
            })) ?? []
          }
          value={selectedClasseId !== null ? String(selectedClasseId) : ""}
          onChange={(e) =>
            setSelectedClasseId(e.target.value ? Number(e.target.value) : null)
          }
          disabled={classesLoading}
        />
      </Card>

      {selectedClasseId === null ? (
        <p className="text-sm text-neutral-400 text-center py-8">
          Sélectionnez une classe pour voir et créer ses matières.
        </p>
      ) : (
        <>
          <Card>
            <h2 className="text-sm font-semibold text-neutral-700 mb-4">
              Ajouter une matière
            </h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-start"
            >
              <Input
                label="Nom"
                placeholder="Ex : Algorithmique"
                error={errors.nom?.message}
                {...register("nom")}
              />
              <Input
                label="Code"
                placeholder="Ex : ALG101"
                error={errors.code?.message}
                {...register("code")}
              />
              <Input
                label="Coefficient"
                type="number"
                step="0.5"
                error={errors.coefficient?.message}
                {...register("coefficient")}
              />
              <Select
                label="Semestre"
                options={[
                  { value: "1", label: "Semestre 1" },
                  { value: "2", label: "Semestre 2" },
                ]}
                error={errors.semestre?.message}
                {...register("semestre")}
              />
              <div className="pt-7">
                <Button type="submit" isLoading={isPending} className="w-full">
                  Ajouter
                </Button>
              </div>
            </form>
          </Card>

          {matieresLoading && <Spinner size="lg" />}

          {error && (
            <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-sm">
              Impossible de charger les matières.
            </div>
          )}

          {!matieresLoading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {matieres?.map((matiere) => (
                <Card key={matiere.id}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center">
                      <BookOpen size={18} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-800 text-sm">
                        {matiere.nom}
                      </p>
                      <p className="text-xs text-neutral-400">{matiere.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="primary">
                      Coeff. {matiere.coefficient}
                    </Badge>
                    <Badge variant="neutral">Semestre {matiere.semestre}</Badge>
                  </div>
                </Card>
              ))}

              {matieres?.length === 0 && (
                <p className="text-sm text-neutral-400 col-span-full text-center py-8">
                  Aucune matière créée pour cette classe.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
