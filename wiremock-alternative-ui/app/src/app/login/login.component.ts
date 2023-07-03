import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { LoginService } from "../login.service";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  organization: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private loginService: LoginService,
    private cookieService: CookieService
  ) {}

  onSubmit() {
    this.loginService
      .login(this.username, this.password, this.organization)
      .subscribe((res) => {
        const accessToken = res.data.accessToken;
        this.cookieService.set("access_token", accessToken);
        this.loginService.setAccessToken(accessToken);
        this.router.navigate(["/home"]);
      });
  }

  ngOnInit(): void {}
}
