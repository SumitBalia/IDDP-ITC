import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { appMode } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'shop';

  constructor(private user: UserService){}

  ngOnInit() {
    if(appMode.includes('DEBUG')){
      this.user.logInfo(JSON.stringify("App Init")).subscribe(res => { });
    }
    this.example();
  }
  
}
