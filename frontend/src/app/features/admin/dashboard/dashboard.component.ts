import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ClasseService } from '../../../core/services/classe.service';
import { MatiereService } from '../../../core/services/matiere.service';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  totalClasses = signal(0);
  totalEtudiants = signal(0);
  loading = signal(true);

  stats = signal([
    {
      label: 'Classes',
      value: 0,
      icon: 'graduation-cap',
      color: 'bg-primary-50 text-primary-600',
      route: '/admin/classes',
    },
    {
      label: 'Étudiants',
      value: 0,
      icon: 'users',
      color: 'bg-success-50 text-success-600',
      route: '/admin/comptes',
    },
    {
      label: 'Matières',
      value: 0,
      icon: 'book-open',
      color: 'bg-warning-50 text-warning-600',
      route: '/admin/matieres',
    },
    {
      label: 'Comptes',
      value: 0,
      icon: 'user',
      color: 'bg-danger-50  text-danger-600',
      route: '/admin/comptes',
    },
  ]);

  quickLinks = [
    { label: 'Gérer les classes', route: '/admin/classes', icon: 'graduation-cap' },
    { label: 'Gérer les matières', route: '/admin/matieres', icon: 'book-open' },
    { label: 'Gérer les comptes', route: '/admin/comptes', icon: 'users' },
    { label: 'Voir les statistiques', route: '/admin/statistiques', icon: 'bar-chart' },
  ];

  constructor(
    private classeService: ClasseService,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    this.classeService.findAll().subscribe({
      next: (classes) => {
        const totalEtudiants = classes.reduce((sum, c) => sum + c.etudiantIds.length, 0);
        this.stats.update((s) =>
          s.map((stat, i) => {
            if (i === 0) return { ...stat, value: classes.length };
            if (i === 1) return { ...stat, value: totalEtudiants };
            return stat;
          }),
        );
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  getUserName() {
    const user = this.authService.currentUser();
    return user ? user.prenom + ' ' + user.nom : '';
  }
}
