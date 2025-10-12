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
 SaveEmployeesDetails(data:Employee): Observable<any> {
    return this.http.post<any>(`${this.baseUrl+ApiEndpoints.saveEmployee}`, data,{ headers: this.getHeaders() });
  }
  // Fetch a single employee by ID
  getResumeByEmployeeId(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl+ApiEndpoints.GetResumeByEmployeeId+id}`, { headers: this.getHeaders() });
  }
  saveProfile(profile: Employee): Observable<any> {
    return this.http.post<any>(`${this.baseUrl+ApiEndpoints.saveProfile}`,profile, { headers: this.getHeaders() });
  }
  getEmployeedetailsById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl+ApiEndpoints.getEmployeeDetails+id}`, { headers: this.getHeaders() });
  }
  SaveExperience(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl+ApiEndpoints.SaveExperience}`,data, { headers: this.getHeaders() });
  }

  saveSkillDetails(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl+ApiEndpoints.saveSkillDetails}`,data, { headers: this.getHeaders() });
  }

   SaveQuaification(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl+ApiEndpoints.AddEducation}`,data, { headers: this.getHeaders() });
  }

   SaveDocument(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl+ApiEndpoints.saveDocument}`,data, { headers: this.getHeaders() });
  }
  // Add more endpoints here as needed
}
