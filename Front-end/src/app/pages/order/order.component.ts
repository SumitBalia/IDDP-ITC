import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {OrderService} from "../../services/order.service";
import {Order} from "../../models/Order";
import {OrderStatus} from "../../enum/OrderStatus";
import {UserService} from "../../services/user.service";
import {JwtResponse} from "../../response/JwtResponse";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Role} from "../../enum/Role";
import { appMode } from '../../../environments/environment';

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, OnDestroy {

    page: any;
    OrderStatus = OrderStatus;
    currentUser: JwtResponse;
    Role = Role;
    constructor(private httpClient: HttpClient,
                private orderService: OrderService,
                private userService: UserService,
                private route: ActivatedRoute
    ) {
    }

    querySub: Subscription;

    ngOnInit() {
        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Order component init start").subscribe(res => { });
        }
        this.currentUser = this.userService.currentUserValue;
        this.querySub = this.route.queryParams.subscribe(() => {
            this.update();
        });
        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Order component init end").subscribe(res => { });
        }

    }

    update() {
        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Order component update() start").subscribe(res => { });
        }
        let nextPage = 1;
        let size = 10;
        if (this.route.snapshot.queryParamMap.get('page')) {
            nextPage = +this.route.snapshot.queryParamMap.get('page');
            size = +this.route.snapshot.queryParamMap.get('size');
        }
        this.orderService.getPage(nextPage, size).subscribe(page => this.page = page, _ => {
            this.userService.logInfo("Get Orde Failed").subscribe(res => { });
        });
        if (appMode.includes('INFO')) {
            this.userService.logInfo("Order component Page: "+JSON.stringify(this.page)).subscribe(res => { });
        }
        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Order component update() end").subscribe(res => { });
        }
    }


    cancel(order: Order) {
        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Order component cancel() start").subscribe(res => { });
        }
        this.orderService.cancel(order.orderId).subscribe(res => {
            if (res) {
                order.orderStatus = res.orderStatus;
            }
        });
        if (appMode.includes('INFO')) {
            this.userService.logInfo("Order component cancel order ID: "+order.orderId).subscribe(res => { });
        }
        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Order component cancel() end").subscribe(res => { });
        }
    }

    finish(order: Order) {
        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Order component finish() start").subscribe(res => { });
        }
        this.orderService.finish(order.orderId).subscribe(res => {
            if (res) {
                order.orderStatus = res.orderStatus;
            }
        })
        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Order component finish() end").subscribe(res => { });
        }
    }

    ngOnDestroy(): void {
        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Order component ngOnDestroy() start").subscribe(res => { });
        }
        this.querySub.unsubscribe();
        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Order component ngOnDestroy() end").subscribe(res => { });
        }
    }

}
