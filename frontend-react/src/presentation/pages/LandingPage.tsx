import { Link } from "react-router-dom";
import {
  GraduationCap,
  ClipboardList,
  FileText,
  BarChart3,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

const FEATURES = [
  {
    icon: ClipboardList,
    title: "Saisie simplifiée",
    description:
      "Les enseignants saisissent les notes par classe et matière, avec validation automatique.",
  },
  {
    icon: BarChart3,
    title: "Suivi en temps réel",
    description:
      "Les étudiants consultent leurs résultats et leur moyenne dès qu'une note est publiée.",
  },
  {
    icon: FileText,
    title: "Relevés officiels",
    description:
      "Génération de relevés de notes au format PDF, individuellement ou pour toute une classe.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="font-bold text-neutral-800">
              Gestion des Notes
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/auth/login"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-800"
            >
              Se connecter
            </Link>
            <Link to="/auth/register">
              <Button className="text-sm px-4 py-2">S'inscrire</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-800 mb-4">
          La gestion des notes, simplifiée
        </h1>
        <p className="text-neutral-500 max-w-xl mx-auto mb-8">
          Une plateforme unique pour les administrateurs, enseignants et
          étudiants : saisie, suivi et relevés officiels, le tout en un seul
          endroit.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/auth/register">
            <Button className="px-6 py-3">Créer un compte</Button>
          </Link>
          <Link to="/auth/login">
            <Button variant="ghost" className="px-6 py-3">
              Se connecter
            </Button>
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <Card key={feature.title}>
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mb-3">
                <feature.icon size={20} className="text-primary-600" />
              </div>
              <h3 className="font-semibold text-neutral-800 text-sm mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-neutral-500">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t border-neutral-100 py-6">
        <p className="text-center text-xs text-neutral-400">
          Système de Gestion des Notes Étudiantes
        </p>
      </footer>
    </div>
  );
}
