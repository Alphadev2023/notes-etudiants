import { Users, GraduationCap, BookOpen, UserCheck, Home } from "lucide-react";
import { useClasses } from "../../../application/classes/useClasses";
import { useUsers } from "../../../application/users/useUsers";
import { useAuth } from "../../../application/auth/useAuth";
import { isEnseignant, isEtudiant, getNomComplet } from "../../../domain/user";
import { StatCard } from "../../components/ui/StatCard";
import { QuickAccessLink } from "../../components/ui/QuickAccessLink";
import { Spinner } from "../../components/ui/Spinner";

export function DashboardPage() {
  const {
    data: classes,
    isLoading: classesLoading,
    error: classesError,
  } = useClasses();
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useUsers();
  const currentUser = useAuth((state) => state.currentUser);

  if (classesLoading || usersLoading) {
    return <Spinner size="lg" />;
  }

  if (classesError || usersError) {
    return (
      <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-sm">
        Impossible de charger les données du tableau de bord.
      </div>
    );
  }

  const totalEtudiants = users?.filter(isEtudiant).length ?? 0;
  const totalEnseignants = users?.filter(isEnseignant).length ?? 0;
  const totalClasses = classes?.length ?? 0;
  const classesActives = classes?.filter((c) => c.actif).length ?? 0;

  return (
    <div className="space-y-6">
      <div className="bg-primary-600 rounded-xl p-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <Home size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">
            Bienvenue{currentUser ? `, ${getNomComplet(currentUser)}` : ""}
          </h1>
          <p className="text-primary-100 text-sm">
            Tableau de bord administrateur
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Étudiants"
          value={totalEtudiants}
          icon={Users}
          variant="primary"
        />
        <StatCard
          label="Enseignants"
          value={totalEnseignants}
          icon={UserCheck}
          variant="success"
        />
        <StatCard
          label="Classes"
          value={totalClasses}
          icon={GraduationCap}
          variant="warning"
        />
        <StatCard
          label="Classes actives"
          value={classesActives}
          icon={BookOpen}
          variant="danger"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-5">
        <h2 className="text-sm font-semibold text-neutral-700 mb-4">
          Accès rapides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <QuickAccessLink
            label="Gérer les classes"
            to="/admin/classes"
            icon={GraduationCap}
          />
          <QuickAccessLink
            label="Gérer les matières"
            to="/admin/matieres"
            icon={BookOpen}
          />
          <QuickAccessLink
            label="Gérer les comptes"
            to="/admin/comptes"
            icon={Users}
          />
          <QuickAccessLink
            label="Voir les statistiques"
            to="/admin/statistiques"
            icon={UserCheck}
          />
        </div>
      </div>
    </div>
  );
}
