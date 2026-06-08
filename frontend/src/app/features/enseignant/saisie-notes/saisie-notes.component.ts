import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { NoteService } from '../../../core/services/note.service';
import { MatiereService } from '../../../core/services/matiere.service';
import { ClasseService } from '../../../core/services/classe.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Classe } from '../../../core/models/classe.model';
import { Matiere } from '../../../core/models/matiere.model';

@Component({
  selector: 'app-saisie-notes',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './saisie-notes.component.html',
})
export class SaisieNotesComponent implements OnInit {
  classes = signal<Classe[]>([]);
  matieres = signal<Matiere[]>([]);
  loading = signal(true);
  saving = signal(false);
  successMsg = signal('');
  errorMsg = signal('');

  selectedClasseId = 0;
  selectedMatiereId = 0;
  selectedEtudiantId = 0;
  valeur = 0;
  typeNote = 'EXAMEN';
  commentaire = '';

  typesNote = ['EXAMEN', 'DEVOIR', 'TP', 'PROJET', 'ORAL'];

  constructor(
    private noteService: NoteService,
    private matiereService: MatiereService,
    private classeService: ClasseService,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    const user = this.authService.currentUser();
    if (!user) return;

    this.classeService.findByEnseignant(user.id).subscribe({
      next: (classes) => {
        this.classes.set(classes);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onClasseChange() {
    if (this.selectedClasseId) {
      this.matiereService.findByClasse(this.selectedClasseId).subscribe({
        next: (matieres) => this.matieres.set(matieres),
      });
    }
  }

  getSelectedClasse() {
    return this.classes().find((c) => c.id === +this.selectedClasseId);
  }

  getEtudiants() {
    return this.getSelectedClasse()?.etudiantIds || [];
  }

  onSubmit() {
    if (
      !this.selectedClasseId ||
      !this.selectedMatiereId ||
      !this.selectedEtudiantId ||
      this.valeur < 0 ||
      this.valeur > 20
    ) {
      this.errorMsg.set('Veuillez remplir tous les champs correctement');
      return;
    }

    this.saving.set(true);
    this.errorMsg.set('');
    this.successMsg.set('');

    this.noteService
      .create({
        valeur: this.valeur,
        typeNote: this.typeNote,
        commentaire: this.commentaire,
        etudiantId: +this.selectedEtudiantId,
        matiereId: +this.selectedMatiereId,
      })
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.successMsg.set('Note enregistrée avec succès');
          this.valeur = 0;
          this.commentaire = '';
          setTimeout(() => this.successMsg.set(''), 3000);
        },
        error: (err) => {
          this.saving.set(false);
          this.errorMsg.set(err.error?.message || 'Erreur lors de la saisie');
        },
      });
  }
}
