import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';
import { environment } from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LoginResolver implements Resolve<any> {

  constructor(private loginService: LoginService) {}

  resolve(): Observable<any> {
    if (!this.loginService.isLoggedIn()) {
      return null;
    } else {
      return this.loginService.login(environment.properties["USERNAME"],
      environment.properties["PASSWORD"],
      environment.properties["ORGANISATION"]);
    }
  }
}
