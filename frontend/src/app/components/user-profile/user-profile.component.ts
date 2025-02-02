import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <h2>Mon Profil</h2>
      @if (userData) {
        <div class="profile-details">
          <p><strong>Nom:</strong> {{ userData.name }}</p>
          <p><strong>Email:</strong> {{ userData.email }}</p>
          <p><strong>Type de compte:</strong> {{ userData.user_type }}</p>
          <p><strong>Date d'inscription:</strong> {{ userData.created_at | date }}</p>
        </div>
      } @else {
        <div class="error-message">
          Impossible de charger les données du profil.
        </div>
      }
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 2rem;
    }

    .profile-details {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .error-message {
      color: #dc3545;
      text-align: center;
      padding: 1rem;
      background: #f8d7da;
      border-radius: 4px;
    }

    h2 {
      margin-bottom: 2rem;
      text-align: center;
    }

    p {
      margin: 1rem 0;
    }

    strong {
      color: #555;
      width: 150px;
      display: inline-block;
    }
  `]
})
export class UserProfileComponent implements OnInit {
  userData: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Récupérer les données de l'utilisateur
    this.userData = this.authService.getCurrentUserData();
    console.log('UserData:', this.userData);

    // Si pas de données, essayer de les récupérer depuis le serveur
    if (!this.userData) {
      this.authService.getCurrentUser().subscribe({
        next: (user) => {
          console.log('User from server:', user);
          this.userData = user;
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        }
      });
    }
  }
} 