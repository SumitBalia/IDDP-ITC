import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {OrderService} from "../../services/order.service";
import {Order} from "../../models/Order";
import {ActivatedRoute} from "@angular/router";
import { appMode } from '../../../environments/environment';
import {UserService} from "../../services/user.service";

@Component({
    selector: 'app-order-detail',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

    constructor(private orderService: OrderService,
                private route: ActivatedRoute,
                private userService: UserService) {
    }

    order$: Observable<Order>;

    ngOnInit() {
        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Order Details component init start").subscribe(res => { });
        }
        // this.items$ = this.route.paramMap.pipe(
        //     map(paramMap =>paramMap.get('id')),
        //     switchMap((id:string) => this.orderService.show(id))
        // )
        this.order$ = this.orderService.show(this.route.snapshot.paramMap.get('id'));
        if (appMode.includes('INFO')) {
            this.userService.logInfo("Order Details: "+JSON.stringify(this.order$)).subscribe(res => { });
        }
        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Order Details component init end").subscribe(res => { });
        }
    }

}
