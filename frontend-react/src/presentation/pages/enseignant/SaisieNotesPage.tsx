import { useState } from "react";
import { useClassesEnseignant } from "../../../application/classes/useClassesEnseignant";
import { useMatieres } from "../../../application/matieres/useMatieres";
import { useUsersByIds } from "../../../application/users/useUsersByIds";
import { TYPES_NOTE } from "../../../domain/note";
import { Card } from "../../components/ui/Card";
import { Select } from "../../components/ui/Select";
import { Spinner } from "../../components/ui/Spinner";
import { NoteRow } from "../../components/NoteRow";

export function SaisieNotesPage() {
  const [selectedClasseId, setSelectedClasseId] = useState<number | null>(null);
  const [selectedMatiereId, setSelectedMatiereId] = useState<number | null>(
    null,
  );
  const [typeNote, setTypeNote] = useState<string>("EXAMEN");

  const { data: classes, isLoading: classesLoading } = useClassesEnseignant();
  const { data: matieres, isLoading: matieresLoading } =
    useMatieres(selectedClasseId);

  const selectedClasse =
    classes?.find((c) => c.id === selectedClasseId) ?? null;
  const { users: etudiants, isLoading: etudiantsLoading } = useUsersByIds(
    selectedClasse?.etudiantIds ?? [],
  );

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-neutral-800">Saisie des notes</h1>

      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            onChange={(e) => {
              setSelectedClasseId(
                e.target.value ? Number(e.target.value) : null,
              );
              setSelectedMatiereId(null);
            }}
            disabled={classesLoading}
          />

          <Select
            label="Matière"
            placeholder="Choisir une matière"
            options={
              matieres?.map((m) => ({
                value: String(m.id),
                label: `${m.nom} (Coeff. ${m.coefficient})`,
              })) ?? []
            }
            value={selectedMatiereId !== null ? String(selectedMatiereId) : ""}
            onChange={(e) =>
              setSelectedMatiereId(
                e.target.value ? Number(e.target.value) : null,
              )
            }
            disabled={selectedClasseId === null || matieresLoading}
          />

          <Select
            label="Type de note"
            options={TYPES_NOTE.map((t) => ({ value: t, label: t }))}
            value={typeNote}
            onChange={(e) => setTypeNote(e.target.value)}
          />
        </div>
      </Card>

      {selectedClasse === null && (
        <p className="text-sm text-neutral-400 text-center py-8">
          Sélectionnez une classe pour commencer la saisie.
        </p>
      )}

      {selectedClasse !== null && selectedMatiereId === null && (
        <p className="text-sm text-neutral-400 text-center py-8">
          Sélectionnez une matière pour afficher les étudiants.
        </p>
      )}

      {selectedClasse !== null && selectedMatiereId !== null && (
        <Card>
          {etudiantsLoading ? (
            <Spinner size="lg" />
          ) : etudiants.length === 0 ? (
            <p className="text-sm text-neutral-400 text-center py-8">
              Aucun étudiant inscrit dans cette classe.
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 text-left">
                  <th className="pb-2 text-xs font-semibold text-neutral-500 uppercase">
                    Étudiant
                  </th>
                  <th className="pb-2 text-xs font-semibold text-neutral-500 uppercase">
                    Note
                  </th>
                  <th className="pb-2 text-xs font-semibold text-neutral-500 uppercase">
                    Commentaire
                  </th>
                  <th className="pb-2 text-xs font-semibold text-neutral-500 uppercase" />
                </tr>
              </thead>
              <tbody>
                {etudiants.map((etudiant) => (
                  <NoteRow
                    key={`${etudiant.id}-${selectedMatiereId}-${typeNote}`}
                    etudiant={etudiant}
                    matiereId={selectedMatiereId}
                    typeNote={typeNote}
                  />
                ))}
              </tbody>
            </table>
          )}
        </Card>
      )}
    </div>
  );
}
