import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { UserService } from "../services/user.service";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {
  name$;
  name: string;

  constructor(private userService: UserService,
    private router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        // auto logout if 401 response returned from api
        this.userService.logout();
        this.router.navigate(['/login']);
      }

      // this.name$ = this.userService.name$.subscribe(aName => this.name = aName);
      // let comp = this.router.url.split('/')[1];
      // let location = "";

      // let errorDetails = `${err.type ? err.type : "error"} | ${this.name ? this.name : "-"} | ${comp ? comp : "App"} | ${this.userService.getBrowserDetails()} | ${location !== "" ? `${location['lat']},${location['lng']}` : ""} | ${err.message ? err.message : "message not available"} | ${err.stack ? err.stack : "stack not available"}`;

      // this.userService.logError(JSON.stringify(errorDetails)).subscribe(res => { });

      const error = err.error || err.statusText;
      return throwError(error);
    }))
  }
}
