// src/app/services/data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../Environments/enironmets';
import { ApiEndpoints } from '../Endpoints/api-endpoints';
import { EmployeeData } from '../../Model/EmployeeData';
import { Employee } from '../../Model/AddProfile';
@Injectable({
  providedIn: 'root'
})
export class EmailService {
    private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_TOKEN_HERE' // replace with actual token if needed
    });
  }

  // Fetch all documents metadata
 
  // Fetch all employees
  Sendemail(Data:any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl+ApiEndpoints.sendEmail}`,Data, { headers: this.getHeaders() });
  }
}
