import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-enseignant-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './enseignant-layout.component.html',
})
export class EnseignantLayoutComponent {
  sidebarOpen = signal(true);

  navItems = [
    { label: 'Tableau de bord', route: '/enseignant/dashboard', icon: 'home' },
    { label: 'Mes classes', route: '/enseignant/classes', icon: 'users' },
    { label: 'Saisie des notes', route: '/enseignant/saisie-notes', icon: 'clipboard-list' },
    { label: 'Notes saisies', route: '/enseignant/mes-notes', icon: 'clipboard-list' },
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
