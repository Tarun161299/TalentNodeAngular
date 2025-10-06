
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
}
