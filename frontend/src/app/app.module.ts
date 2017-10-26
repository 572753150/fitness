import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {WebService} from "./web.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {AuthService} from "./auth.service";
import {DatepickerModule} from 'ngx-date-picker';
import {ChartModule} from "angular-highcharts";

// import {MyOauthDirective} from "./oauth2.directive"
import {AppComponent} from './app.component';
import {IntroduceComponent} from "./introduce.component";
import {LoginComponent} from "./login.component";
import {RegisterComponent} from "./register.component";
import {NavigatorComponent} from "./navigator.component";
import {HomeComponent} from "./home.component";
import {ConfirmComponent} from "./confirm.component";
import {ProfileComponent} from "./profile.component";
import {RankComponent} from "./rank.component";
import {AddFriendComponent} from "./addFriend.component";
import {MessageComponent} from "./message.component";
import {DeviceComponent} from "./device.component";
import {FriendsComponent} from "./friends.component";
import {WindowService} from "./window.service";

var routes = [
  {
    path: '',
    component: IntroduceComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'confirm',
    component: ConfirmComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'rank',
    component: RankComponent
  },
  {
    path: 'addFriend',
    component: AddFriendComponent
  },
  {
    path: 'messages',
    component: MessageComponent,
  },
  {
    path: 'device',
    component: DeviceComponent,
  },
  {
    path: 'friend',
    component: FriendsComponent,
  }

];

@NgModule({
  declarations: [
    AppComponent,
    IntroduceComponent,
    LoginComponent,
    RegisterComponent,
    NavigatorComponent,
    HomeComponent,
    ConfirmComponent,
    ProfileComponent,
    RankComponent,
    AddFriendComponent,
    MessageComponent,
    DeviceComponent,
    FriendsComponent,
    // MyOauthDirective
  ],

  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    DatepickerModule,
    ChartModule,
  ],

  providers: [
    WebService,
    AuthService,
    WindowService,

  ],

  bootstrap: [
    AppComponent
  ]

})
export class AppModule {
}
