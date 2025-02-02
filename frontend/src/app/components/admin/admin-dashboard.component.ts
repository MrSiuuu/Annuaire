import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface Company {
  id: number;
  name: string;
  email: string;
  phone: string;
  sector: string;
  description: string;
  created_at: string;
  is_verified: boolean;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-dashboard">
      <header>
        <h1>Dashboard Administrateur</h1>
        <button (click)="logout()" class="logout-btn">Déconnexion</button>
      </header>

      <div class="dashboard-section">
        <h2>Entreprises en attente de validation</h2>
        @if (loading) {
          <div class="loading">Chargement...</div>
        }

        @if (pendingCompanies.length === 0 && !loading) {
          <div class="no-data">Aucune entreprise en attente</div>
        }

        <div class="companies-grid">
          @for (company of pendingCompanies; track company.id) {
            <div class="company-card">
              <h3>{{ company.name }}</h3>
              <p><strong>Email:</strong> {{ company.email }}</p>
              <p><strong>Téléphone:</strong> {{ company.phone }}</p>
              <p><strong>Secteur:</strong> {{ company.sector }}</p>
              <p><strong>Description:</strong> {{ company.description }}</p>
              <p><strong>Date d'inscription:</strong> {{ company.created_at | date }}</p>
              <button (click)="verifyCompany(company.id)" class="verify-btn">
                Valider l'entreprise
              </button>
            </div>
          }
        </div>
      </div>

      <div class="dashboard-section">
        <h2>Entreprises validées</h2>
        @if (verifiedCompanies.length === 0 && !loading) {
          <div class="no-data">Aucune entreprise validée</div>
        }

        <div class="companies-grid">
          @for (company of verifiedCompanies; track company.id) {
            <div class="company-card verified">
              <h3>{{ company.name }}</h3>
              <p><strong>Email:</strong> {{ company.email }}</p>
              <p><strong>Téléphone:</strong> {{ company.phone }}</p>
              <p><strong>Secteur:</strong> {{ company.sector }}</p>
              <p><strong>Description:</strong> {{ company.description }}</p>
              <p><strong>Date de validation:</strong> {{ company.created_at | date }}</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .dashboard-section {
      margin-bottom: 40px;
    }

    .companies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .company-card {
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background-color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .company-card.verified {
      border-left: 4px solid #28a745;
    }

    .verify-btn {
      width: 100%;
      padding: 10px;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 10px;
    }

    .logout-btn {
      padding: 8px 16px;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .loading, .no-data {
      text-align: center;
      padding: 20px;
      color: #666;
      background-color: #f8f9fa;
      border-radius: 4px;
    }

    h3 {
      margin: 0 0 15px 0;
      color: #333;
    }

    p {
      margin: 8px 0;
      font-size: 0.9em;
    }

    strong {
      color: #555;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  pendingCompanies: Company[] = [];
  verifiedCompanies: Company[] = [];
  loading = true;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadCompanies();
  }

  loadCompanies() {
    this.loading = true;
    
    // Charger les entreprises en attente
    this.http.get<Company[]>(`${environment.apiUrl}/admin/pending-companies`)
      .subscribe({
        next: (companies) => {
          this.pendingCompanies = companies;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des entreprises en attente:', error);
          this.loading = false;
        }
      });

    // Charger les entreprises validées
    this.http.get<Company[]>(`${environment.apiUrl}/admin/verified-companies`)
      .subscribe({
        next: (companies) => {
          this.verifiedCompanies = companies;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des entreprises validées:', error);
        }
      });
  }

  verifyCompany(id: number) {
    this.http.patch(`${environment.apiUrl}/admin/verify-company/${id}`, {})
      .subscribe({
        next: () => {
          this.loadCompanies(); // Recharger les listes après validation
        },
        error: (error) => {
          console.error('Erreur lors de la validation:', error);
        }
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
} 