import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  nom = '';
  prenom = '';
  email = '';
  password = '';
  role = 'ETUDIANT';
  loading = signal(false);
  error = signal('');
  success = signal('');
  showPassword = signal(false);

  roles = [
    { value: 'ETUDIANT', label: 'Étudiant' },
    { value: 'ENSEIGNANT', label: 'Enseignant' },
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  onSubmit() {
    if (!this.nom || !this.prenom || !this.email || !this.password) {
      this.error.set('Veuillez remplir tous les champs');
      return;
    }
    if (this.password.length < 8) {
      this.error.set('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.http
      .post(`${environment.apiUrl}/auth/register`, {
        nom: this.nom,
        prenom: this.prenom,
        email: this.email,
        password: this.password,
        role: this.role,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.success.set('Compte créé avec succès ! Redirection...');
          setTimeout(() => this.router.navigateByUrl('/auth/login'), 1500);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err.error?.message || 'Erreur lors de la création');
        },
      });
  }
}
