import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { LoginService } from './login.service';
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

    constructor(private loginService: LoginService, private router: Router,) {}
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const modifiedRequest = request.clone({
      setHeaders: {
        'X-App-Version': '1.0.0',
        'X-Request-Id': Math.random().toString(36).substring(2)
      }
    });
    const authReq = modifiedRequest.clone({
        headers: this.loginService.addAuthorizationHeader(modifiedRequest.headers)
      });
    return next.handle(authReq).pipe(tap(() => { },
    (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if(err.status === 403){
            this.loginService.deleteAccessToken();
            this.router.navigate(['login']);
            return;
          }
            if (err.status !== 401) {
                return;
            }
            this.router.navigate(['login']);
        }
    }));;
  }
}
