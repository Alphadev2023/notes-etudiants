import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleRoute } from "./RoleRoute";
import { LoginPage } from "../presentation/pages/auth/LoginPage";
import { AdminLayout } from "../presentation/layouts/AdminLayout";
import { EnseignantLayout } from "../presentation/layouts/EnseignantLayout";
import { EtudiantLayout } from "../presentation/layouts/EtudiantLayout";
import { DashboardPage } from "../presentation/pages/admin/DashboardPage";
import { ClassesPage } from "../presentation/pages/admin/ClassesPage";
import { MatieresPage } from "../presentation/pages/admin/MatieresPage";
import { ComptesPage } from "../presentation/pages/admin/ComptesPage";
import { RegisterPage } from "../presentation/pages/auth/RegisterPage";
import { RelevesPage } from "../presentation/pages/admin/RelevesPage";
import { StatistiquesPage } from "../presentation/pages/admin/StatistiquesPage";
import { SaisieNotesPage } from "../presentation/pages/enseignant/SaisieNotesPage";
import { DashboardPage as EnseignantDashboardPage } from "../presentation/pages/enseignant/DashboardPage";
import { ClassesPage as EnseignantClassesPage } from "../presentation/pages/enseignant/ClassesPage";
import { MesNotesPage } from "../presentation/pages/enseignant/MesNotesPage";
import { DashboardPage as EtudiantDashboardPage } from "../presentation/pages/etudiant/DashboardPage";
import { NotesPage } from "../presentation/pages/etudiant/NotesPage";
import { RelevesPage as EtudiantRelevesPage } from "../presentation/pages/etudiant/RelevesPage";
import { LandingPage } from "../presentation/pages/LandingPage";
import { NotFoundPage } from "../presentation/pages/NotFoundPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={["ROLE_ADMIN"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="classes" element={<ClassesPage />} />
            <Route path="matieres" element={<MatieresPage />} />

            <Route path="releves" element={<RelevesPage />} />
            <Route path="comptes" element={<ComptesPage />} />
            <Route path="statistiques" element={<StatistiquesPage />} />
          </Route>
        </Route>

        <Route
          element={
            <RoleRoute allowedRoles={["ROLE_ADMIN", "ROLE_ENSEIGNANT"]} />
          }
        >
          <Route path="/enseignant" element={<EnseignantLayout />}>
            <Route path="dashboard" element={<EnseignantDashboardPage />} />
            <Route path="classes" element={<EnseignantClassesPage />} />
            <Route path="saisie-notes" element={<SaisieNotesPage />} />
            <Route path="mes-notes" element={<MesNotesPage />} />
          </Route>
        </Route>

        <Route
          element={<RoleRoute allowedRoles={["ROLE_ADMIN", "ROLE_ETUDIANT"]} />}
        >
          <Route path="/etudiant" element={<EtudiantLayout />}>
            <Route path="dashboard" element={<EtudiantDashboardPage />} />
            <Route path="notes" element={<NotesPage />} />
            <Route path="releves" element={<EtudiantRelevesPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
