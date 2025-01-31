@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-dashboard">
      <h2>Tableau de bord administrateur</h2>
      
      <div class="pending-companies">
        <h3>Entreprises en attente de validation</h3>
        <div class="companies-list">
          <div *ngFor="let company of pendingCompanies" class="company-item">
            <h4>{{ company.name }}</h4>
            <p>{{ company.email }}</p>
            <button (click)="validateCompany(company._id)">Valider</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      padding: 20px;
    }
    .company-item {
      border: 1px solid #ddd;
      padding: 15px;
      margin-bottom: 10px;
      border-radius: 4px;
    }
    button {
      background-color: #4CAF50;
      color: white;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  pendingCompanies: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadPendingCompanies();
  }

  loadPendingCompanies() {
    this.http.get<any[]>('/api/admin/pending-companies')
      .subscribe(companies => {
        this.pendingCompanies = companies;
      });
  }

  validateCompany(id: string) {
    this.http.patch(`/api/admin/validate-company/${id}`, {})
      .subscribe(() => {
        this.loadPendingCompanies();
      });
  }
} 