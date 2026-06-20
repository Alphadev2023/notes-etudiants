import { Link } from "react-router-dom";
import { FileQuestion } from "lucide-react";
import { Button } from "../components/ui/Button";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileQuestion size={28} className="text-neutral-400" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-800 mb-2">
          Page introuvable
        </h1>
        <p className="text-neutral-500 mb-6">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <Link to="/">
          <Button>Retour à l'accueil</Button>
        </Link>
      </div>
    </div>
  );
}
