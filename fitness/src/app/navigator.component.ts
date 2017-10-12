import {Component} from "@angular/core";
import {AuthService} from "./auth.service";


@Component({
  selector: 'navigator',
  templateUrl: "./navigator.component.html",
})

export class NavigatorComponent{
  constructor(private  auth : AuthService){
  }

}
