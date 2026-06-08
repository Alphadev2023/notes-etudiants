import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ClasseService } from '../../../core/services/classe.service';
import { NoteService } from '../../../core/services/note.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Classe } from '../../../core/models/classe.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  classes = signal<Classe[]>([]);
  loading = signal(true);

  quickLinks = [
    { label: 'Mes classes', route: '/enseignant/classes', icon: 'users' },
    { label: 'Saisir des notes', route: '/enseignant/saisie-notes', icon: 'clipboard-list' },
  ];

  constructor(
    private classeService: ClasseService,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.classeService.findByEnseignant(user.id).subscribe({
        next: (classes) => {
          this.classes.set(classes);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    }
  }

  getUserName() {
    const user = this.authService.currentUser();
    return user ? user.prenom + ' ' + user.nom : '';
  }

  getTotalEtudiants() {
    return this.classes().reduce((sum, c) => sum + c.etudiantIds.length, 0);
  }
}
