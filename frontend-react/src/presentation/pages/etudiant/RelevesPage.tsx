import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileText, Download } from "lucide-react";
import { useClassesEtudiant } from "../../../application/classes/useClassesEtudiant";
import { useMesReleves } from "../../../application/releves/useMesReleves";
import { useGenererReleve } from "../../../application/releves/useGenererReleve";
import { useDownloadPdf } from "../../../application/releves/useDownloadPdf";
import { getAnneeActuelle } from "../../../domain/classe";
import { getStatutBadgeColor } from "../../../domain/releve";
import { Card } from "../../components/ui/Card";
import { Select } from "../../components/ui/Select";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";

const genererSchema = z.object({
  classeId: z.string().min(1, "Sélectionnez une classe"),
  semestre: z.enum(["1", "2"]),
  annee: z.string().min(4, "Année invalide"),
});

type GenererFormValues = z.infer<typeof genererSchema>;

export function RelevesPage() {
  const [erreurGeneration, setErreurGeneration] = useState<string | null>(null);

  const { data: classes, isLoading: classesLoading } = useClassesEtudiant();
  const { data: releves, isLoading: relevesLoading, error } = useMesReleves();
  const { mutate: genererReleve, isPending: isGenerating } = useGenererReleve();
  const { mutate: downloadPdf, isPending: isDownloading } = useDownloadPdf();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GenererFormValues>({
    resolver: zodResolver(genererSchema),
    defaultValues: { semestre: "1", annee: getAnneeActuelle() },
  });

  function onSubmit(data: GenererFormValues) {
    setErreurGeneration(null);
    genererReleve(
      {
        classeId: Number(data.classeId),
        semestre: Number(data.semestre) as 1 | 2,
        annee: data.annee,
      },
      {
        onError: (err) => setErreurGeneration(err.message),
      },
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-neutral-800">Mes relevés</h1>

      <Card>
        <h2 className="text-sm font-semibold text-neutral-700 mb-4">
          Générer un relevé
        </h2>

        {erreurGeneration && (
          <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg">
            <p className="text-danger-700 text-sm">{erreurGeneration}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start"
        >
          <Select
            label="Classe"
            placeholder="Choisir une classe"
            options={
              classes?.map((c) => ({
                value: String(c.id),
                label: `${c.nom} (${c.niveau})`,
              })) ?? []
            }
            error={errors.classeId?.message}
            disabled={classesLoading}
            {...register("classeId")}
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
          <Input
            label="Année"
            placeholder="2026-2027"
            error={errors.annee?.message}
            {...register("annee")}
          />
          <div className="pt-7">
            <Button type="submit" isLoading={isGenerating} className="w-full">
              Générer
            </Button>
          </div>
        </form>
      </Card>

      {relevesLoading && <Spinner size="lg" />}

      {error && (
        <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-sm">
          Impossible de charger vos relevés.
        </div>
      )}

      {!relevesLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {releves?.map((releve) => (
            <Card key={releve.id}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-warning-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-warning-600" />
                </div>
                <p className="text-sm font-medium text-neutral-700">
                  Semestre {releve.semestre} — {releve.annee}
                </p>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Badge variant={getStatutBadgeColor(releve.statut)}>
                  {releve.statut}
                </Badge>
                {releve.moyenneGen !== null && (
                  <Badge variant="neutral">
                    Moy. {releve.moyenneGen.toFixed(2)}
                  </Badge>
                )}
              </div>

              <Button
                type="button"
                variant="ghost"
                isLoading={isDownloading}
                onClick={() => downloadPdf(releve.id)}
                className="w-full flex items-center justify-center gap-2 text-sm"
              >
                <Download size={16} />
                Télécharger PDF
              </Button>
            </Card>
          ))}

          {releves?.length === 0 && (
            <p className="text-sm text-neutral-400 col-span-full text-center py-8">
              Aucun relevé généré pour le moment.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
