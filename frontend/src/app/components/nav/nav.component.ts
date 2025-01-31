import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar">
      <div class="nav-brand">Annuaire</div>
      <div class="nav-links">
        <a routerLink="/" class="nav-link">Accueil</a>
        <ng-container *ngIf="!authService.isLoggedIn()">
          <a routerLink="/login" class="nav-link">Connexion</a>
          <a routerLink="/register" class="nav-link">Inscription</a>
        </ng-container>
        <ng-container *ngIf="authService.isLoggedIn()">
          <a routerLink="/profile" class="nav-link">Profil</a>
          <button (click)="logout()" class="nav-link">Déconnexion</button>
        </ng-container>
        <li>
          <a routerLink="/admin/login">Admin</a>
        </li>
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
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
} 