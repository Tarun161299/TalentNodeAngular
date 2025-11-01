import { Injectable } from '@angular/core';
import { environment } from '../Environments/enironmets';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiEndpoints } from '../Endpoints/api-endpoints';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModuleServices {
      private baseUrl = environment.apiBaseUrl;
    
      constructor(private http: HttpClient) { }
  
        private getHeaders(): HttpHeaders {
      return new HttpHeaders({
        'Content-Type': 'application/json',
      });
  
      
    }
    GetModuleById(RoleId:any ): Observable<any> {
      
        return this.http.get<any>(`${this.baseUrl+ApiEndpoints.ModuleByRole}`+RoleId.toString() ,{ headers: this.getHeaders() });
      }
}
