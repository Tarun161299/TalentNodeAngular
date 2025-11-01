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
export class SignupService {  // Add "Service" suffix

  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_TOKEN_HERE' // replace with actual token if needed
    });
  }

 
  // Add this method for user registration
signupEmployee(signupData: any): Observable<any> {
  return this.http.post<any>( 
    `${this.baseUrl + ApiEndpoints.Signup}`, 
    signupData, 
    { headers: this.getHeaders() }
  );
}
  // Check if email exists
checkEmailExists(email: string): Observable<boolean> {
  return this.http.get<boolean>(
    `${this.baseUrl + ApiEndpoints.CheckEmail}?email=${email}`,
    { headers: this.getHeaders() }
  );
}

// Check if contact exists
checkContactExists(contact: string): Observable<boolean> {
  return this.http.get<boolean>(
    `${this.baseUrl + ApiEndpoints.CheckContact}?contact=${contact}`,
    { headers: this.getHeaders() }
  );
}
}

