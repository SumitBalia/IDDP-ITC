import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { User } from "../../models/User";
import { UserService } from "../../services/user.service";
import { Router } from "@angular/router";
import { appMode } from '../../../environments/environment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  user: User;

  constructor(private location: Location,
    private userService: UserService,
    private router: Router) {
    if (appMode.includes('DEBUG')) {
      this.userService.logInfo("Signup init start").subscribe(res => { });
    }

    this.user = new User();

    if (appMode.includes('DEBUG')) {
      this.userService.logInfo("Signup init end").subscribe(res => { });
    }
  }



  ngOnInit() {


  }
  onSubmit() {
    if (appMode.includes('DEBUG')) {
      this.userService.logInfo("Signup onSubmit() start").subscribe(res => { });
    }
    this.userService.signUp(this.user).subscribe(u => {
      this.router.navigate(['/login']);
    },
      e => { });

    if (appMode.includes('INFO')) {
      this.userService.logInfo("Signup user: " + JSON.stringify(this.user)).subscribe(res => { });
    }
    if (appMode.includes('DEBUG')) {
      this.userService.logInfo("Signup onSubmit() end").subscribe(res => { });
    }
  }

}
