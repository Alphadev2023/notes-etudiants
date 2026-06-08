import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ClasseService } from '../../../core/services/classe.service';
import { MatiereService } from '../../../core/services/matiere.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Classe } from '../../../core/models/classe.model';
import { Matiere } from '../../../core/models/matiere.model';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './classes.component.html',
})
export class ClassesComponent implements OnInit {
  classes = signal<Classe[]>([]);
  selectedClasse = signal<Classe | null>(null);
  matieres = signal<Matiere[]>([]);
  loading = signal(true);

  constructor(
    private classeService: ClasseService,
    private matiereService: MatiereService,
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

  selectClasse(classe: Classe) {
    this.selectedClasse.set(classe);
    this.matiereService.findByClasse(classe.id).subscribe({
      next: (matieres) => this.matieres.set(matieres),
    });
  }
}
