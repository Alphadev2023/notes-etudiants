import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { MatiereService } from '../../../core/services/matiere.service';
import { ClasseService } from '../../../core/services/classe.service';
import { Matiere, MatiereRequest } from '../../../core/models/matiere.model';
import { Classe } from '../../../core/models/classe.model';

@Component({
  selector: 'app-matieres',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, ConfirmModalComponent],
  templateUrl: './matieres.component.html',
})
export class MatieresComponent implements OnInit {
  matieres = signal<Matiere[]>([]);
  classes = signal<Classe[]>([]);
  loading = signal(true);
  saving = signal(false);
  showForm = signal(false);
  errorMsg = signal('');
  successMsg = signal('');

  selectedClasseId = 0;

  confirmModalOpen = signal(false);
  matiereIdToDelete = signal<number | null>(null);
  deleting = signal(false);

  // Pagination
  currentPage = signal(1);
  pageSize = signal(10);
  pageSizeOptions = [5, 10];

  totalPages = computed(() => Math.max(1, Math.ceil(this.matieres().length / this.pageSize())));

  matieresPage = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.matieres().slice(start, start + this.pageSize());
  });

  form: MatiereRequest = {
    nom: '',
    code: '',
    coefficient: 1,
    semestre: 1,
    classeId: 0,
  };

  constructor(
    private matiereService: MatiereService,
    private classeService: ClasseService,
  ) {}

  ngOnInit() {
    this.classeService.findAll().subscribe({
      next: (classes) => {
        this.classes.set(classes);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
    this.chargerMatieres();
  }

  chargerMatieres() {
    this.currentPage.set(1);
    if (this.selectedClasseId) {
      this.matiereService.findByClasse(+this.selectedClasseId).subscribe({
        next: (matieres) => this.matieres.set(matieres),
      });
    } else {
      this.matiereService.findAll().subscribe({
        next: (matieres) => this.matieres.set(matieres),
      });
    }
  }

  onClasseChange() {
    this.chargerMatieres();
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

  toggleForm() {
    this.showForm.update((v) => !v);
    this.form = { nom: '', code: '', coefficient: 1, semestre: 1, classeId: 0 };
    this.errorMsg.set('');
  }

  onSubmit() {
    if (!this.form.nom || !this.form.code || !this.form.classeId) {
      this.errorMsg.set('Veuillez remplir tous les champs');
      return;
    }
    this.saving.set(true);
    this.errorMsg.set('');

    this.matiereService.create(this.form).subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.successMsg.set('Matière créée avec succès');
        this.chargerMatieres();
        setTimeout(() => this.successMsg.set(''), 3000);
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMsg.set(err.error?.message || 'Erreur lors de la création');
      },
    });
  }

  ouvrirConfirmDelete(id: number) {
    this.matiereIdToDelete.set(id);
    this.confirmModalOpen.set(true);
  }

  fermerConfirmDelete() {
    this.confirmModalOpen.set(false);
    this.matiereIdToDelete.set(null);
  }

  confirmerDelete() {
    const id = this.matiereIdToDelete();
    if (!id) return;
    this.deleting.set(true);
    this.matiereService.delete(id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.confirmModalOpen.set(false);
        this.matiereIdToDelete.set(null);
        this.successMsg.set('Matière supprimée');
        this.chargerMatieres();
        setTimeout(() => this.successMsg.set(''), 3000);
      },
      error: (err) => {
        this.deleting.set(false);
        this.errorMsg.set(err.error?.message || 'Erreur');
      },
    });
  }
}
