import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ClasseService } from '../../../core/services/classe.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Classe, ClasseRequest } from '../../../core/models/classe.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './classes.component.html',
})
export class ClassesComponent implements OnInit {
  classes = signal<Classe[]>([]);
  users = signal<User[]>([]);
  loading = signal(true);
  saving = signal(false);
  showForm = signal(false);
  errorMsg = signal('');
  successMsg = signal('');

  selectedClasse = signal<Classe | null>(null);
  selectedEnseignantId = 0;
  selectedEtudiantId = 0;

  form: ClasseRequest = { nom: '', niveau: '', annee: '' };
  niveaux = ['L1', 'L2', 'L3', 'M1', 'M2', 'BTS1', 'BTS2', 'DUT1', 'DUT2'];

  constructor(
    private classeService: ClasseService,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.load();
    this.http.get<User[]>(`${environment.apiUrl}/users`).subscribe({
      next: (users) => this.users.set(users),
    });
  }

  load() {
    this.classeService.findAll().subscribe({
      next: (classes) => {
        this.classes.set(classes);
        this.loading.set(false);
        if (this.selectedClasse()) {
          const updated = classes.find((c) => c.id === this.selectedClasse()!.id);
          if (updated) this.selectedClasse.set(updated);
        }
      },
      error: () => this.loading.set(false),
    });
  }

  toggleForm() {
    this.showForm.update((v) => !v);
    this.form = { nom: '', niveau: '', annee: '' };
    this.errorMsg.set('');
  }

  selectClasse(classe: Classe) {
    this.selectedClasse.set(classe);
    this.selectedEnseignantId = 0;
    this.selectedEtudiantId = 0;
  }

  getAnneeActuelle() {
    const y = new Date().getFullYear();
    return `${y}-${y + 1}`;
  }

  getEnseignants() {
    return this.users().filter((u) => u.roles.includes('ROLE_ENSEIGNANT' as any));
  }

  getEtudiants() {
    return this.users().filter((u) => u.roles.includes('ROLE_ETUDIANT' as any));
  }

  getNomUser(id: number) {
    const user = this.users().find((u) => u.id === id);
    return user ? user.prenom + ' ' + user.nom : 'ID ' + id;
  }

  onSubmit() {
    if (!this.form.nom || !this.form.niveau || !this.form.annee) {
      this.errorMsg.set('Veuillez remplir tous les champs');
      return;
    }
    this.saving.set(true);
    this.errorMsg.set('');

    this.classeService.create(this.form).subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.successMsg.set('Classe créée avec succès');
        this.load();
        setTimeout(() => this.successMsg.set(''), 3000);
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMsg.set(err.error?.message || 'Erreur lors de la création');
      },
    });
  }

  ajouterEnseignant() {
    if (!this.selectedClasse() || !this.selectedEnseignantId) return;
    this.classeService
      .ajouterEnseignant(this.selectedClasse()!.id, +this.selectedEnseignantId)
      .subscribe({
        next: () => {
          this.successMsg.set('Enseignant affecté');
          this.load();
          setTimeout(() => this.successMsg.set(''), 3000);
        },
        error: (err) => this.errorMsg.set(err.error?.message || 'Erreur'),
      });
  }

  ajouterEtudiant() {
    if (!this.selectedClasse() || !this.selectedEtudiantId) return;
    this.classeService
      .ajouterEtudiant(this.selectedClasse()!.id, +this.selectedEtudiantId)
      .subscribe({
        next: () => {
          this.successMsg.set('Étudiant affecté');
          this.load();
          setTimeout(() => this.successMsg.set(''), 3000);
        },
        error: (err) => this.errorMsg.set(err.error?.message || 'Erreur'),
      });
  }

  delete(id: number) {
    if (!confirm('Supprimer cette classe ?')) return;
    this.classeService.delete(id).subscribe({
      next: () => {
        this.successMsg.set('Classe supprimée');
        if (this.selectedClasse()?.id === id) this.selectedClasse.set(null);
        this.load();
        setTimeout(() => this.successMsg.set(''), 3000);
      },
      error: (err) => this.errorMsg.set(err.error?.message || 'Erreur'),
    });
  }
}
