import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-etudiant-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './etudiant-layout.component.html',
})
export class EtudiantLayoutComponent {
  sidebarOpen = signal(true);

  navItems = [
    { label: 'Tableau de bord', route: '/etudiant/dashboard', icon: 'home' },
    { label: 'Mes notes', route: '/etudiant/notes', icon: 'clipboard-list' },
    { label: 'Mes relevés', route: '/etudiant/releves', icon: 'file-text' },
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
