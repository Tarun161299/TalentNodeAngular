// src/app/services/data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../Environments/enironmets';
import { ApiEndpoints } from '../Endpoints/api-endpoints';
import { EmployeeData } from '../../Model/EmployeeData';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

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
  getEmployeesDetails(): Observable<EmployeeData[]> {
    return this.http.get<EmployeeData[]>(`${this.baseUrl+ApiEndpoints.GetAllEmployes}`, { headers: this.getHeaders() });
  }

  // Fetch a single employee by ID
  getResumeByEmployeeId(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl+ApiEndpoints.GetResumeByEmployeeId+id}`, { headers: this.getHeaders() });
  }

  // Add more endpoints here as needed
}
