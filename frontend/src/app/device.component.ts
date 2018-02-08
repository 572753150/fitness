import {Component} from "@angular/core";
import {AuthService} from "./auth.service";
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
        this.window.createWindow("http://localhost:3000/auth/fitbit" );
        break;

      case "jawbone":
        this.window.createWindow("http://localhost:3000/auth/jawbone" );
      default:

        break;
    }
  }
}
