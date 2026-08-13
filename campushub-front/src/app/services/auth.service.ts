import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest, AuthResponse } from '../model/auth.interface';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);

  // Signals initialisés depuis localStorage, survivent au rechargement de page
//   private tokenSignal = signal<string | null>(localStorage.getItem('token'));
//   private roleSignal  = signal<string | null>(localStorage.getItem('role'));
  private tokenSignal = signal<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('token') : null // SSR-safe : localStorage n'existe pas côté serveur, donc on vérifie qu'on est dans le navigateur avant d'y accéder
  );
  private roleSignal = signal<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('role') : null // SSR-safe : localStorage n'existe pas côté serveur, donc on vérifie qu'on est dans le navigateur avant d'y accéder
  );

  // Dérivés automatiquement, se mettent à jour quand token/role changent
  estConnecte = computed(() => this.tokenSignal() !== null);
  estAdmin    = computed(() => this.roleSignal() === 'ADMIN');

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        // tap stocke la session sans modifier la réponse qui continue vers le composant
        tap(response => this.stockerSession(response))
      );
  }

  logout(): void {
    // Nettoie localStorage et remet les signals à null
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.tokenSignal.set(null);
    this.roleSignal.set(null);
    this.router.navigate(['/login']);
  }

  // Appelé par l'intercepteur pour récupérer le token à injecter dans les requêtes
  getToken(): string | null {
    return this.tokenSignal();
  }

  private stockerSession(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('role', response.role);
    // Met à jour les signals — tout ce qui en dépend se rafraîchit automatiquement
    this.tokenSignal.set(response.token);
    this.roleSignal.set(response.role);
  }
}


