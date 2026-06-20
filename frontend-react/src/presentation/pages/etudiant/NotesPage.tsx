import { useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useClassesEtudiant } from "../../../application/classes/useClassesEtudiant";
import { useNotes } from "../../../application/notes/useNotes";
import { useMatieres } from "../../../application/matieres/useMatieres";
import { useMoyenne } from "../../../application/notes/useMoyenne";
import { getMentionLabel, calculerStatut } from "../../../domain/moyenne";
import { getBadgeColor } from "../../../domain/note";
import { Card } from "../../components/ui/Card";
import { Select } from "../../components/ui/Select";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export function NotesPage() {
  const [selectedClasseId, setSelectedClasseId] = useState<number | null>(null);
  const [semestreFiltre, setSemestreFiltre] = useState<string>("TOUS");

  const { data: classes, isLoading: classesLoading } = useClassesEtudiant();
  const { data: notes, isLoading: notesLoading } = useNotes();
  const { data: matieres, isLoading: matieresLoading } =
    useMatieres(selectedClasseId);
  const { data: moyenne } = useMoyenne(selectedClasseId);

  const matieresFiltrees = useMemo(() => {
    if (!matieres) return [];
    if (semestreFiltre === "TOUS") return matieres;
    return matieres.filter((m) => String(m.semestre) === semestreFiltre);
  }, [matieres, semestreFiltre]);

  const notesParMatiere = useMemo(() => {
    if (!notes) return [];
    return matieresFiltrees.map((matiere) => {
      const notesMatiere = notes.filter((n) => n.matiereId === matiere.id);
      const moyenneSimple =
        notesMatiere.length > 0
          ? notesMatiere.reduce((sum, n) => sum + n.valeur, 0) /
            notesMatiere.length
          : 0;
      return { matiere, notes: notesMatiere, moyenneSimple };
    });
  }, [notes, matieresFiltrees]);

  const chartData = {
    labels: notesParMatiere.map((item) => item.matiere.nom),
    datasets: [
      {
        label: "Moyenne par matière",
        data: notesParMatiere.map((item) =>
          Number(item.moyenneSimple.toFixed(2)),
        ),
        backgroundColor: notesParMatiere.map((item) =>
          item.moyenneSimple >= 10 ? "#16a34a" : "#dc2626",
        ),
        borderRadius: 6,
      },
    ],
  };

  const isLoading = classesLoading || notesLoading || matieresLoading;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-neutral-800">Mes notes</h1>

      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              setSelectedClasseId(
                e.target.value ? Number(e.target.value) : null,
              )
            }
            disabled={classesLoading}
          />
          <Select
            label="Semestre"
            options={[
              { value: "TOUS", label: "Tous les semestres" },
              { value: "1", label: "Semestre 1" },
              { value: "2", label: "Semestre 2" },
            ]}
            value={semestreFiltre}
            onChange={(e) => setSemestreFiltre(e.target.value)}
          />
        </div>
      </Card>

      {selectedClasseId === null ? (
        <p className="text-sm text-neutral-400 text-center py-8">
          Sélectionnez une classe pour consulter vos notes.
        </p>
      ) : isLoading ? (
        <Spinner size="lg" />
      ) : (
        <>
          {moyenne && (
            <Card>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-2xl font-bold text-neutral-800">
                    {moyenne.valeur.toFixed(2)}/20
                  </p>
                  <p className="text-sm text-neutral-500">
                    Moyenne générale pondérée
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={moyenne.admis ? "success" : "danger"}>
                    {calculerStatut(moyenne.admis)}
                  </Badge>
                  <Badge variant="primary">
                    {getMentionLabel(moyenne.mention)}
                  </Badge>
                </div>
              </div>
            </Card>
          )}

          {notesParMatiere.length > 0 && (
            <Card>
              <h2 className="text-sm font-semibold text-neutral-700 mb-4">
                Moyenne par matière
              </h2>
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: { y: { min: 0, max: 20 } },
                }}
              />
            </Card>
          )}

          <div className="space-y-4">
            {notesParMatiere.map(({ matiere, notes: notesMatiere }) => (
              <Card key={matiere.id}>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-neutral-800 text-sm">
                    {matiere.nom}
                  </p>
                  <Badge variant="neutral">Coeff. {matiere.coefficient}</Badge>
                </div>

                {notesMatiere.length === 0 ? (
                  <p className="text-sm text-neutral-400">
                    Aucune note pour cette matière.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {notesMatiere.map((note) => (
                      <div
                        key={note.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-neutral-600">
                          {note.typeNote}
                          {note.commentaire && (
                            <span className="text-neutral-400">
                              {" "}
                              — {note.commentaire}
                            </span>
                          )}
                        </span>
                        <Badge variant={getBadgeColor(note.valeur)}>
                          {note.valeur}/20
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
