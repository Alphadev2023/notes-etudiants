import { TrendingUp, FileText, CheckCircle, XCircle } from "lucide-react";
import { useClasses } from "../../../application/classes/useClasses";
import { useReleveStats } from "../../../application/releves/useReleveStats";
import { Card } from "../../components/ui/Card";
import { StatCard } from "../../components/ui/StatCard";
import { Spinner } from "../../components/ui/Spinner";

export function StatistiquesPage() {
  const { data: classes, isLoading: classesLoading } = useClasses();
  const {
    statsParClasse,
    totalReleves,
    totalAdmis,
    tauxGlobal,
    isLoading,
    hasError,
  } = useReleveStats(classes);

  if (classesLoading || isLoading) {
    return <Spinner size="lg" />;
  }

  if (hasError) {
    return (
      <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-sm">
        Impossible de charger les statistiques.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-neutral-800">Statistiques</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Taux de réussite global"
          value={`${tauxGlobal.toFixed(1)}%`}
          icon={TrendingUp}
          variant="primary"
        />
        <StatCard
          label="Relevés générés"
          value={totalReleves}
          icon={FileText}
          variant="warning"
        />
        <StatCard
          label="Admis"
          value={totalAdmis}
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          label="Ajournés"
          value={totalReleves - totalAdmis}
          icon={XCircle}
          variant="danger"
        />
      </div>

      <Card>
        <h2 className="text-sm font-semibold text-neutral-700 mb-4">
          Réussite par classe
        </h2>
        <div className="space-y-4">
          {statsParClasse.map(
            ({ classe, releves, admis, ajournes, tauxReussite }) => (
              <div key={classe.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-neutral-700">
                    {classe.nom} ({classe.niveau})
                  </span>
                  <span className="text-xs text-neutral-400">
                    {admis} admis / {ajournes} ajourné(s) — {releves.length}{" "}
                    relevé(s)
                  </span>
                </div>
                <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success-500 rounded-full transition-all"
                    style={{ width: `${tauxReussite}%` }}
                  />
                </div>
              </div>
            ),
          )}

          {statsParClasse.every((s) => s.releves.length === 0) && (
            <p className="text-sm text-neutral-400 text-center py-4">
              Aucun relevé généré pour le moment. Générez des relevés depuis la
              page "Relevés" pour voir apparaître les statistiques.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
