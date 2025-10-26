
import { Injectable } from '@angular/core';
import { environment } from '../Environments/enironmets';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiEndpoints } from '../Endpoints/api-endpoints';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterServices {
      private baseUrl = environment.apiBaseUrl;
    
      constructor(private http: HttpClient) { }
  
        private getHeaders(): HttpHeaders {
      return new HttpHeaders({
        'Content-Type': 'application/json',
      });
  
      
    }
    GetAllState( ): Observable<any> {
      debugger
        return this.http.get<any>(`${this.baseUrl+ApiEndpoints.GetAllState}`,{ headers: this.getHeaders() });
      }

      GetAllDistrict( ): Observable<any> {
      debugger
        return this.http.get<any>(`${this.baseUrl+ApiEndpoints.GetAllDistrict}`,{ headers: this.getHeaders() });
      }
      GetAllSkill( ): Observable<any> {
      debugger
        return this.http.get<any>(`${this.baseUrl+ApiEndpoints.GetAllSkill}`,{ headers: this.getHeaders() });
      }

      GetAllQualification( ): Observable<any> {
      debugger
        return this.http.get<any>(`${this.baseUrl+ApiEndpoints.Qualification}`,{ headers: this.getHeaders() });
      }

      GetAllDepartment( ): Observable<any> {
      debugger
        return this.http.get<any>(`${this.baseUrl+ApiEndpoints.Department}`,{ headers: this.getHeaders() });
      }
      GetAllBenifits( ): Observable<any> {
      debugger
        return this.http.get<any>(`${this.baseUrl+ApiEndpoints.Benifits}`,{ headers: this.getHeaders() });
      }
      GetAllCompany( hrid:number): Observable<any> {
      debugger
        return this.http.get<any>(`${this.baseUrl+ApiEndpoints.Company+hrid.toString()}`,{ headers: this.getHeaders() });
      }
        GetAllJobType(): Observable<any> {
      debugger
        return this.http.get<any>(`${this.baseUrl+ApiEndpoints.JobType}`,{ headers: this.getHeaders() });
      }
}
