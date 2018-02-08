import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "./auth.service";
import * as io from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: "./app.component.html",
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  constructor(public  auth :AuthService){
  }

  public ngOnInit(): void {
  }
}
