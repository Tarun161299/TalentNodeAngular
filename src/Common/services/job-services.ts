import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../Environments/enironmets';
import { ApiEndpoints } from '../Endpoints/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class JobServices {
      private baseUrl = environment.apiBaseUrl;
    
      constructor(private http: HttpClient) { }
  
        private getHeaders(): HttpHeaders {
      return new HttpHeaders({
        'Content-Type': 'application/json',
      });
  
      
    }
    SaveJob(data:any ): Observable<any> {
      
        return this.http.post<any>(`${this.baseUrl+ApiEndpoints.saveJobs}`,data ,{ headers: this.getHeaders() });
      }
      GetJobsHr(data:any ): Observable<any> {
      
        return this.http.get<any>(`${this.baseUrl+ApiEndpoints.GetJobsHr+data.toString()}` ,{ headers: this.getHeaders() });
      }

         GetJobsdetail(data:any ): Observable<any> {
      
        return this.http.get<any>(`${this.baseUrl+ApiEndpoints.GetJobsDetailsByJobid+data.toString()}` ,{ headers: this.getHeaders() });
      }
}
