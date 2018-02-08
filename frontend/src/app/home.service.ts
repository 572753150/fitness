import {Injectable} from "@angular/core";
import {Http} from "@angular/http";

@Injectable()
export class HomeService{
  constructor(private http:Http){

  }


  BASE_URL= "https://localhost:3000/auth/user";

   getDefaultData(){
      return this.http.get(this.BASE_URL+"/data",{withCredentials:true}).map(res=>res.json());
  }


}
