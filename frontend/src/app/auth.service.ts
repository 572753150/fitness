import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {Http, Headers, RequestOptions} from "@angular/http";
import {WindowService} from "./window.service";

@Injectable()
export class AuthService {
  BASE_URL = "http://localhost:3000/auth";
  NAME_KEY = "firstName";
  TOKEN_KEY = "token";
  EMAIL_KEY = "email";

  exist = false;
  loginError = false;
  windowServices:WindowService;
  constructor(private  http: Http, private router: Router,private windowService:WindowService) {
    this.windowServices = this.windowService;
  }


  get firstName() {
    return localStorage.getItem(this.NAME_KEY);
  }

  get isAuthenticated() {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  get tokenHeader() {
    var header = new Headers({'Authorization': 'bear ' + localStorage.getItem(this.TOKEN_KEY)});
    return new RequestOptions({headers: header});
  }

  register(user) {
    delete user.confirmPassword;
    this.http.post(this.BASE_URL + "/register", user).subscribe(res => {
      var authResponse = res.json();
      if (!authResponse.token) {
        this.exist = true;
        return;
      }
      localStorage.setItem(this.TOKEN_KEY, authResponse.token);
      localStorage.setItem(this.NAME_KEY, authResponse.firstName);
      localStorage.setItem(this.EMAIL_KEY, user.email);
      alert("Confirm your email address by click the link!")
      this.router.navigate(['/'])
    });
  }

  login(user) {
    this.http.post(this.BASE_URL + "/login", user).subscribe(res => {
      var authResponse = res.json();
      if (!authResponse.token) {
        this.loginError = true;
        return;
      }
      localStorage.setItem(this.TOKEN_KEY, authResponse.token);
      localStorage.setItem(this.NAME_KEY, authResponse.firstName);
      this.router.navigate(['/home'])

    });
  }


  logout() {
    console.log("logout");
    localStorage.clear();
  }

  getAuthFromFitbit() {
    this.http.get(this.BASE_URL + "/fitbit").subscribe(res => {
      console.log(res.json());
    });
  }


}
