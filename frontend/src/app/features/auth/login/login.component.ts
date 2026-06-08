import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');
  showPassword = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  onSubmit() {
    if (!this.email || !this.password) {
      this.error.set('Veuillez remplir tous les champs');
      return;
    }
    this.loading.set(true);
    this.error.set('');

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.loading.set(false);
        const roles = response.user.roles;
        if (roles.includes('ROLE_ADMIN')) {
          setTimeout(() => this.router.navigateByUrl('/admin/dashboard'), 100);
        } else if (roles.includes('ROLE_ENSEIGNANT')) {
          setTimeout(() => this.router.navigateByUrl('/enseignant/dashboard'), 100);
        } else {
          setTimeout(() => this.router.navigateByUrl('/etudiant/dashboard'), 100);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Email ou mot de passe incorrect');
      },
    });
  }
}
