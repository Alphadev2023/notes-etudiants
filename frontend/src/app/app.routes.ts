import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';

export const routes: Routes = [
  // Public
  {
    path: '',
    loadComponent: () =>
      import('./layouts/public-layout/public-layout.component').then(
        (m) => m.PublicLayoutComponent,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/landing/landing.component').then((m) => m.LandingComponent),
      },
    ],
  },

  // Auth
  {
    path: 'auth',
    loadComponent: () =>
      import('./layouts/public-layout/public-layout.component').then(
        (m) => m.PublicLayoutComponent,
      ),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
      },
    ],
  },

  // Etudiant
  {
    path: 'etudiant',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ETUDIANT', 'ROLE_ADMIN'] },
    loadComponent: () =>
      import('./layouts/etudiant-layout/etudiant-layout.component').then(
        (m) => m.EtudiantLayoutComponent,
      ),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/etudiant/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'notes',
        loadComponent: () =>
          import('./features/etudiant/notes/notes.component').then((m) => m.NotesComponent),
      },
      {
        path: 'releves',
        loadComponent: () =>
          import('./features/etudiant/releves/releves.component').then((m) => m.RelevesComponent),
      },
    ],
  },

  // Enseignant
  {
    path: 'enseignant',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ENSEIGNANT', 'ROLE_ADMIN'] },
    loadComponent: () =>
      import('./layouts/enseignant-layout/enseignant-layout.component').then(
        (m) => m.EnseignantLayoutComponent,
      ),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/enseignant/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'saisie-notes',
        loadComponent: () =>
          import('./features/enseignant/saisie-notes/saisie-notes.component').then(
            (m) => m.SaisieNotesComponent,
          ),
      },
      {
        path: 'classes',
        loadComponent: () =>
          import('./features/enseignant/classes/classes.component').then((m) => m.ClassesComponent),
      },
      {
        path: 'mes-notes',
        loadComponent: () =>
          import('./features/enseignant/mes-notes/mes-notes.component').then(
            (m) => m.MesNotesComponent,
          ),
      },
    ],
  },

  // Admin
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN'] },
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'matieres',
        loadComponent: () =>
          import('./features/admin/matieres/matieres.component').then((m) => m.MatieresComponent),
      },
      {
        path: 'classes',
        loadComponent: () =>
          import('./features/admin/classes/classes.component').then((m) => m.ClassesComponent),
      },
      {
        path: 'statistiques',
        loadComponent: () =>
          import('./features/admin/statistiques/statistiques.component').then(
            (m) => m.StatistiquesComponent,
          ),
      },
      {
        path: 'comptes',
        loadComponent: () =>
          import('./features/admin/comptes/comptes.component').then((m) => m.ComptesComponent),
      },
    ],
  },

  // 404
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
