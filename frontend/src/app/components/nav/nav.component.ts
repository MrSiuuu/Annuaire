import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar">
      <div class="nav-brand">Annuaire</div>
      <div class="nav-links">
        <a routerLink="/" class="nav-link">Accueil</a>
        
        @if (!authService.isLoggedIn()) {
          <a routerLink="/login" class="nav-link">Connexion</a>
          <a routerLink="/register" class="nav-link">Inscription</a>
        }

        @if (authService.isLoggedIn()) {
          @if (authService.getUserType() === 'company') {
            <a routerLink="/company-profile" class="nav-link">Profil Entreprise</a>
          } @else if (authService.getUserType() === 'user') {
            <a routerLink="/user-profile" class="nav-link">Mon Profil</a>
          }
          <button (click)="logout()" class="nav-link">Déconnexion</button>
        }

        <a routerLink="/admin/login" class="nav-link">Admin</a>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background-color: #f8f9fa;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .nav-brand {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .nav-links {
      display: flex;
      gap: 1rem;
    }

    .nav-link {
      text-decoration: none;
      color: #333;
      padding: 0.5rem 1rem;
      border-radius: 4px;
    }

    .nav-link:hover {
      background-color: #e9ecef;
    }

    button.nav-link {
      border: none;
      background: none;
      cursor: pointer;
    }
  `]
})
export class NavComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
} 