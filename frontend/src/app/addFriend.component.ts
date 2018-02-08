import {Component} from "@angular/core";
import {AuthService} from "./auth.service";

@Component({

  selector: 'addFriend',
  templateUrl: "./addFriend.component.html",
})


export class AddFriendComponent{
  emailAdd;
  result={
    firstName :null,
    lastName : null,
    email : null
  };

  constructor(private  auth :AuthService){
    this.result.firstName = null;
    this.result.lastName = null;
    this.result.email = null;


  }
  searchFriend(emailAdd){
    console.log(emailAdd);
    this.auth.searchUser(emailAdd).subscribe(res=>{
      if(res){
        console.log(res);

        this.result = res;
      }else{
        this.result=null;
      }
    })
  }

  sendRequest(email){
    this.auth.sendFriendRequest(email);
  }
}
