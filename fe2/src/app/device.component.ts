import {Component} from "@angular/core";
import {AuthService} from "./auth.service";

@Component({

  selector: 'device',
  templateUrl: "./device.component.html",
})


export class DeviceComponent{
  kind: String;
  constructor(private  auth :AuthService){
      this.kind = "fitbit";
  }


  bindDevice(kind: String){
    console.log(kind);
    switch (kind){
      case "fitbit":
        console.log("aaaaaa")
        this.auth.getAuthFromFitbit();
        break;
      default:

        break;
    }
  }
}
