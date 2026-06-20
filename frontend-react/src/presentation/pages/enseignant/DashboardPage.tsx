import { Home, Users, GraduationCap, ClipboardList } from "lucide-react";
import { useClassesEnseignant } from "../../../application/classes/useClassesEnseignant";
import { useNotesEnseignant } from "../../../application/notes/useNotesEnseignant";
import { useAuth } from "../../../application/auth/useAuth";
import { getNomComplet } from "../../../domain/user";
import { StatCard } from "../../components/ui/StatCard";
import { QuickAccessLink } from "../../components/ui/QuickAccessLink";
import { Spinner } from "../../components/ui/Spinner";

export function DashboardPage() {
  const currentUser = useAuth((state) => state.currentUser);
  const {
    data: classes,
    isLoading: classesLoading,
    error: classesError,
  } = useClassesEnseignant();
  const {
    data: notes,
    isLoading: notesLoading,
    error: notesError,
  } = useNotesEnseignant();

  if (classesLoading || notesLoading) {
    return <Spinner size="lg" />;
  }

  if (classesError || notesError) {
    return (
      <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-sm">
        Impossible de charger les données du tableau de bord.
      </div>
    );
  }

  const totalClasses = classes?.length ?? 0;
  const totalEtudiants = new Set(classes?.flatMap((c) => c.etudiantIds) ?? [])
    .size;
  const totalNotes = notes?.length ?? 0;

  return (
    <div className="space-y-6">
      <div className="bg-success-600 rounded-xl p-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-success-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <Home size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">
            Bienvenue{currentUser ? `, ${getNomComplet(currentUser)}` : ""}
          </h1>
          <p className="text-success-100 text-sm">Tableau de bord enseignant</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Classes assignées"
          value={totalClasses}
          icon={GraduationCap}
          variant="primary"
        />
        <StatCard
          label="Étudiants"
          value={totalEtudiants}
          icon={Users}
          variant="success"
        />
        <StatCard
          label="Notes saisies"
          value={totalNotes}
          icon={ClipboardList}
          variant="warning"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-5">
        <h2 className="text-sm font-semibold text-neutral-700 mb-4">
          Accès rapides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <QuickAccessLink
            label="Mes classes"
            to="/enseignant/classes"
            icon={GraduationCap}
          />
          <QuickAccessLink
            label="Saisir des notes"
            to="/enseignant/saisie-notes"
            icon={ClipboardList}
          />
          <QuickAccessLink
            label="Notes saisies"
            to="/enseignant/mes-notes"
            icon={ClipboardList}
          />
        </div>
      </div>
    </div>
  );
}
