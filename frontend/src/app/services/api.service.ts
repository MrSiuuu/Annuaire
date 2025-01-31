import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api'; // URL de l'API backend

  constructor(private http: HttpClient) {}

  getCompanies(): Observable<any[]> {
    console.log('Fetching companies...');
    return this.http.get<any[]>(`${this.apiUrl}/companies`).pipe(
      tap(companies => {
        console.log('Companies received:', companies);
      }),
      catchError(error => {
        console.error('Error fetching companies:', error);
        throw error;
      })
    );
  }
}
