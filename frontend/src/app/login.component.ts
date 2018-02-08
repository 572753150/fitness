import { Component } from '@angular/core';
import {FormBuilder,Validators} from "@angular/forms";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
@Component({
  selector: 'login',
  templateUrl: "./login.component.html",
  styles:[
    '.error{ background-color: #fcb1b0}'
  ]})
export class LoginComponent {

  form;
  constructor(private  fb: FormBuilder, public auth :AuthService,private router:Router){

    if(this.auth.isAuthenticated){
      this.router.navigate(['/home']);
    }else{
      // this.router.navigate(['/home']);
    }

    this.form=fb.group({
      email:["",Validators.required],
      password:["",Validators.required]
    })
  }

  login(){
    console.log(this.form.value);
    this.auth.login(this.form.value);
  }

  isValid(control){
    return this.form.controls[control].invalid&& this.form.controls[control].touched;
  }


}


// export class LoginComponent {
//
//   constructor( private auth :AuthService,private window:WindowService ){
//   }
//
//
//   login(provider) {
//
//
//     switch (provider){
//       case "fitbit":
//         this.window.createWindow("http://localhost:3000/auth/fitbit");
//         break;
//       default:
//         this.window.createWindow("http://localhost:3000/auth/fitbit");
//         break;
//     }
//   }
//
//
// }
