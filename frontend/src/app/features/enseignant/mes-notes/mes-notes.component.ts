import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { NoteService } from '../../../core/services/note.service';
import { MatiereService } from '../../../core/services/matiere.service';
import { ClasseService } from '../../../core/services/classe.service';
import { AuthService } from '../../../core/auth/auth.service';
import { environment } from '../../../../environments/environment';
import { Note } from '../../../core/models/note.model';
import { Matiere } from '../../../core/models/matiere.model';
import { Classe } from '../../../core/models/classe.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-mes-notes',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './mes-notes.component.html',
})
export class MesNotesComponent implements OnInit {
  notes = signal<Note[]>([]);
  matieres = signal<Matiere[]>([]);
  classes = signal<Classe[]>([]);
  users = signal<User[]>([]);
  loading = signal(true);

  // Pagination
  currentPage = signal(1);
  pageSize = signal(10);
  pageSizeOptions = [5, 10];

  totalPages = computed(() => Math.max(1, Math.ceil(this.notes().length / this.pageSize())));

  notesPage = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.notes().slice(start, start + this.pageSize());
  });

  constructor(
    private noteService: NoteService,
    private matiereService: MatiereService,
    private classeService: ClasseService,
    private http: HttpClient,
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

    this.http.get<User[]>(`${environment.apiUrl}/users`).subscribe({
      next: (users) => this.users.set(users),
    });
  }

  getMatiereName(matiereId: number) {
    const matiere = this.matieres().find((m) => m.id === matiereId);
    return matiere ? matiere.nom : 'Matière #' + matiereId;
  }

  getNomEtudiant(etudiantId: number) {
    const user = this.users().find((u) => u.id === etudiantId);
    return user ? user.prenom + ' ' + user.nom : 'Étudiant #' + etudiantId;
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

  onPageSizeChange() {
    this.currentPage.set(1);
  }

  allerPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
  }

  pagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }
}
