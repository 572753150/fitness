import {Component} from "@angular/core";
import {AuthService} from "./auth.service";

@Component({

  selector: 'rank',
  templateUrl: "./rank.component.html",
})


export class RankComponent{

  users =[

  ];



  constructor(private  auth :AuthService){
    auth.getFriends().subscribe(res =>{
      res.push(auth.email);
      if(res.length&& res.length!=0){
        res.forEach(friendId=>{

          console.log(friendId);
          auth.getFriend(friendId).subscribe(res=>{
            this.users.push(res)
          })
        })
      }
    })
  }



  orderBy(attribute){
    this.users.sort(function (a, b) {
      return b[attribute] - a[attribute] ;
    })
    console.log(this.users);
  }






}
