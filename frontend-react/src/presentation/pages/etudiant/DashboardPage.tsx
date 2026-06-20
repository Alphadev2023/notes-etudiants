import { Home, GraduationCap, ClipboardList, FileText } from "lucide-react";
import { useClassesEtudiant } from "../../../application/classes/useClassesEtudiant";
import { useNotes } from "../../../application/notes/useNotes";
import { useMesReleves } from "../../../application/releves/useMesReleves";
import { useAuth } from "../../../application/auth/useAuth";
import { getNomComplet } from "../../../domain/user";
import { StatCard } from "../../components/ui/StatCard";
import { QuickAccessLink } from "../../components/ui/QuickAccessLink";
import { Spinner } from "../../components/ui/Spinner";

export function DashboardPage() {
  const currentUser = useAuth((state) => state.currentUser);
  const { data: classes, isLoading: classesLoading } = useClassesEtudiant();
  const { data: notes, isLoading: notesLoading } = useNotes();
  const { data: releves, isLoading: relevesLoading } = useMesReleves();

  if (classesLoading || notesLoading || relevesLoading) {
    return <Spinner size="lg" />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-warning-500 rounded-xl p-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-warning-400 rounded-xl flex items-center justify-center flex-shrink-0">
          <Home size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">
            Bienvenue{currentUser ? `, ${getNomComplet(currentUser)}` : ""}
          </h1>
          <p className="text-warning-50 text-sm">Tableau de bord étudiant</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Mes classes"
          value={classes?.length ?? 0}
          icon={GraduationCap}
          variant="primary"
        />
        <StatCard
          label="Notes reçues"
          value={notes?.length ?? 0}
          icon={ClipboardList}
          variant="success"
        />
        <StatCard
          label="Relevés générés"
          value={releves?.length ?? 0}
          icon={FileText}
          variant="warning"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-5">
        <h2 className="text-sm font-semibold text-neutral-700 mb-4">
          Accès rapides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <QuickAccessLink
            label="Voir mes notes"
            to="/etudiant/notes"
            icon={ClipboardList}
          />
          <QuickAccessLink
            label="Mes relevés"
            to="/etudiant/releves"
            icon={FileText}
          />
        </div>
      </div>
    </div>
  );
}
