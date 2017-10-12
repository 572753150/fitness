import {Http} from "@angular/http";
import 'rxjs/add/operator/toPromise'
import 'rxjs/add/operator/map'
import  {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";


@Injectable()
export class WebService{
  BASE_URL= "https://localhost:1214/api";
  healthInfo={};

  constructor(private  http : Http,private auth :AuthService ){
    this.getHealthInfo();
  }
  async getHealthInfo(){
    try {
      var response = await this.http.get(this.BASE_URL+"/healthInfo").toPromise();
      this.healthInfo = response.json();
    }catch (error){
      this.handleError(error);
    }
  }

  async postTest(healthInfo){

    try {
      var response =  await this.http.post(this.BASE_URL+"/healthInfo",healthInfo).toPromise();
      this.healthInfo = response.json();
    }catch (error){
      this.handleError(error);
    }
  }

  getUser(){
    return this.http.get(this.BASE_URL+'/users/me',this.auth.tokenHeader).map(res=>res.json());
    // return this.http.get(this.BASE_URL+'/users/me',this.auth.tokenHeader);
  }



  private handleError(error){
    console.error(error);
  }
}
