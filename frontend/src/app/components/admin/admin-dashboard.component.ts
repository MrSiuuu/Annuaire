import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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

      <div class="companies-section">
        <h2>Entreprises en attente de validation</h2>
        
        @if (loading) {
          <div class="loading">Chargement...</div>
        }

        @if (companies.length === 0 && !loading) {
          <div class="no-companies">
            Aucune entreprise en attente de validation
          </div>
        }

        <div class="companies-grid">
          @for (company of companies; track company._id) {
            <div class="company-card">
              <h3>{{ company.name }}</h3>
              <p>Email: {{ company.email }}</p>
              <p>Date d'inscription: {{ company.createdAt | date }}</p>
              <button 
                (click)="validateCompany(company._id)"
                class="validate-btn"
              >
                Valider l'entreprise
              </button>
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

    .logout-btn {
      padding: 8px 16px;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
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
    }

    .validate-btn {
      width: 100%;
      padding: 10px;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 10px;
    }

    .loading {
      text-align: center;
      padding: 20px;
      color: #666;
    }

    .no-companies {
      text-align: center;
      padding: 20px;
      color: #666;
      background-color: #f8f9fa;
      border-radius: 4px;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  companies: any[] = [];
  loading: boolean = true;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadPendingCompanies();
  }

  loadPendingCompanies() {
    this.loading = true;
    this.http.get<any[]>(`${environment.apiUrl}/admin/pending-companies`)
      .subscribe({
        next: (companies) => {
          this.companies = companies;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des entreprises', error);
          this.loading = false;
        }
      });
  }

  validateCompany(id: string) {
    this.http.patch(`${environment.apiUrl}/admin/validate-company/${id}`, {})
      .subscribe({
        next: () => {
          this.loadPendingCompanies();
        },
        error: (error) => {
          console.error('Erreur lors de la validation', error);
        }
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
} 