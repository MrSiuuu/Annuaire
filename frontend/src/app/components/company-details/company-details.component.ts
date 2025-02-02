import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Company {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  sector: string;
  description: string;
  website: string;
  social_links: any;
  created_at: string;
  logo: string;
}

@Component({
  selector: 'app-company-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="company-details-container">
      @if (loading) {
        <div class="loading">Chargement...</div>
      } @else if (company) {
        <div class="company-card">
          @if (company.logo) {
            <img [src]="company.logo" alt="Logo" class="company-logo">
          }
          
          <h1>{{ company.name }}</h1>
          
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
              <div class="social-links">
                @if (company.social_links.facebook) {
                  <a [href]="company.social_links.facebook" target="_blank">Facebook</a>
                }
                @if (company.social_links.linkedin) {
                  <a [href]="company.social_links.linkedin" target="_blank">LinkedIn</a>
                }
                @if (company.social_links.twitter) {
                  <a [href]="company.social_links.twitter" target="_blank">Twitter</a>
                }
              </div>
            }
          </div>

          <div class="info-section">
            <p><strong>Membre depuis:</strong> {{ company.created_at | date }}</p>
          </div>
        </div>
      } @else {
        <div class="error">
          Entreprise non trouvée
        </div>
      }
    </div>
  `,
  styles: [`
    .company-details-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    .company-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 2rem;
    }

    .company-logo {
      max-width: 200px;
      height: auto;
      margin-bottom: 1rem;
    }

    h1 {
      color: #333;
      margin-bottom: 2rem;
      border-bottom: 2px solid #f0f0f0;
      padding-bottom: 1rem;
    }

    .info-section {
      margin-bottom: 2rem;
    }

    h2 {
      color: #555;
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }

    p {
      margin: 0.5rem 0;
      line-height: 1.6;
    }

    strong {
      color: #666;
      min-width: 120px;
      display: inline-block;
    }

    .social-links {
      display: flex;
      gap: 1rem;
      margin-top: 0.5rem;
    }

    .social-links a {
      color: #0066cc;
      text-decoration: none;
    }

    .social-links a:hover {
      text-decoration: underline;
    }

    .loading, .error {
      text-align: center;
      padding: 2rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .error {
      color: #dc3545;
    }
  `]
})
export class CompanyDetailsComponent implements OnInit {
  company: Company | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http.get<Company>(`${environment.apiUrl}/companies/${id}`)
        .subscribe({
          next: (data) => {
            this.company = data;
            this.loading = false;
          },
          error: (error) => {
            console.error('Erreur lors du chargement de l\'entreprise:', error);
            this.loading = false;
          }
        });
    }
  }
} 