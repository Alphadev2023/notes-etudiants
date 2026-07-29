import type { User } from "../../domain/user";
import { getNomComplet } from "../../domain/user";
import { Input } from "./ui/Input";

interface NoteRowProps {
  etudiant: User;
  valeur: string;
  commentaire: string;
  erreur?: string;
  onValeurChange: (valeur: string) => void;
  onCommentaireChange: (commentaire: string) => void;
}

export function NoteRow({
  etudiant,
  valeur,
  commentaire,
  erreur,
  onValeurChange,
  onCommentaireChange,
}: NoteRowProps) {
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
          onChange={(e) => onValeurChange(e.target.value)}
          error={erreur}
        />
      </td>
      <td className="py-3 pr-4">
        <Input
          placeholder="Commentaire (optionnel)"
          value={commentaire}
          onChange={(e) => onCommentaireChange(e.target.value)}
        />
      </td>
    </tr>
  );
}
