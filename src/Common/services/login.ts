import { Injectable } from '@angular/core';
import { environment } from '../Environments/enironmets';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginDetails } from '../../Model/loginDetails';
import { ApiEndpoints } from '../Endpoints/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
    private baseUrl = environment.apiBaseUrl;
  
    constructor(private http: HttpClient) { }

      private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });

    
  }
  Authentication(login:LoginDetails ): Observable<any> {
    
      return this.http.post<any>(`${this.baseUrl+ApiEndpoints.Authentication}`,login ,{ headers: this.getHeaders() });
    }
}
