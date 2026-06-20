import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileText, Download, FileSpreadsheet } from "lucide-react";
import { useClasses } from "../../../application/classes/useClasses";
import { useUsers } from "../../../application/users/useUsers";
import { useReleves } from "../../../application/releves/useReleves";
import { useGenererMasse } from "../../../application/releves/useGenererMasse";
import { useDownloadPdf } from "../../../application/releves/useDownloadPdf";
import { useDownloadExcel } from "../../../application/releves/useDownloadExcel";
import { getAnneeActuelle } from "../../../domain/classe";
import { getNomComplet } from "../../../domain/user";
import { getStatutBadgeColor } from "../../../domain/releve";
import { Card } from "../../components/ui/Card";
import { Select } from "../../components/ui/Select";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";

const genererSchema = z.object({
  semestre: z.enum(["1", "2"]),
  annee: z.string().min(4, "Année invalide"),
});

type GenererFormValues = z.infer<typeof genererSchema>;

export function RelevesPage() {
  const [selectedClasseId, setSelectedClasseId] = useState<number | null>(null);

  const { data: classes, isLoading: classesLoading } = useClasses();
  const { data: users } = useUsers();
  const {
    data: releves,
    isLoading: relevesLoading,
    error,
  } = useReleves(selectedClasseId);
  const {
    mutate: genererMasse,
    isPending: isGenerating,
    data: dernierResultat,
  } = useGenererMasse();
  const { mutate: downloadPdf, isPending: isDownloadingPdf } = useDownloadPdf();
  const { mutate: downloadExcel, isPending: isDownloadingExcel } =
    useDownloadExcel();

  const selectedClasse =
    classes?.find((c) => c.id === selectedClasseId) ?? null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GenererFormValues>({
    resolver: zodResolver(genererSchema),
    defaultValues: { semestre: "1", annee: getAnneeActuelle() },
  });

  function onSubmit(data: GenererFormValues) {
    if (!selectedClasse) return;

    genererMasse({
      classe: {
        id: selectedClasse.id,
        etudiantIds: selectedClasse.etudiantIds,
      },
      semestre: Number(data.semestre) as 1 | 2,
      annee: data.annee,
    });
  }

  function getNomEtudiant(etudiantId: number): string {
    const user = users?.find((u) => u.id === etudiantId);
    return user ? getNomComplet(user) : `Étudiant #${etudiantId}`;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-neutral-800">Relevés de notes</h1>

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

      {selectedClasse === null ? (
        <p className="text-sm text-neutral-400 text-center py-8">
          Sélectionnez une classe pour générer ou consulter ses relevés.
        </p>
      ) : (
        <>
          <Card>
            <h2 className="text-sm font-semibold text-neutral-700 mb-4">
              Générer les relevés de la classe (
              {selectedClasse.etudiantIds.length} étudiants)
            </h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start"
            >
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
                <Button
                  type="submit"
                  isLoading={isGenerating}
                  className="w-full"
                >
                  Générer pour toute la classe
                </Button>
              </div>
              <div className="pt-7">
                <Button
                  type="button"
                  variant="ghost"
                  isLoading={isDownloadingExcel}
                  onClick={() => downloadExcel(selectedClasse.id)}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <FileSpreadsheet size={16} />
                  Export Excel classe
                </Button>
              </div>
            </form>

            {dernierResultat && (
              <div className="mt-4 p-3 rounded-lg bg-neutral-50 text-sm text-neutral-600">
                {dernierResultat.succes} relevé(s) généré(s) avec succès.
                {dernierResultat.echecs.length > 0 && (
                  <span className="text-warning-600">
                    {" "}
                    {dernierResultat.echecs.length} déjà existant(s) ou en
                    échec.
                  </span>
                )}
              </div>
            )}
          </Card>

          {relevesLoading && <Spinner size="lg" />}

          {error && (
            <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-sm">
              Impossible de charger les relevés.
            </div>
          )}

          {!relevesLoading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {releves?.map((releve) => (
                <Card key={releve.id}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText size={18} className="text-primary-600" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-semibold text-neutral-800 text-sm truncate">
                        {getNomEtudiant(releve.etudiantId)}
                      </p>
                      <p className="text-xs text-neutral-400">
                        Semestre {releve.semestre} — {releve.annee}
                      </p>
                    </div>
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
                    isLoading={isDownloadingPdf}
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
                  Aucun relevé généré pour cette classe encore.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
