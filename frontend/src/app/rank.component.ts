import {Component} from "@angular/core";
import {AuthService} from "./auth.service";

@Component({

  selector: 'rank',
  templateUrl: "./rank.component.html",
})


export class RankComponent{
  constructor(private  auth :AuthService){

  }
}
