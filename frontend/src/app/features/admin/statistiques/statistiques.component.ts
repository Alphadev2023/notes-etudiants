import { Component, OnInit, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ClasseService } from '../../../core/services/classe.service';
import { MatiereService } from '../../../core/services/matiere.service';
import { NoteService } from '../../../core/services/note.service';
import { Classe } from '../../../core/models/classe.model';
import { Matiere } from '../../../core/models/matiere.model';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-statistiques',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './statistiques.component.html',
})
export class StatistiquesComponent implements OnInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;

  classes = signal<Classe[]>([]);
  matieres = signal<Matiere[]>([]);
  loading = signal(true);
  selectedClasseId = 0;
  chart: any = null;

  constructor(
    private classeService: ClasseService,
    private matiereService: MatiereService,
    private noteService: NoteService,
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
    if (!this.selectedClasseId) return;
    this.matiereService.findByClasse(+this.selectedClasseId).subscribe({
      next: (matieres) => {
        this.matieres.set(matieres);
        this.buildChart(matieres);
      },
    });
  }

  buildChart(matieres: Matiere[]) {
    if (this.chart) this.chart.destroy();

    setTimeout(() => {
      if (!this.chartCanvas) return;
      const ctx = this.chartCanvas.nativeElement.getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: matieres.map((m) => m.nom),
          datasets: [
            {
              label: 'Coefficient',
              data: matieres.map((m) => m.coefficient),
              backgroundColor: 'rgba(37, 99, 235, 0.7)',
              borderColor: 'rgba(37, 99, 235, 1)',
              borderWidth: 1,
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: 'Coefficients par matière',
            },
          },
          scales: {
            y: { beginAtZero: true },
          },
        },
      });
    }, 100);
  }

  getTotalEtudiants() {
    return this.classes().reduce((s, c) => s + c.etudiantIds.length, 0);
  }
}
