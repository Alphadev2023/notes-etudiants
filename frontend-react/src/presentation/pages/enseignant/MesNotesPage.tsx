import { useNotesEnseignant } from "../../../application/notes/useNotesEnseignant";
import { useUsersByIds } from "../../../application/users/useUsersByIds";
import { useMatieresByIds } from "../../../application/matieres/useMatieresByIds";
import { getNomComplet } from "../../../domain/user";
import { getBadgeColor } from "../../../domain/note";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";

export function MesNotesPage() {
  const { data: notes, isLoading: notesLoading, error } = useNotesEnseignant();

  const etudiantIds = Array.from(
    new Set(notes?.map((n) => n.etudiantId) ?? []),
  );
  const matiereIds = Array.from(new Set(notes?.map((n) => n.matiereId) ?? []));

  const { users: etudiants, isLoading: etudiantsLoading } =
    useUsersByIds(etudiantIds);
  const { matieres, isLoading: matieresLoading } = useMatieresByIds(matiereIds);

  function getNomEtudiant(id: number): string {
    const user = etudiants.find((u) => u.id === id);
    return user ? getNomComplet(user) : `Étudiant #${id}`;
  }

  function getNomMatiere(id: number): string {
    const matiere = matieres.find((m) => m.id === id);
    return matiere ? matiere.nom : `Matière #${id}`;
  }

  const isLoading = notesLoading || etudiantsLoading || matieresLoading;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-neutral-800">Notes saisies</h1>

      {isLoading && <Spinner size="lg" />}

      {error && (
        <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-sm">
          Impossible de charger vos notes.
        </div>
      )}

      {!isLoading && !error && (
        <Card>
          {notes?.length === 0 ? (
            <p className="text-sm text-neutral-400 text-center py-8">
              Aucune note saisie pour le moment.
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 text-left">
                  <th className="pb-2 text-xs font-semibold text-neutral-500 uppercase">
                    Étudiant
                  </th>
                  <th className="pb-2 text-xs font-semibold text-neutral-500 uppercase">
                    Matière
                  </th>
                  <th className="pb-2 text-xs font-semibold text-neutral-500 uppercase">
                    Type
                  </th>
                  <th className="pb-2 text-xs font-semibold text-neutral-500 uppercase">
                    Note
                  </th>
                  <th className="pb-2 text-xs font-semibold text-neutral-500 uppercase">
                    Commentaire
                  </th>
                  <th className="pb-2 text-xs font-semibold text-neutral-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {notes?.map((note) => (
                  <tr
                    key={note.id}
                    className="border-b border-neutral-100 last:border-0"
                  >
                    <td className="py-3 pr-4 text-sm font-medium text-neutral-700">
                      {getNomEtudiant(note.etudiantId)}
                    </td>
                    <td className="py-3 pr-4 text-sm text-neutral-600">
                      {getNomMatiere(note.matiereId)}
                    </td>
                    <td className="py-3 pr-4 text-sm text-neutral-600">
                      {note.typeNote}
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={getBadgeColor(note.valeur)}>
                        {note.valeur}/20
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 text-sm text-neutral-500">
                      {note.commentaire ?? "—"}
                    </td>
                    <td className="py-3 text-sm text-neutral-400">
                      {new Date(note.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      )}
    </div>
  );
}
