import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MockApi } from './add-mock-api/add-mock-api.component';
import { environment } from 'environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MockApiService {

  private apiUrl = `${environment.properties['ssdURL']}`;

  constructor(private http: HttpClient) { }

  getMockApis(): Observable<MockApi[]> {
    return this.http.get<MockApi[]>(this.apiUrl+'routes');
  }

  getMockApi(id: number): Observable<MockApi> {
    const url = `${this.apiUrl}routes/${id}`;
    return this.http.get<MockApi>(url);
  }

  addMockApi(mockApi: MockApi): Observable<MockApi> {
    return this.http.post<MockApi>(this.apiUrl + 'register-route', mockApi);
  }

  updateMockApi(mockApi: MockApi): Observable<MockApi> {
    const url = `${this.apiUrl}routes/${mockApi._id}`;
    return this.http.put<MockApi>(url, mockApi);
  }

  deleteMockApi(id: any): Observable<MockApi> {
    const url = `${this.apiUrl}routes/${id}`;
    return this.http.delete<MockApi>(url);
  }
}
