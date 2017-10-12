import { Component } from '@angular/core';
import {FormBuilder,Validators} from "@angular/forms";
import { AuthService } from "./auth.service";

@Component({
  selector: 'register',
  templateUrl: "./register.component.html",
  styles:[
    '.error{ background-color: #fcb1b0}'
  ]
})
export class RegisterComponent {
  form;
  constructor(private  fb: FormBuilder, private auth: AuthService ){
    this.form=fb.group({
      firstName:["",Validators.required],
      lastName:["",Validators.required],
      email:["",[Validators.required,emailValidate()]],
      password:["",Validators.required],
      confirmPassword:["",Validators.required],
      active:false,
    },{
      validator : matchingFields('password','confirmPassword')
    })
  }



  onSubmit(){
    console.log(this.form.value);
    this.auth.register(this.form.value );

  }

  isValid(control){
    return this.form.controls[control].invalid&& this.form.controls[control].touched;
  }
}

function matchingFields(f1,f2){
  return form=>{
    if (form.controls[f1].value!=form.controls[f2].value){
      return {mismatch : true};
    }
  }
}

function emailValidate(){
  return control =>{
    var regex=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return regex.test(control.value)? null:{invalidEmail: true};

  }
}
