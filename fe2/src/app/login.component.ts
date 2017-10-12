import { Component } from '@angular/core';
import {FormBuilder,Validators} from "@angular/forms";
import {AuthService} from "./auth.service";

@Component({
  selector: 'login',
  templateUrl: "./login.component.html",
  styles:[
    '.error{ background-color: #fcb1b0}'
  ]})
export class LoginComponent {

  form;
  constructor(private  fb: FormBuilder, private auth :AuthService){
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
