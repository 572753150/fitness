import {Component} from "@angular/core";
import {AuthService} from "./auth.service";

@Component({
  selector:"friends",
  templateUrl:"./friends.component.html"
})
export class FriendsComponent{
  users =[

    ];
  constructor(private auth: AuthService){

    this.getAllFriends();

  }


  getAllFriends(){
    this.auth.getFriends().subscribe(res =>{
      if(res.length&& res.length!=0){
        res.forEach(friendId=>{

          console.log(friendId);
          this.auth.getFriend(friendId).subscribe(res=>{
            this.users.push(res)
          })
        })
      }
    })
  }

  deleteFriend(email){
    this.auth.deleteAFriend(email).subscribe(res=>{
      if(res.length&& res.length!=0){
        res.forEach(friendId=>{

          console.log(friendId);
          this.auth.getFriend(friendId).subscribe(res=>{
            this.users.push(res)
          })
        })
      }

    });
  }
}
