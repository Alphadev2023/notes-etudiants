import { GraduationCap, Users } from "lucide-react";
import { useClassesEnseignant } from "../../../application/classes/useClassesEnseignant";
import { countEtudiants } from "../../../domain/classe";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";

export function ClassesPage() {
  const { data: classes, isLoading, error } = useClassesEnseignant();

  if (isLoading) return <Spinner size="lg" />;

  if (error) {
    return (
      <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-sm">
        Impossible de charger vos classes.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-neutral-800">Mes classes</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes?.map((classe) => (
          <Card key={classe.id}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-success-50 rounded-lg flex items-center justify-center">
                  <GraduationCap size={18} className="text-success-600" />
                </div>
                <div>
                  <p className="font-semibold text-neutral-800 text-sm">
                    {classe.nom}
                  </p>
                  <p className="text-xs text-neutral-400">{classe.annee}</p>
                </div>
              </div>
              <Badge variant={classe.actif ? "success" : "neutral"}>
                {classe.actif ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-neutral-500 mb-2">
              <span className="flex items-center gap-1">
                <Users size={14} />
                {countEtudiants(classe)} étudiants
              </span>
            </div>

            <Badge variant="primary">{classe.niveau}</Badge>
          </Card>
        ))}

        {classes?.length === 0 && (
          <p className="text-sm text-neutral-400 col-span-full text-center py-8">
            Aucune classe ne vous est assignée pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}
