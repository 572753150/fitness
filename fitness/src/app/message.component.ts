import {Component} from "@angular/core";
import {AuthService} from "./auth.service";

@Component({
  selector:"messages",
  templateUrl:"./message.component.html"
})
export class MessageComponent{
  constructor(auth: AuthService){

  }
}
