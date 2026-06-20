import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  BookOpen,
  LogOut,
  Menu,
} from "lucide-react";
import { useAuth } from "../../application/auth/useAuth";
import { useLogout } from "../../application/auth/useLogout";
import { getNomComplet } from "../../domain/user";

const NAV_ITEMS = [
  {
    label: "Tableau de bord",
    to: "/enseignant/dashboard",
    icon: LayoutDashboard,
  },
  { label: "Mes classes", to: "/enseignant/classes", icon: Users },
  {
    label: "Saisie des notes",
    to: "/enseignant/saisie-notes",
    icon: ClipboardList,
  },
  { label: "Notes saisies", to: "/enseignant/mes-notes", icon: ClipboardList },
];

export function EnseignantLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const currentUser = useAuth((state) => state.currentUser);
  const logout = useLogout();

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden">
      <aside
        className={`flex flex-col bg-white border-r border-neutral-200 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex items-center gap-3 px-4 py-5 border-b border-neutral-100">
          <div className="w-8 h-8 bg-success-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOpen size={18} className="text-white" />
          </div>
          {sidebarOpen && (
            <span className="font-bold text-neutral-800 text-sm whitespace-nowrap">
              Espace Enseignant
            </span>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-success-50 text-success-700"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`
              }
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-neutral-100">
          {sidebarOpen && currentUser && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-neutral-50 mb-1">
              <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-success-600 text-xs font-bold">
                  {currentUser.prenom.charAt(0)}
                </span>
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-neutral-800 truncate">
                  {getNomComplet(currentUser)}
                </p>
                <p className="text-xs text-neutral-400">Enseignant</p>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium w-full text-danger-600 hover:bg-danger-50 transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <Menu size={20} className="text-neutral-600" />
          </button>
          <h1 className="text-lg font-semibold text-neutral-800 flex-1">
            Gestion des Notes
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-50 text-success-700">
            Enseignant
          </span>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
