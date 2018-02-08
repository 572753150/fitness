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
  PROVIDER_KEY = 'provider';
  exist = false;
  loginError = false;
  windowServices: WindowService;

  constructor(private  http: Http, private router: Router, private windowService: WindowService) {
    this.windowServices = this.windowService;
  }


  get firstName() {
    return localStorage.getItem(this.NAME_KEY);
  }


  getAvatar(){
    return this.http.get(this.BASE_URL + "/user/avatar", {withCredentials: true}).map(res => res.json());
  }

  get isAuthenticated() {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  get email() {
    return localStorage.getItem(this.EMAIL_KEY);
  }

  get provider() {
    return localStorage.getItem(this.PROVIDER_KEY);
  }

  get tokenHeader() {
    var header = new Headers({'Authorization': 'bear ' + localStorage.getItem(this.TOKEN_KEY)});
    return new RequestOptions({headers: header});
  }

  set provider(provider: string) {
    localStorage.setItem(this.PROVIDER_KEY, this.provider);
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
      localStorage.setItem(this.EMAIL_KEY, authResponse.email);//  yuan xian bushi   shi user.email
      alert("Confirm your email address by click the link!")
      this.router.navigate(['/'])
    });
  }


  sendFriendRequest(email) {
    if (!this.isAuthenticated) {
      this.router.navigate(['/']);
    }
    // alert("chu fa")
    return this.http.post(this.BASE_URL + "/request/email/" + email, {}, {withCredentials: true}).subscribe(res => res.json())
  }

  login(user) {
    this.http.post(this.BASE_URL + "/login", user, {withCredentials: true}).subscribe(res => {
        var authResponse = res.json();
        if (!authResponse.token) {
          this.loginError = true;
          return;
        }
        // console.log(res.headers.get("set-cookie"));
        localStorage.setItem(this.TOKEN_KEY, authResponse.token);
        localStorage.setItem(this.NAME_KEY, authResponse.firstName);
        localStorage.setItem(this.EMAIL_KEY, authResponse.email);
        localStorage.setItem(this.PROVIDER_KEY, authResponse.provider);
        this.router.navigate(['/home'])

      },
      err => {
        alert("Something went wrong! Check your password or ...")
      }
    );
  }


  updateAvater(avatar) {

    if (!this.isAuthenticated) {
      this.router.navigate(['/']);
    }

    return this.http.post(this.BASE_URL + "/user/avatar", avatar, {withCredentials: true}).map(res => res.json());
  }


  deleteMessage(uid) {
    if (!this.isAuthenticated) {
      this.router.navigate(['/']);
    }

    return this.http.delete(this.BASE_URL + "/request/" + uid, {withCredentials: true}).subscribe(res => res.json());
  }

  deleteAFriend(email) {
    if (!this.isAuthenticated) {
      this.router.navigate(['/']);
    }

    return this.http.delete(this.BASE_URL + "/friends/" + email, {withCredentials: true}).map(res => res.json());
  }

  addAFriend(email) {
    if (!this.isAuthenticated) {
      this.router.navigate(['/']);
    }

    return this.http.put(this.BASE_URL + "/friends/" + email, {}, {withCredentials: true}).subscribe(res => res.json());
  }

  getMessage() {
    if (!this.isAuthenticated) {
      this.router.navigate(['/']);
    }
    return this.http.get(this.BASE_URL + "/request", {withCredentials: true}).map(res => res.json());
  }

  getFriends() {
    if (!this.isAuthenticated) {
      this.router.navigate(['/']);
    }

    return this.http.get(this.BASE_URL + "/friends", {withCredentials: true}).map(res => res.json());
  }

  getFriend(friendId) {
    if (!this.isAuthenticated) {
      this.router.navigate(['/']);
    }

    return this.http.get(this.BASE_URL + "/friends/" + friendId, {withCredentials: true}).map(res => res.json());
  }

  searchUser(email) {
    if (!this.isAuthenticated) {
      this.router.navigate(['/']);
    }

    return this.http.get(this.BASE_URL + "/user/email/" + email, {withCredentials: true}).map(res => res.json());
  }

  getFitbitUserData() {
    if (!this.isAuthenticated) {
      this.router.navigate(['/']);
    }
    return this.http.get(this.BASE_URL + "/user/device/fitbit/data", {withCredentials: true}).map(res => res.json());
  }


  getJawboneUserDate(kind) {
    if (!this.isAuthenticated) {
      this.router.navigate(['/']);
    }
    return this.http.get(this.BASE_URL + "/user/device/jawbone/data/" + kind, {withCredentials: true}).map(res => res.json());
  }

  getFitbitFixedRangeOfData(start: String, end: String, kind: String) {
    if (!this.isAuthenticated) {
      this.router.navigate(['/']);
    }
    return this.http.get(this.BASE_URL + "/user/fitbit/data/" + start + "/" + end + "/" + kind, {withCredentials: true}).map(res => res.json());
  }


  getJawboneFixedRangeOfData(start: String, end: String, kind: String) {
    if (!this.isAuthenticated) {
      this.router.navigate(['/']);
    }
    return this.http.get(this.BASE_URL + "/user/jawbone/data/" + start + "/" + end + "/" + kind, {withCredentials: true}).map(res => res.json());
  }


  logout() {
    console.log("logout");
    localStorage.clear();
    this.http.get(this.BASE_URL + "/logout", {withCredentials: true}).subscribe(res => {
    })
  }


}
