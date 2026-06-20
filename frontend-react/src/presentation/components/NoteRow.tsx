import { useState } from "react";
import { CheckCircle } from "lucide-react";
import type { User } from "../../domain/user";
import { getNomComplet } from "../../domain/user";
import { isNoteValide } from "../../domain/note";
import { useCreateNote } from "../../application/notes/useCreateNote";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

interface NoteRowProps {
  etudiant: User;
  matiereId: number;
  typeNote: string;
}

export function NoteRow({ etudiant, matiereId, typeNote }: NoteRowProps) {
  const [valeur, setValeur] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const { mutate, isPending } = useCreateNote();

  function handleSave() {
    const numValeur = Number(valeur);

    if (valeur === "" || Number.isNaN(numValeur) || !isNoteValide(numValeur)) {
      setErreur("Note invalide (0 à 20)");
      return;
    }

    setErreur(null);

    mutate(
      {
        valeur: numValeur,
        typeNote,
        commentaire: commentaire || undefined,
        etudiantId: etudiant.id,
        matiereId,
      },
      {
        onSuccess: () => setSaved(true),
        onError: (err) => setErreur(err.message),
      },
    );
  }

  return (
    <tr className="border-b border-neutral-100 last:border-0">
      <td className="py-3 pr-4 text-sm font-medium text-neutral-700">
        {getNomComplet(etudiant)}
      </td>
      <td className="py-3 pr-4 w-28">
        <Input
          type="number"
          min={0}
          max={20}
          step="0.5"
          value={valeur}
          onChange={(e) => {
            setValeur(e.target.value);
            setSaved(false);
          }}
          error={erreur ?? undefined}
        />
      </td>
      <td className="py-3 pr-4">
        <Input
          placeholder="Commentaire (optionnel)"
          value={commentaire}
          onChange={(e) => {
            setCommentaire(e.target.value);
            setSaved(false);
          }}
        />
      </td>
      <td className="py-3 w-32">
        {saved ? (
          <span className="flex items-center gap-1 text-success-600 text-sm">
            <CheckCircle size={16} />
            Enregistré
          </span>
        ) : (
          <Button
            type="button"
            variant="primary"
            isLoading={isPending}
            onClick={handleSave}
            className="text-sm px-3 py-1.5"
          >
            Enregistrer
          </Button>
        )}
      </td>
    </tr>
  );
}
