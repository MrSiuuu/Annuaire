import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Liste des entreprises</h1>

      @if (!companies.length) {
        <p>Aucune entreprise trouvée.</p>
      }

      <div class="companies-grid">
        @for (company of companies; track company.id) {
          <div class="company-card" (click)="handleCompanyClick(company.id)">
            <h3>{{ company.name }}</h3>
            <p><strong>Secteur:</strong> {{ company.sector }}</p>
            <p class="description">{{ company.description }}</p>
          </div>
        }
      </div>

      @if (showLoginModal) {
        <div class="modal-overlay">
          <div class="modal">
            <h2>Connexion requise</h2>
            <p>Vous devez être connecté pour voir les détails de l'entreprise.</p>
            <div class="modal-buttons">
              <button (click)="navigateToLogin()">Se connecter</button>
              <button (click)="navigateToRegister()">S'inscrire</button>
              <button class="cancel" (click)="showLoginModal = false">Annuler</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .companies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      padding: 20px 0;
    }

    .company-card {
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .company-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .description {
      color: #666;
      margin-top: 10px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      width: 90%;
      max-width: 400px;
      text-align: center;
    }

    .modal h2 {
      margin-bottom: 1rem;
      color: #333;
    }

    .modal p {
      margin-bottom: 1.5rem;
      color: #666;
    }

    .modal-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .modal-buttons button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .modal-buttons button:not(.cancel) {
      background-color: #007bff;
      color: white;
    }

    .modal-buttons button:not(.cancel):hover {
      background-color: #0056b3;
    }

    .modal-buttons .cancel {
      background-color: #dc3545;
      color: white;
    }

    .modal-buttons .cancel:hover {
      background-color: #c82333;
    }
  `]
})
export class HomeComponent implements OnInit {
  companies: any[] = [];
  showLoginModal = false;
  private pendingCompanyId: number | null = null;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.apiService.getCompanies().subscribe({
      next: (data) => {
        this.companies = data;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des entreprises:', err);
      },
    });
  }

  handleCompanyClick(companyId: number) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/company', companyId]);
    } else {
      this.pendingCompanyId = companyId;
      this.showLoginModal = true;
    }
  }

  navigateToLogin() {
    this.showLoginModal = false;
    // Stocker l'ID de l'entreprise dans le localStorage pour y revenir après la connexion
    if (this.pendingCompanyId) {
      localStorage.setItem('pendingCompanyId', this.pendingCompanyId.toString());
    }
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    this.showLoginModal = false;
    if (this.pendingCompanyId) {
      localStorage.setItem('pendingCompanyId', this.pendingCompanyId.toString());
    }
    this.router.navigate(['/register']);
  }
}
