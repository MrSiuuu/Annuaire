import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LoginResponse } from '../interfaces/auth.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private currentUserData: any = null;

  constructor(private http: HttpClient) {
    // Vérifie si un token existe au démarrage
    const token = localStorage.getItem('token');
    if (token) {
      this.getCurrentUser().subscribe();
    }
  }

  // Inscription utilisateur
  registerUser(userData: any): Observable<any> {
    console.log('Registering user:', userData);
    return this.http.post(`${this.apiUrl}/users/register`, userData).pipe(
      tap(response => console.log('Register response:', response))
    );
  }

  // Connexion utilisateur
  loginUser(credentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/users/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userType', 'user');
          this.currentUserData = response.user;
          this.currentUserSubject.next(response.user);
        }),
        catchError(error => {
          if (error.status === 404 || error.status === 401) {
            // Retourner une erreur spécifique pour pouvoir tester la connexion entreprise
            return throwError(() => new Error('Invalid user credentials'));
          }
          return throwError(() => error);
        })
      );
  }

  // Inscription entreprise
  registerCompany(companyData: any): Observable<any> {
    console.log('Registering company:', companyData);
    return this.http.post(`${this.apiUrl}/companies`, companyData).pipe(
      tap(response => console.log('Register response:', response)),
      catchError(error => {
        console.error('Registration error:', error);
        if (error.status === 0) {
          throw new Error('Le serveur ne répond pas. Vérifiez que le backend est démarré.');
        }
        throw error;
      })
    );
  }

  // Connexion entreprise
  loginCompany(credentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/companies/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userType', 'company');
          this.currentUserData = response.company;
          this.currentUserSubject.next(response.company);
        })
      );
  }

  // Récupérer l'utilisateur courant
  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  getCurrentUserData() {
    return this.currentUserData;
  }

  getUserType(): 'user' | 'company' | null {
    return localStorage.getItem('userType') as 'user' | 'company' | null;
  }

  // Déconnexion
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    this.currentUserData = null;
    this.currentUserSubject.next(null);
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  loginAdmin(credentials: {email: string, password: string}) {
    return this.http.post<any>(`${this.apiUrl}/admin/login`, credentials).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userType', 'admin');
          this.currentUserSubject.next(response.user);
        }
      }),
      catchError(error => {
        console.error('Erreur de connexion admin:', error);
        return throwError(() => error);
      })
    );
  }
} 