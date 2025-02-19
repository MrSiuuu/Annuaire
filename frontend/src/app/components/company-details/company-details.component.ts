import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-company-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="company-details-container">
      @if (company) {
        <div class="company-header">
          @if (company.logo) {
            <img [src]="company.logo" alt="Logo de l'entreprise" class="company-logo">
          }
          <h1>{{ company.name }}</h1>
        </div>

        <div class="company-info">
          <div class="info-section">
            <h2>Informations générales</h2>
            <p><strong>Secteur d'activité:</strong> {{ company.sector }}</p>
            <p><strong>Description:</strong> {{ company.description }}</p>
          </div>

          <div class="info-section">
            <h2>Contact</h2>
            <p><strong>Email:</strong> {{ company.email }}</p>
            <p><strong>Téléphone:</strong> {{ company.phone }}</p>
            <p><strong>Adresse:</strong> {{ company.address }}</p>
          </div>

          <div class="info-section">
            <h2>Liens</h2>
            @if (company.website) {
              <p>
                <strong>Site web:</strong>
                <a [href]="company.website" target="_blank">{{ company.website }}</a>
              </p>
            }
            @if (company.social_links) {
              <p>
                <strong>Réseaux sociaux:</strong>
                <span>{{ company.social_links }}</span>
              </p>
            }
          </div>
        </div>
      } @else {
        <div class="loading">
          Chargement des informations...
        </div>
      }
    </div>
  `,
  styles: [`
    .company-details-container {
      max-width: 1000px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    .company-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .company-logo {
      max-width: 200px;
      height: auto;
      margin-bottom: 1rem;
    }

    .company-info {
      display: grid;
      gap: 2rem;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }

    .info-section {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h1 {
      color: #333;
      margin-bottom: 1rem;
    }

    h2 {
      color: #444;
      font-size: 1.2rem;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #f0f0f0;
    }

    p {
      margin: 0.8rem 0;
      line-height: 1.6;
    }

    strong {
      color: #555;
      margin-right: 0.5rem;
    }

    a {
      color: #007bff;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: #666;
    }
  `]
})
export class CompanyDetailsComponent implements OnInit {
  company: any = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadCompanyDetails(id);
      }
    });
  }

  private loadCompanyDetails(id: number) {
    this.apiService.getCompanyById(id).subscribe({
      next: (company) => {
        this.company = company;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des détails de l\'entreprise:', error);
      }
    });
  }
} 