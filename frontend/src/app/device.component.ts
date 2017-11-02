import {Component} from "@angular/core";
import {AuthService} from "./auth.service";
import {window} from "rxjs/operator/window";
import { DOCUMENT } from '@angular/platform-browser';
import {WindowService} from "./window.service";

@Component({

  selector: 'device',
  templateUrl: "./device.component.html",
})


export class DeviceComponent{
  kind: String;
  constructor(private  auth :AuthService,private window:WindowService){
      this.kind = "fitbit";
  }


  bindDevice(kind: String){


    switch (kind){
      case "fitbit":

        // this.window.createWindow("https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=228MXT&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fverify&scope=activity%20heartrate%20location%20profile%20settings%20sleep%20social%20weight&expires_in=604800")
        this.auth.getAuthFromFitbit();
        break;
      default:

        break;
    }
  }
}
