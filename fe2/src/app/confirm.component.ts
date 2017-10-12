import { Component } from '@angular/core';
import {AuthService} from "./auth.service";
import {FormBuilder,Validators} from "@angular/forms";


@Component({
  selector: 'confirm',
  templateUrl: "./confirm.component.html",
  styles:[
    '.error{ background-color: #fcb1b0}'
  ]
})

export class ConfirmComponent{
  form;
  constructor(private  fb: FormBuilder, private auth: AuthService ){
    this.form=fb.group({
      email:localStorage.getItem("email"),
      passcode:["",Validators.required],
    })
  }


  login(){

  }

  isValid(control){
    return this.form.controls[control].invalid&& this.form.controls[control].touched;
  }

}
