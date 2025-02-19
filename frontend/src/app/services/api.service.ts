import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api'; // URL de l'API backend

  constructor(private http: HttpClient) {}

  getCompanies(): Observable<any[]> {
    console.log('Fetching verified companies...');
    return this.http.get<any[]>(`${this.apiUrl}/companies`).pipe(
      map(companies => companies.filter(company => company.is_verified)),
      tap(companies => {
        console.log('Verified companies received:', companies);
      }),
      catchError(error => {
        console.error('Error fetching companies:', error);
        throw error;
      })
    );
  }

  getCompanyById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/companies/${id}`).pipe(
      tap(company => {
        console.log('Company details received:', company);
      }),
      catchError(error => {
        console.error('Error fetching company details:', error);
        throw error;
      })
    );
  }
}
