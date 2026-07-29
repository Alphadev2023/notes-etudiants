import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { NoteService } from '../../../core/services/note.service';
import { MatiereService } from '../../../core/services/matiere.service';
import { ClasseService } from '../../../core/services/classe.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Note } from '../../../core/models/note.model';
import { Matiere } from '../../../core/models/matiere.model';
import { Classe } from '../../../core/models/classe.model';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './notes.component.html',
})
export class NotesComponent implements OnInit {
  notes = signal<Note[]>([]);
  matieres = signal<Matiere[]>([]);
  classes = signal<Classe[]>([]);
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
    public authService: AuthService,
  ) {}

  ngOnInit() {
    const user = this.authService.currentUser();
    if (!user) return;

    this.noteService.findByEtudiant(user.id).subscribe({
      next: (notes) => {
        this.notes.set(notes);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.classeService.findByEtudiant(user.id).subscribe({
      next: (classes) => {
        this.classes.set(classes);
        if (classes.length === 0) return;

        // Charge les matières de TOUTES les classes de l'étudiant, pas juste la première
        forkJoin(classes.map((c) => this.matiereService.findByClasse(c.id))).subscribe({
          next: (matieresParClasse) => {
            const toutesMatieres = matieresParClasse.flat();
            // Dédoublonnage par id, au cas où une matière apparaîtrait dans plusieurs classes
            const uniques = Array.from(new Map(toutesMatieres.map((m) => [m.id, m])).values());
            this.matieres.set(uniques);
          },
        });
      },
    });
  }

  getMatiereName(matiereId: number) {
    const matiere = this.matieres().find((m) => m.id === matiereId);
    return matiere ? matiere.nom : 'Matière #' + matiereId;
  }

  getMoyenne() {
    if (this.notes().length === 0) return 0;
    const sum = this.notes().reduce((s, n) => s + n.valeur, 0);
    return Math.round((sum / this.notes().length) * 100) / 100;
  }

  getMention(moyenne: number) {
    if (moyenne >= 16) return 'Très bien';
    if (moyenne >= 14) return 'Bien';
    if (moyenne >= 12) return 'Assez bien';
    if (moyenne >= 10) return 'Passable';
    return 'Insuffisant';
  }

  getBadgeClass(valeur: number) {
    if (valeur >= 14) return 'badge-success';
    if (valeur >= 10) return 'badge-primary';
    if (valeur >= 8) return 'badge-warning';
    return 'badge-danger';
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
