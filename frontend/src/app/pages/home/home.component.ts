import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Liste des entreprises vérifiées</h1>

      <div class="companies-grid" *ngIf="companies.length > 0">
        <div class="company-card" *ngFor="let company of companies">
          <h3>{{ company.name }}</h3>
          <p class="sector">{{ company.sector }}</p>
          <p class="description">{{ company.description }}</p>
          <div class="contact-info">
            <p><strong>Téléphone:</strong> {{ company.phone }}</p>
            <p><strong>Email:</strong> {{ company.email }}</p>
          </div>
          <a *ngIf="company.website" [href]="company.website" target="_blank" class="website-link">
            Visiter le site web
          </a>
        </div>
      </div>

      <div *ngIf="companies.length === 0" class="no-companies">
        <p>Aucune entreprise vérifiée trouvée.</p>
      </div>
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
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .sector {
      color: #666;
      font-style: italic;
    }

    .description {
      margin: 10px 0;
    }

    .contact-info {
      margin: 15px 0;
      font-size: 0.9em;
    }

    .website-link {
      display: inline-block;
      padding: 8px 16px;
      background: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 4px;
    }

    .no-companies {
      text-align: center;
      padding: 40px;
      color: #666;
    }
  `]
})
export class HomeComponent implements OnInit {
  companies: any[] = [];

  constructor(
    private apiService: ApiService,
    public authService: AuthService
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
}
