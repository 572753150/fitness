import {Component} from "@angular/core";
import {AuthService} from "./auth.service";

@Component({

  selector: 'profile',
  templateUrl: "./profile.component.html",
})


export class ProfileComponent{
  constructor(private  auth :AuthService){

  }
}
