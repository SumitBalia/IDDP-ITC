import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './user.service';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http'
import { from } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ErrorService implements ErrorHandler {
  name$;
  name: string;
  constructor(private injector: Injector, private user: UserService) { }

  async handleError(error) {
    console.log(error);
    let router = this.injector.get(Router);
    this.name$ = this.user.name$.subscribe(aName => this.name = aName);
    let comp = router.url.split('/')[1];
    let location;
    try {
      location = await this.user.getPosition();
    } catch (e) {
      location = "";
    }
    // let errorDetails = {
    //   "loggingLevel": error.type ? error.type : "error",
    //   "userName": this.name ? this.name : "-",
    //   "businessComponent": comp ? comp : "App",
    //   "browser": this.user.getBrowserDetails(),
    //   "location": location !== "" ? `lat: ${location['lat']}, lng: ${location['lng']}` : "",
    //   "message": error.message ? error.message : "message not available",
    //   "exceptionStack": error.stack ? error.stack : "stack not available"
    // };
    //let errorDetails = `loggingLevel: ${error.type ? error.type : "error"} | userName: ${this.name ? this.name : "-"} | businessComponent: ${comp ? comp : "App"} | browser: ${this.user.getBrowserDetails()} | location: ${location !== "" ? `lat: ${location['lat']}, lng: ${location['lng']}` : ""} | message: ${error.message ? error.message : "message not available"} | exceptionStack: ${error.stack ? error.stack : "stack not available"}`;
    let errorDetails = `${error.type ? error.type : "error"} | ${this.name ? this.name : "-"} | ${comp ? comp : "App"} | ${this.user.getBrowserDetails()} | ${location !== "" ? `${location['lat']}, ${location['lng']}` : ""} | ${error.message ? error.message : "message not available"} | ${error.stack ? error.stack : "stack not available"}`;

    this.user.logError(JSON.stringify(errorDetails)).subscribe(res => { });

  }
}