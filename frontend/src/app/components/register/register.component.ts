import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="register-container">
      <div class="register-type-selector">
        <button [class.active]="registerType === 'user'" (click)="setRegisterType('user')">
          Utilisateur
        </button>
        <button [class.active]="registerType === 'company'" (click)="setRegisterType('company')">
          Entreprise
        </button>
      </div>

      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <div>
          <label>Nom</label>
          <input type="text" formControlName="name">
          <div *ngIf="registerForm.get('name')?.errors?.['required'] && registerForm.get('name')?.touched" class="error">
            Le nom est requis
          </div>
        </div>

        <div>
          <label>Email</label>
          <input type="email" formControlName="email">
          <div *ngIf="registerForm.get('email')?.errors?.['required'] && registerForm.get('email')?.touched" class="error">
            L'email est requis
          </div>
          <div *ngIf="registerForm.get('email')?.errors?.['email'] && registerForm.get('email')?.touched" class="error">
            Format d'email invalide
          </div>
        </div>

        <div>
          <label>Mot de passe</label>
          <input type="password" formControlName="password">
          <div *ngIf="registerForm.get('password')?.errors?.['required'] && registerForm.get('password')?.touched" class="error">
            Le mot de passe est requis
          </div>
          <div *ngIf="registerForm.get('password')?.errors?.['minlength'] && registerForm.get('password')?.touched" class="error">
            Le mot de passe doit contenir au moins 6 caractères
          </div>
        </div>

        <!-- Champs spécifiques aux entreprises -->
        <ng-container *ngIf="registerType === 'company'">
          <div>
            <label>Téléphone</label>
            <input type="tel" formControlName="phone">
            <div *ngIf="registerForm.get('phone')?.errors?.['required'] && registerForm.get('phone')?.touched" class="error">
              Le téléphone est requis
            </div>
            <div *ngIf="registerForm.get('phone')?.errors?.['pattern'] && registerForm.get('phone')?.touched" class="error">
              Format de téléphone invalide (10 chiffres requis)
            </div>
          </div>

          <div>
            <label>Adresse</label>
            <input type="text" formControlName="address">
          </div>

          <div>
            <label>Secteur d'activité</label>
            <input type="text" formControlName="sector">
          </div>

          <div>
            <label>Description</label>
            <textarea formControlName="description"></textarea>
          </div>

          <div>
            <label>Site web</label>
            <input type="url" formControlName="website">
          </div>
        </ng-container>

        <button type="submit" [disabled]="registerForm.invalid">
          S'inscrire
        </button>

        <div *ngIf="registerForm.invalid && registerForm.touched" class="error-summary">
          Veuillez corriger les erreurs suivantes :
          <ul>
            <li *ngIf="registerForm.get('password')?.errors?.['minlength']">
              Le mot de passe est trop court
            </li>
            <li *ngIf="registerForm.get('email')?.errors?.['email']">
              Format d'email invalide
            </li>
            <!-- Ajoutez d'autres messages d'erreur selon vos besoins -->
          </ul>
        </div>

        <pre>{{ registerForm.value | json }}</pre>
        <pre>Form valid: {{ registerForm.valid }}</pre>
        <pre>Form errors: {{ registerForm.errors | json }}</pre>
      </form>
    </div>
  `,
  styles: [`
    .register-container {
      max-width: 500px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .register-type-selector {
      margin-bottom: 20px;
      text-align: center;
    }
    
    form div {
      margin-bottom: 15px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
    }
    
    input, textarea {
      width: 100%;
      padding: 8px;
    }
    
    button {
      padding: 10px 20px;
      cursor: pointer;
    }
    
    button.active {
      background-color: #007bff;
      color: white;
    }

    .error {
      color: red;
      font-size: 0.8em;
      margin-top: 5px;
    }

    .error-summary {
      color: red;
      font-size: 0.8em;
      margin-top: 5px;
    }
  `]
})
export class RegisterComponent {
  registerForm!: FormGroup;
  registerType: 'user' | 'company' = 'user';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeForm();
  }

  setRegisterType(type: 'user' | 'company') {
    this.registerType = type;
    this.initializeForm();
  }

  initializeForm() {
    const baseFields = {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    };

    if (this.registerType === 'company') {
      this.registerForm = this.fb.group({
        ...baseFields,
        phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        address: ['', Validators.required],
        sector: ['', Validators.required],
        description: ['', [Validators.required, Validators.minLength(10)]],
        website: ['', [Validators.pattern('^https?://.*')]],
        social_links: ['']
      });
    } else {
      this.registerForm = this.fb.group({
        ...baseFields,
        user_type: ['user']
      });
    }

    this.registerForm.statusChanges.subscribe(status => {
      console.log('Form Status:', status);
      console.log('Form Errors:', this.registerForm.errors);
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control?.errors) {
          console.log(`${key} Errors:`, control.errors);
        }
      });
    });
  }

  onSubmit() {
    console.log('Form submitted', this.registerForm.value);
    
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      
      if (this.registerType === 'user') {
        formData.user_type = 'user';
        this.authService.registerUser(formData).subscribe({
          next: (response) => {
            console.log('Inscription réussie:', response);
            this.router.navigate(['/login']);
          },
          error: (error) => {
            console.error('Erreur d\'inscription:', error);
            alert('Erreur lors de l\'inscription: ' + error.message);
          }
        });
      } else {
        this.authService.registerCompany(formData).subscribe({
          next: (response) => {
            console.log('Registration successful:', response);
            this.router.navigate(['/login']);
          },
          error: (error) => {
            console.error('Registration error details:', error);
            let errorMessage = 'Erreur lors de l\'inscription';
            
            if (error.error?.details) {
              errorMessage += ': ' + error.error.details;
            } else if (error.message) {
              errorMessage = error.message;
            }
            
            alert(errorMessage);
          }
        });
      }
    } else {
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
    }
  }
} 