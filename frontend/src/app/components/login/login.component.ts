import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="login-container" *ngIf="!authService.isLoggedIn()">
      <h2>Connexion</h2>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div>
          <label>Email</label>
          <input type="email" formControlName="email">
          <div *ngIf="loginForm.get('email')?.errors?.['required'] && loginForm.get('email')?.touched" class="error">
            L'email est requis
          </div>
          <div *ngIf="loginForm.get('email')?.errors?.['email'] && loginForm.get('email')?.touched" class="error">
            Format d'email invalide
          </div>
        </div>

        <div>
          <label>Mot de passe</label>
          <input type="password" formControlName="password">
          <div *ngIf="loginForm.get('password')?.errors?.['required'] && loginForm.get('password')?.touched" class="error">
            Le mot de passe est requis
          </div>
        </div>

        <button type="submit" [disabled]="loginForm.invalid">
          Se connecter
        </button>

        <div class="register-link">
          Pas encore de compte ? 
          <a routerLink="/register">S'inscrire</a>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 0 auto;
      padding: 20px;
    }
    
    form div {
      margin-bottom: 15px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
    }
    
    input {
      width: 100%;
      padding: 8px;
    }
    
    button {
      width: 100%;
      padding: 10px;
      margin-top: 10px;
      cursor: pointer;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
    }
    
    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    
    .register-link {
      text-align: center;
      margin-top: 20px;
    }

    h2 {
      text-align: center;
      margin-bottom: 20px;
    }

    .error {
      color: red;
      font-size: 0.8em;
      margin-top: 5px;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      
      // Essayer d'abord la connexion utilisateur
      this.authService.loginUser(credentials).subscribe({
        next: (response) => {
          console.log('Connexion utilisateur réussie:', response);
          this.router.navigate(['/']);
        },
        error: (userError) => {
          // Si échec, essayer la connexion entreprise
          this.authService.loginCompany(credentials).subscribe({
            next: (response) => {
              console.log('Connexion entreprise réussie:', response);
              this.router.navigate(['/company-profile']);
            },
            error: (companyError) => {
              console.error('Erreur de connexion:', companyError);
              alert('Email ou mot de passe incorrect');
            }
          });
        }
      });
    }
  }
} 