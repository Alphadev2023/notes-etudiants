import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ReleveService } from '../../../core/services/releve.service';
import { ClasseService } from '../../../core/services/classe.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Releve } from '../../../core/models/releve.model';
import { Classe } from '../../../core/models/classe.model';

@Component({
  selector: 'app-releves',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './releves.component.html',
})
export class RelevesComponent implements OnInit {
  releves = signal<Releve[]>([]);
  classes = signal<Classe[]>([]);
  loading = signal(true);
  generating = signal(false);
  downloading = signal<number | null>(null);
  successMsg = signal('');
  errorMsg = signal('');

  selectedClasseId = 0;
  selectedSemestre = 1;
  annee = new Date().getFullYear() + '-' + (new Date().getFullYear() + 1);

  constructor(
    private releveService: ReleveService,
    private classeService: ClasseService,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    const user = this.authService.currentUser();
    if (!user) return;

    this.releveService.findByEtudiant(user.id).subscribe({
      next: (releves) => {
        this.releves.set(releves);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.classeService.findByEtudiant(user.id).subscribe({
      next: (classes) => this.classes.set(classes),
    });
  }

  generer() {
    const user = this.authService.currentUser();
    if (!user || !this.selectedClasseId) {
      this.errorMsg.set('Veuillez sélectionner une classe');
      return;
    }
    this.generating.set(true);
    this.errorMsg.set('');

    this.releveService
      .generer(user.id, +this.selectedClasseId, this.selectedSemestre, this.annee)
      .subscribe({
        next: (releve) => {
          this.generating.set(false);
          this.successMsg.set('Relevé généré avec succès');
          this.releves.update((r) => [releve, ...r]);
          setTimeout(() => this.successMsg.set(''), 3000);
        },
        error: (err) => {
          this.generating.set(false);
          this.errorMsg.set(err.error?.message || 'Erreur lors de la génération');
        },
      });
  }

  downloadPdf(releveId: number) {
    this.downloading.set(releveId);
    this.releveService.exportPdf(releveId).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `releve_${releveId}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        this.downloading.set(null);
      },
      error: () => this.downloading.set(null),
    });
  }

  getStatutClass(statut: string) {
    return statut === 'ADMIS' ? 'badge-success' : 'badge-danger';
  }
}
