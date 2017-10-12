import {Component} from "@angular/core";
import {AuthService} from "./auth.service";

@Component({
  selector:"friends",
  templateUrl:"./friends.component.html"
})
export class FriendsComponent{
  users =[{name:'aa', email:'123@qq.com'},
    {name:'ds', email:'123@qq.com'},
    {name:'fasdds', email:'123@qq.com'},
    {name:'dfsfsd', email:'123@qq.com'},
    {name:'hjvjhvhj', email:'123@qq.com'},
    ];
  constructor(auth: AuthService){

  }
}
