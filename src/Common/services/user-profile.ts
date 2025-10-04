import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class UserProfile {
  private apiUrl = 'api/profile'; // Your API endpoint
  constructor(private http: HttpClient) {}

  getProfile(userId: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/${userId}`);
  }
  updateProfile(profile: UserProfile): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/${profile}`, profile);//id
  }
  uploadAvatar(userId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post(`${this.apiUrl}/${userId}/avatar`, formData);
  }
  uploadResume(userId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('resume', file);
    return this.http.post(`${this.apiUrl}/${userId}/resume`, formData);
  }
  
}
