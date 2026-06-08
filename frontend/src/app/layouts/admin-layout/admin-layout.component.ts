import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {
  sidebarOpen = signal(true);

  navItems = [
    { label: 'Tableau de bord', route: '/admin/dashboard', icon: 'home' },
    { label: 'Classes', route: '/admin/classes', icon: 'graduation-cap' },
    { label: 'Matières', route: '/admin/matieres', icon: 'book-open' },
    { label: 'Comptes', route: '/admin/comptes', icon: 'users' },
    { label: 'Statistiques', route: '/admin/statistiques', icon: 'bar-chart' },
  ];

  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

  toggleSidebar() {
    this.sidebarOpen.update((v) => !v);
  }

  logout() {
    this.authService.logout();
  }

  getUserName() {
    const user = this.authService.currentUser();
    return user ? user.prenom + ' ' + user.nom : '';
  }
}
