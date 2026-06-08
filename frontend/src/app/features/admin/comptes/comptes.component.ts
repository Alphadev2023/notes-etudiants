import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { AuthService } from '../../../core/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-comptes',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './comptes.component.html',
})
export class ComptesComponent implements OnInit {
  users = signal<User[]>([]);
  loading = signal(true);
  saving = signal(false);
  showForm = signal(false);
  errorMsg = signal('');
  successMsg = signal('');

  form = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: 'ETUDIANT',
  };

  roles = [
    { value: 'ETUDIANT', label: 'Étudiant' },
    { value: 'ENSEIGNANT', label: 'Enseignant' },
    { value: 'ADMIN', label: 'Administrateur' },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.http.get<User[]>(`${environment.apiUrl}/users`).subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  toggleForm() {
    this.showForm.update((v) => !v);
    this.form = { nom: '', prenom: '', email: '', password: '', role: 'ETUDIANT' };
    this.errorMsg.set('');
  }

  onSubmit() {
    if (!this.form.nom || !this.form.prenom || !this.form.email || !this.form.password) {
      this.errorMsg.set('Veuillez remplir tous les champs');
      return;
    }
    this.saving.set(true);
    this.errorMsg.set('');

    this.http.post<User>(`${environment.apiUrl}/auth/register`, this.form).subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.successMsg.set('Compte créé avec succès');
        this.load();
        setTimeout(() => this.successMsg.set(''), 3000);
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMsg.set(err.error?.message || 'Erreur lors de la création');
      },
    });
  }

  getRoleBadge(roles: string[]) {
    if (roles.includes('ROLE_ADMIN')) return 'badge-danger';
    if (roles.includes('ROLE_ENSEIGNANT')) return 'badge-success';
    return 'badge-primary';
  }

  getRoleLabel(roles: string[]) {
    if (roles.includes('ROLE_ADMIN')) return 'Admin';
    if (roles.includes('ROLE_ENSEIGNANT')) return 'Enseignant';
    return 'Étudiant';
  }
}
