import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { NoteService } from '../../../core/services/note.service';
import { ReleveService } from '../../../core/services/releve.service';
import { ClasseService } from '../../../core/services/classe.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Note } from '../../../core/models/note.model';
import { Releve } from '../../../core/models/releve.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  notes = signal<Note[]>([]);
  releves = signal<Releve[]>([]);
  loading = signal(true);

  quickLinks = [
    { label: 'Mes notes', route: '/etudiant/notes', icon: 'clipboard-list' },
    { label: 'Mes relevés', route: '/etudiant/releves', icon: 'file-text' },
  ];

  constructor(
    private noteService: NoteService,
    private releveService: ReleveService,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.noteService.findByEtudiant(user.id).subscribe({
        next: (notes) => {
          this.notes.set(notes);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });

      this.releveService.findByEtudiant(user.id).subscribe({
        next: (releves) => this.releves.set(releves),
      });
    }
  }

  getUserName() {
    const user = this.authService.currentUser();
    return user ? user.prenom + ' ' + user.nom : '';
  }

  getMoyenne() {
    if (this.notes().length === 0) return '—';
    const sum = this.notes().reduce((s, n) => s + n.valeur, 0);
    return (sum / this.notes().length).toFixed(2);
  }

  getStatut() {
    const moy = parseFloat(this.getMoyenne());
    if (isNaN(moy)) return '—';
    return moy >= 10 ? 'Admis' : 'Ajourné';
  }
}
