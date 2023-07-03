import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { CookieService } from "ngx-cookie-service";
import { tap } from "rxjs/operators";
@Injectable({
  providedIn: "root",
})
export class LoginService {
  private apiUrl = `${environment.properties["ssdURL"]}`;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  login(username: string, password: string, organisation): any {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
    const options = {
      headers: headers,
      withCredentials: true, // enable sending cookies cross-site
      cookieOptions: "SameSite=None; Secure", // set the SameSite and Secure attributes
    };
    const body = {
      username: username,
      password: password,
      organisation: organisation,
    };

    return this.http
      .post<any>(`${this.apiUrl}login`, {
        username: username,
        password: password,
        org: organisation,
      });
  }

  isLoggedIn(): any {
    return this.cookieService.get("access_token");
  }

  setAccessToken(token: string): void {
    this.cookieService.set("access_token", token);
  }

  deleteAccessToken(): void {
    this.cookieService.delete("access_token");
  }

  logout(): Observable<any> {
    this.cookieService.delete("access_token");
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<any>(`${this.apiUrl}/logout`, null, { headers });
  }

  getAccessToken(): string {
    return this.cookieService.get("access_token");
  }

  addAuthorizationHeader(headers: HttpHeaders): HttpHeaders {
    const accessToken = this.getAccessToken();
    if (accessToken) {
      return headers.append("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  }
}
