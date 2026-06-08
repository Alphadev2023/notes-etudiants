import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse, User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSignal = signal<User | null>(this.loadUserFromStorage());
  private tokenSignal = signal<string | null>(localStorage.getItem('token'));

  currentUser = this.currentUserSignal.asReadonly();
  token = this.tokenSignal.asReadonly();

  isAuthenticated = computed(() => !!this.tokenSignal());
  isAdmin = computed(() => this.hasRole('ROLE_ADMIN'));
  isEnseignant = computed(() => this.hasRole('ROLE_ENSEIGNANT'));
  isEtudiant = computed(() => this.hasRole('ROLE_ETUDIANT'));

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, request).pipe(
      tap((response) => {
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.tokenSignal.set(response.accessToken);
        this.currentUserSignal.set(response.user);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);
    setTimeout(() => this.router.navigateByUrl('/auth/login'), 100);
  }

  hasRole(role: string): boolean {
    return this.currentUserSignal()?.roles?.includes(role as any) ?? false;
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  private loadUserFromStorage(): User | null {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  }
}
