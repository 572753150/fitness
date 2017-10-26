import { Component,ViewChild } from '@angular/core';
import {AuthService} from "./auth.service";
import {Output} from "@angular/core/src/metadata/directives";
@Component({
  selector: 'app-root',
  templateUrl: "./app.component.html",
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private  auth :AuthService){

  }

  // @ViewChild(HealthInfoComponent) healthInfo:HealthInfoComponent;
  //
  // onPosted(healthInfo){
  //   this.healthInfo.healthInfo= healthInfo;
  // }
}
