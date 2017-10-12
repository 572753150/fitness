import {Component} from "@angular/core";
import {AuthService} from "./auth.service";

@Component({

  selector: 'addFriend',
  templateUrl: "./addFriend.component.html",
})


export class AddFriendComponent{
  constructor(private  auth :AuthService){
  }
}
