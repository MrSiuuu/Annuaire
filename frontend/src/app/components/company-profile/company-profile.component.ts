import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <h2>Mon Compte Entreprise</h2>
      
      @if (!companyData.is_verified) {
        <div class="verification-pending">
          <p>Votre entreprise est en attente de validation par un administrateur.</p>
          <p>Vous serez visible sur la page d'accueil une fois validé.</p>
        </div>
      }

      <div class="company-details" *ngIf="companyData">
        <div class="detail-item">
          <strong>Nom:</strong> {{ companyData.name }}
        </div>
        <div class="detail-item">
          <strong>Email:</strong> {{ companyData.email }}
        </div>
        <div class="detail-item">
          <strong>Téléphone:</strong> {{ companyData.phone }}
        </div>
        <div class="detail-item">
          <strong>Adresse:</strong> {{ companyData.address }}
        </div>
        <div class="detail-item">
          <strong>Secteur:</strong> {{ companyData.sector }}
        </div>
        <div class="detail-item">
          <strong>Description:</strong> {{ companyData.description }}
        </div>
        <div class="detail-item">
          <strong>Site web:</strong> 
          <a href="{{ companyData.website }}" target="_blank">{{ companyData.website }}</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    h2 {
      text-align: center;
      margin-bottom: 30px;
    }

    .company-details {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .detail-item {
      margin-bottom: 15px;
      padding: 10px;
      border-bottom: 1px solid #eee;
    }

    .detail-item strong {
      display: inline-block;
      width: 120px;
      color: #666;
    }

    .verification-pending {
      background-color: #fff3cd;
      color: #856404;
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 4px;
      border: 1px solid #ffeeba;
    }
  `]
})
export class CompanyProfileComponent implements OnInit {
  companyData: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.companyData = this.authService.getCurrentUserData();
  }
} 