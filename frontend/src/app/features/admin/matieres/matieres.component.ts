import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { MatiereService } from '../../../core/services/matiere.service';
import { ClasseService } from '../../../core/services/classe.service';
import { Matiere, MatiereRequest } from '../../../core/models/matiere.model';
import { Classe } from '../../../core/models/classe.model';

@Component({
  selector: 'app-matieres',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
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
  }

  onClasseChange() {
    if (this.selectedClasseId) {
      this.matiereService.findByClasse(+this.selectedClasseId).subscribe({
        next: (matieres) => this.matieres.set(matieres),
      });
    }
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
        if (this.selectedClasseId) this.onClasseChange();
        setTimeout(() => this.successMsg.set(''), 3000);
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMsg.set(err.error?.message || 'Erreur lors de la création');
      },
    });
  }

  delete(id: number) {
    if (!confirm('Supprimer cette matière ?')) return;
    this.matiereService.delete(id).subscribe({
      next: () => {
        this.successMsg.set('Matière supprimée');
        if (this.selectedClasseId) this.onClasseChange();
        setTimeout(() => this.successMsg.set(''), 3000);
      },
      error: (err) => this.errorMsg.set(err.error?.message || 'Erreur'),
    });
  }
}
