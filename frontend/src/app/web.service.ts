import {Http} from "@angular/http";
import 'rxjs/add/operator/toPromise'
import 'rxjs/add/operator/map'
import  {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";


@Injectable()
export class WebService{
  BASE_URL= "https://localhost:3000/auth/user";
  defaultdata={};

  constructor(private  http : Http,private auth :AuthService ){
    this.getDefaultData();
  }
  async getDefaultData(){
    try {
      var response = await this.http.get(this.BASE_URL+"/data").toPromise();
      this.defaultdata = response.json();
    }catch (error){
      this.handleError(error);
    }
  }

  async postTest(healthInfo){
    try {
      var response =  await this.http.post(this.BASE_URL+"/defaultdata",healthInfo).toPromise();
      this.defaultdata = response.json();
    }catch (error){
      this.handleError(error);
    }
  }

  getUser(){
    return this.http.get(this.BASE_URL+'/users/me',this.auth.tokenHeader).map(res=>res.json());
    // TODO : Oreturn this.http.get(this.BASE_URL+'/users/me',this.auth.tokenHeader);
  }



  private handleError(error){
    console.error(error);
  }
}
