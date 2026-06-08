import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { NoteService } from '../../../core/services/note.service';
import { MatiereService } from '../../../core/services/matiere.service';
import { ClasseService } from '../../../core/services/classe.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Note } from '../../../core/models/note.model';
import { Matiere } from '../../../core/models/matiere.model';
import { Classe } from '../../../core/models/classe.model';

@Component({
  selector: 'app-mes-notes',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './mes-notes.component.html',
})
export class MesNotesComponent implements OnInit {
  notes = signal<Note[]>([]);
  matieres = signal<Matiere[]>([]);
  classes = signal<Classe[]>([]);
  loading = signal(true);

  constructor(
    private noteService: NoteService,
    private matiereService: MatiereService,
    private classeService: ClasseService,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    const user = this.authService.currentUser();
    if (!user) return;

    this.noteService.findByEnseignant(user.id).subscribe({
      next: (notes) => {
        this.notes.set(notes);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.classeService.findByEnseignant(user.id).subscribe({
      next: (classes) => {
        this.classes.set(classes);
        classes.forEach((c) => {
          this.matiereService.findByClasse(c.id).subscribe({
            next: (matieres) => {
              this.matieres.update((m) => [...m, ...matieres]);
            },
          });
        });
      },
    });
  }

  getMatiereName(matiereId: number) {
    const matiere = this.matieres().find((m) => m.id === matiereId);
    return matiere ? matiere.nom : 'Matière #' + matiereId;
  }

  getBadgeClass(valeur: number) {
    if (valeur >= 14) return 'badge-success';
    if (valeur >= 10) return 'badge-primary';
    if (valeur >= 8) return 'badge-warning';
    return 'badge-danger';
  }

  getTotalEtudiants() {
    const ids = new Set(this.notes().map((n) => n.etudiantId));
    return ids.size;
  }
}
