import {Component} from "@angular/core";
import {AuthService} from "./auth.service";

@Component({
  selector:"messages",
  templateUrl:"./message.component.html"
})
export class MessageComponent{
  messages=[];
  constructor(private auth: AuthService){
      this.auth.getMessage().subscribe(res=>{
        this.messages = res;
      })
  }


  deleteMessage(uid){
    this.auth.deleteMessage(uid);
  }


  addFriend(email,uid){
    this.auth.addAFriend(email);
    this.deleteMessage(uid)
  }


}
