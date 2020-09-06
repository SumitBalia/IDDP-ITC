import { Component, OnInit } from '@angular/core';
import { UserService } from "../../services/user.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Role } from "../../enum/Role";
import { appMode } from '../../../environments/environment';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    isInvalid: boolean;
    isLogout: boolean;
    submitted = false;
    model: any = {
        username: '',
        password: '',
        remembered: false
    };

    returnUrl = '/';

    constructor(private userService: UserService,
        private router: Router,
        private route: ActivatedRoute) {
    }

    ngOnInit() {
        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Login component init start").subscribe(res => { });
        }
        let params = this.route.snapshot.queryParamMap;
        this.isLogout = params.has('logout');
        this.returnUrl = params.get('returnUrl');
        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Login component init end").subscribe(res => { });
        }

    }

    onSubmit() {
        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Login component onSubmit() start").subscribe(res => { });
        }
        this.submitted = true;
        this.userService.login(this.model).subscribe(
            user => {
                if (user) {
                    if (user.role != Role.Customer) {

                        this.returnUrl = '/seller';
                    }
                    if (appMode.includes('INFO')) {
                        this.userService.logInfo("USER Login: "+JSON.stringify(user)).subscribe(res => { });
                    }
                    this.router.navigateByUrl(this.returnUrl);
                } else {
                    this.isLogout = false;
                    this.isInvalid = true;
                }

            }
        );
        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Login component onSubmit() end").subscribe(res => { });
        }
    }

    fillLoginFields(u, p) {
        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Login component fillLoginFields() start").subscribe(res => { });
        }
        this.model.username = u;
        this.model.password = p;
        this.onSubmit();
        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Login component fillLoginFields() end").subscribe(res => { });
        }
    }
}
