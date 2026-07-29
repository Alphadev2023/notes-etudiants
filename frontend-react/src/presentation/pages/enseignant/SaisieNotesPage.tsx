import { useState } from "react";
import { CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useClassesEnseignant } from "../../../application/classes/useClassesEnseignant";
import { useMatieres } from "../../../application/matieres/useMatieres";
import { useUsersByIds } from "../../../application/users/useUsersByIds";
import { useCreateNote } from "../../../application/notes/useCreateNote";
import { isNoteValide, TYPES_NOTE } from "../../../domain/note";
import { Card } from "../../components/ui/Card";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";
import { NoteRow } from "../../components/NoteRow";

interface LigneNote {
  valeur: string;
  commentaire: string;
  erreur?: string;
}

export function SaisieNotesPage() {
  const [selectedClasseId, setSelectedClasseId] = useState<number | null>(null);
  const [selectedMatiereId, setSelectedMatiereId] = useState<number | null>(
    null,
  );
  const [typeNote, setTypeNote] = useState<string>("EXAMEN");
  const [lignes, setLignes] = useState<Record<number, LigneNote>>({});
  const [validating, setValidating] = useState(false);

  // Réinitialise les lignes quand la classe, la matière ou le type change
  // (pattern recommandé : ajustement pendant le rendu plutôt que via useEffect)
  const contexteKey = `${selectedClasseId}-${selectedMatiereId}-${typeNote}`;
  const [prevContexteKey, setPrevContexteKey] = useState(contexteKey);
  if (contexteKey !== prevContexteKey) {
    setPrevContexteKey(contexteKey);
    setLignes({});
  }

  const { data: classes, isLoading: classesLoading } = useClassesEnseignant();
  const { data: matieres, isLoading: matieresLoading } =
    useMatieres(selectedClasseId);

  const selectedClasse =
    classes?.find((c) => c.id === selectedClasseId) ?? null;
  const { users: etudiants, isLoading: etudiantsLoading } = useUsersByIds(
    selectedClasse?.etudiantIds ?? [],
  );

  const { mutateAsync: creerNote } = useCreateNote();

  function updateLigne(etudiantId: number, patch: Partial<LigneNote>) {
    setLignes((prev) => ({
      ...prev,
      [etudiantId]: {
        valeur: prev[etudiantId]?.valeur ?? "",
        commentaire: prev[etudiantId]?.commentaire ?? "",
        ...patch,
        erreur: undefined,
      },
    }));
  }

  async function handleValiderTout() {
    if (selectedMatiereId === null) return;

    const entreesAValider = etudiants
      .map((etudiant) => ({ etudiant, ligne: lignes[etudiant.id] }))
      .filter(({ ligne }) => ligne && ligne.valeur.trim() !== "");

    if (entreesAValider.length === 0) {
      toast.error("Aucune note saisie");
      return;
    }

    const erreurs: Record<number, string> = {};
    for (const { etudiant, ligne } of entreesAValider) {
      const numValeur = Number(ligne.valeur);
      if (Number.isNaN(numValeur) || !isNoteValide(numValeur)) {
        erreurs[etudiant.id] = "Note invalide (0 à 20)";
      }
    }

    if (Object.keys(erreurs).length > 0) {
      setLignes((prev) => {
        const next = { ...prev };
        for (const [id, msg] of Object.entries(erreurs)) {
          next[Number(id)] = { ...next[Number(id)], erreur: msg };
        }
        return next;
      });
      toast.error("Corrigez les notes invalides avant de valider");
      return;
    }

    setValidating(true);
    let succes = 0;
    const messagesEchec: string[] = [];

    for (const { etudiant, ligne } of entreesAValider) {
      try {
        await creerNote({
          valeur: Number(ligne.valeur),
          typeNote,
          commentaire: ligne.commentaire || undefined,
          etudiantId: etudiant.id,
          matiereId: selectedMatiereId,
        });
        succes++;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erreur inconnue";
        messagesEchec.push(`${etudiant.prenom} ${etudiant.nom} : ${message}`);
      }
    }

    setValidating(false);

    if (messagesEchec.length === 0) {
      toast.success(`${succes} note(s) enregistrée(s) avec succès`);
      setLignes({});
    } else {
      toast.error(
        `${succes} note(s) enregistrée(s). Échecs :\n${messagesEchec.join("\n")}`,
        { duration: 6000 },
      );
    }
  }

  const nombreNotesSaisies = etudiants.filter((e) =>
    lignes[e.id]?.valeur.trim(),
  ).length;

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
            <>
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
                  </tr>
                </thead>
                <tbody>
                  {etudiants.map((etudiant) => (
                    <NoteRow
                      key={`${etudiant.id}-${selectedMatiereId}-${typeNote}`}
                      etudiant={etudiant}
                      valeur={lignes[etudiant.id]?.valeur ?? ""}
                      commentaire={lignes[etudiant.id]?.commentaire ?? ""}
                      erreur={lignes[etudiant.id]?.erreur}
                      onValeurChange={(valeur) =>
                        updateLigne(etudiant.id, { valeur })
                      }
                      onCommentaireChange={(commentaire) =>
                        updateLigne(etudiant.id, { commentaire })
                      }
                    />
                  ))}
                </tbody>
              </table>

              <div className="flex items-center justify-between pt-4 mt-2 border-t border-neutral-100">
                <p className="text-sm text-neutral-500">
                  {nombreNotesSaisies} note(s) saisie(s) sur {etudiants.length}
                </p>
                <Button
                  type="button"
                  variant="primary"
                  isLoading={validating}
                  onClick={handleValiderTout}
                  disabled={nombreNotesSaisies === 0}
                  className="flex items-center gap-2"
                >
                  <CheckCircle size={16} />
                  Valider toutes les notes
                </Button>
              </div>
            </>
          )}
        </Card>
      )}
    </div>
  );
}
