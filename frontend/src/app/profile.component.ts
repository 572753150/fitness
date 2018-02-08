import {Component} from "@angular/core";
import {AuthService} from "./auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({

  selector: 'profile',
  templateUrl: "./profile.component.html",
})


export class ProfileComponent {
  user = {
    firstName: "",
    email: "",
    provider:""
  };


  form:FormGroup;
  loading: boolean = false;
  avatar;



  constructor(private  auth: AuthService,private fb: FormBuilder) {
    this.user.firstName = this.auth.firstName;
    this.user.email =this.auth.email;
    this.user.provider = this.auth.provider;
    this.createForm();
    this.auth.getAvatar().subscribe(res=>{
      if(res!=null){
        this.avatar="data:"+res.filetype+";base64,"+res.value;
      }
    })
  }


  createForm() {
    this.form = this.fb.group({
      avatar: null
    });
  }

  onFileChange(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.get('avatar').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.split(',')[1]
        })
      };
    }
  }


  onSubmit() {
    const formModel = this.form.value;
    this.loading = true;
    // this.http.post('apiUrl', formModel)
    console.log(formModel);

    this.auth.updateAvater(formModel).subscribe(res=>{



      this.avatar = "data:"+res.filetype+";base64,"+res.value;
      this.loading = false;
    })


  }


  clearFile() {
    this.form.get('avatar').setValue(null);
    // this.fileInput.nativeElement.value = '';
  }
}
