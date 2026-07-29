import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GraduationCap, Users, UserCheck, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { useClasses } from "../../../application/classes/useClasses";
import { useCreateClasse } from "../../../application/classes/useCreateClasse";
import { useAssignerEnseignant } from "../../../application/classes/useAssignerEnseignant";
import { useAssignerEtudiant } from "../../../application/classes/useAssignerEtudiant";
import { useUsers } from "../../../application/users/useUsers";
import {
  NIVEAUX,
  getAnneeActuelle,
  countEtudiants,
  countEnseignants,
} from "../../../domain/classe";
import type { Classe } from "../../../domain/classe";
import { getNomComplet } from "../../../domain/user";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";
import { Modal } from "../../components/ui/Modal";

const classeSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  niveau: z.string().min(1, "Sélectionnez un niveau"),
  annee: z.string().min(4, "Année invalide"),
});

type ClasseFormValues = z.infer<typeof classeSchema>;

export function ClassesPage() {
  const { data: classes, isLoading, error } = useClasses();
  const { data: users } = useUsers();
  const { mutate: createClasse, isPending } = useCreateClasse();
  const { mutate: assignerEnseignant, isPending: assignEnsPending } =
    useAssignerEnseignant();
  const { mutate: assignerEtudiant, isPending: assignEtuPending } =
    useAssignerEtudiant();

  const [classeAssignationId, setClasseAssignationId] = useState<number | null>(
    null,
  );
  const classeAssignation =
    classes?.find((c) => c.id === classeAssignationId) ?? null;
  const [enseignantChoisi, setEnseignantChoisi] = useState("");
  const [etudiantChoisi, setEtudiantChoisi] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClasseFormValues>({
    resolver: zodResolver(classeSchema),
    defaultValues: { annee: getAnneeActuelle() },
  });

  function onSubmit(data: ClasseFormValues) {
    createClasse(data, {
      onSuccess: () =>
        reset({ nom: "", niveau: "", annee: getAnneeActuelle() }),
    });
  }

  function ouvrirAssignation(classe: Classe) {
    setClasseAssignationId(classe.id);
    setEnseignantChoisi("");
    setEtudiantChoisi("");
  }

  function confirmerAssignerEnseignant() {
    if (!classeAssignation || !enseignantChoisi) return;
    assignerEnseignant(
      {
        classeId: classeAssignation.id,
        enseignantId: Number(enseignantChoisi),
      },
      {
        onSuccess: () => {
          toast.success("Enseignant assigné à la classe");
          setEnseignantChoisi("");
        },
        onError: () => toast.error("Impossible d'assigner cet enseignant"),
      },
    );
  }

  function confirmerAssignerEtudiant() {
    if (!classeAssignation || !etudiantChoisi) return;
    assignerEtudiant(
      { classeId: classeAssignation.id, etudiantId: Number(etudiantChoisi) },
      {
        onSuccess: () => {
          toast.success("Élève assigné à la classe");
          setEtudiantChoisi("");
        },
        onError: () => toast.error("Impossible d'assigner cet élève"),
      },
    );
  }

  const enseignantsDisponibles = (users ?? []).filter(
    (u) =>
      u.roles.includes("ROLE_ENSEIGNANT") &&
      !classeAssignation?.enseignantIds.includes(u.id),
  );

  const etudiantsDisponibles = (users ?? []).filter(
    (u) =>
      u.roles.includes("ROLE_ETUDIANT") &&
      !classeAssignation?.etudiantIds.includes(u.id),
  );

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-neutral-800">Classes</h1>

      <Card>
        <h2 className="text-sm font-semibold text-neutral-700 mb-4">
          Créer une nouvelle classe
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start"
        >
          <Input
            label="Nom"
            placeholder="Ex : Informatique A"
            error={errors.nom?.message}
            {...register("nom")}
          />

          <Select
            label="Niveau"
            placeholder="Choisir un niveau"
            options={NIVEAUX.map((n) => ({ value: n, label: n }))}
            error={errors.niveau?.message}
            {...register("niveau")}
          />

          <Input
            label="Année"
            placeholder="2026-2027"
            error={errors.annee?.message}
            {...register("annee")}
          />

          <div className="pt-7">
            <Button type="submit" isLoading={isPending} className="w-full">
              Créer
            </Button>
          </div>
        </form>
      </Card>

      {isLoading && <Spinner size="lg" />}

      {error && (
        <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-sm">
          Impossible de charger les classes.
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes?.map((classe) => (
            <Card key={classe.id}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center">
                    <GraduationCap size={18} className="text-primary-600" />
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

              <div className="flex items-center gap-4 text-sm text-neutral-500 mb-3">
                <span className="flex items-center gap-1">
                  <Users size={14} />
                  {countEtudiants(classe)} étudiants
                </span>
                <span className="flex items-center gap-1">
                  <UserCheck size={14} />
                  {countEnseignants(classe)} enseignants
                </span>
              </div>

              <div className="flex items-center justify-between">
                <Badge variant="primary">{classe.niveau}</Badge>
                <button
                  onClick={() => ouvrirAssignation(classe)}
                  className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  <UserPlus size={14} />
                  Assigner
                </button>
              </div>
            </Card>
          ))}

          {classes?.length === 0 && (
            <p className="text-sm text-neutral-400 col-span-full text-center py-8">
              Aucune classe créée pour le moment.
            </p>
          )}
        </div>
      )}

      <Modal
        open={!!classeAssignation}
        onClose={() => setClasseAssignationId(null)}
        title={"Assigner : " + (classeAssignation?.nom ?? "")}
        size="md"
      >
        {classeAssignation && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700">
                Assigner un enseignant
              </label>
              <div className="flex gap-2">
                <select
                  value={enseignantChoisi}
                  onChange={(e) => setEnseignantChoisi(e.target.value)}
                  className="input-field flex-1"
                >
                  <option value="">Sélectionner un enseignant</option>
                  {enseignantsDisponibles.map((u) => (
                    <option key={u.id} value={u.id}>
                      {getNomComplet(u)}
                    </option>
                  ))}
                </select>
                <Button
                  onClick={confirmerAssignerEnseignant}
                  disabled={!enseignantChoisi || assignEnsPending}
                  isLoading={assignEnsPending}
                >
                  Assigner
                </Button>
              </div>
              {enseignantsDisponibles.length === 0 && (
                <p className="text-xs text-neutral-400">
                  Tous les enseignants sont déjà assignés à cette classe.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700">
                Assigner un élève
              </label>
              <div className="flex gap-2">
                <select
                  value={etudiantChoisi}
                  onChange={(e) => setEtudiantChoisi(e.target.value)}
                  className="input-field flex-1"
                >
                  <option value="">Sélectionner un élève</option>
                  {etudiantsDisponibles.map((u) => (
                    <option key={u.id} value={u.id}>
                      {getNomComplet(u)}
                    </option>
                  ))}
                </select>
                <Button
                  onClick={confirmerAssignerEtudiant}
                  disabled={!etudiantChoisi || assignEtuPending}
                  isLoading={assignEtuPending}
                >
                  Assigner
                </Button>
              </div>
              {etudiantsDisponibles.length === 0 && (
                <p className="text-xs text-neutral-400">
                  Tous les élèves sont déjà assignés à cette classe.
                </p>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-neutral-100">
              <Button
                variant="ghost"
                onClick={() => setClasseAssignationId(null)}
              >
                Fermer
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
