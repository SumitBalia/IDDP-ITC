import { AfterContentChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Subject, Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { JwtResponse } from '../../response/JwtResponse';
import { ProductInOrder } from '../../models/ProductInOrder';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '../../enum/Role';
import { appMode } from '../../../environments/environment';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy, AfterContentChecked {

    constructor(private cartService: CartService,
        private userService: UserService,
        private router: Router) {
        this.userSubscription = this.userService.currentUser.subscribe(user => this.currentUser = user);
    }

    productInOrders = [];
    total = 0;
    currentUser: JwtResponse;
    userSubscription: Subscription;

    private updateTerms = new Subject<ProductInOrder>();
    sub: Subscription;

    static validateCount(productInOrder) {
        const max = productInOrder.productStock;
        if (productInOrder.count > max) {
            productInOrder.count = max;
        } else if (productInOrder.count < 1) {
            productInOrder.count = 1;
        }
        console.log(productInOrder.count);
    }

    ngOnInit() {
        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Cart component init start").subscribe(res => { });
        }
        this.cartService.getCart().subscribe(prods => {
            this.productInOrders = prods;
        });

        this.sub = this.updateTerms.pipe(
            // wait 300ms after each keystroke before considering the term
            debounceTime(300),
            //
            // ignore new term if same as previous term
            // Same Object Reference, not working here
            //  distinctUntilChanged((p: ProductInOrder, q: ProductInOrder) => p.count === q.count),
            //
            // switch to new search observable each time the term changes
            switchMap((productInOrder: ProductInOrder) => this.cartService.update(productInOrder))
        ).subscribe(prod => {
            if (prod) { throw new Error(); }
        },
            _ => this.userService.logInfo("Update Item Failed").subscribe(res => { }))

        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Cart component init start").subscribe(res => { });
        }
    }

    ngOnDestroy() {
        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Cart component ngOnDestroy start").subscribe(res => { });
        }
        if (!this.currentUser) {
            this.cartService.storeLocalCart();
        }
        this.userSubscription.unsubscribe();
        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Cart component ngOnDestroy end").subscribe(res => { });
        }
    }

    ngAfterContentChecked() {
        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Cart component ngAfterContentChecked start").subscribe(res => { });
        }
        this.total = this.productInOrders.reduce(
            (prev, cur) => prev + cur.count * cur.productPrice, 0);
        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Cart component ngAfterContentChecked end").subscribe(res => { });
        }
    }

    addOne(productInOrder) {
        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Cart component addOne() start").subscribe(res => { });
        }
        productInOrder.count++;
        CartComponent.validateCount(productInOrder);
        if (this.currentUser) { this.updateTerms.next(productInOrder); }
        if (appMode.includes('INFO')) {
            this.userService.logInfo("Product in order added" + JSON.stringify(productInOrder)).subscribe(res => { });
        }
        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Cart component addOne() end").subscribe(res => { });
        }
    }

    minusOne(productInOrder) {
        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Cart component minusOne() start").subscribe(res => { });
        }
        productInOrder.count--;
        CartComponent.validateCount(productInOrder);
        if (this.currentUser) { this.updateTerms.next(productInOrder); }
        if (appMode.includes('INFO')) {
            this.userService.logInfo("Product in order minus" + JSON.stringify(productInOrder)).subscribe(res => { });
        }
        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Cart component minusOne() end").subscribe(res => { });
        }
    }

    onChange(productInOrder) {
        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Cart component onChange() start").subscribe(res => { });
        }
        CartComponent.validateCount(productInOrder);
        if (this.currentUser) { this.updateTerms.next(productInOrder); }
        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Cart component onChange() end").subscribe(res => { });
        }
    }


    remove(productInOrder: ProductInOrder) {
        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Cart component remove() start").subscribe(res => { });
        }
        this.cartService.remove(productInOrder).subscribe(
            success => {
                this.productInOrders = this.productInOrders.filter(e => e.productId !== productInOrder.productId);
                console.log('Cart: ' + this.productInOrders);
            },
            _ => this.userService.logInfo("Remove Cart Failed").subscribe(res => { }))
        if (appMode.includes('INFO')) {
            this.userService.logInfo("Product in order removed" + JSON.stringify(productInOrder)).subscribe(res => { });
        }
        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Cart component remove() end").subscribe(res => { });
        }
    }

    checkout() {
        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Cart component checkout() start").subscribe(res => { });
        }
        if (!this.currentUser) {
            this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
        } else if (this.currentUser.role !== Role.Customer) {
            this.router.navigate(['/seller']);
        } else {
            this.cartService.checkout().subscribe(
                _ => {
                    this.productInOrders = [];
                },
                error1 => {
                    this.userService.logInfo("Checkout Cart Failed").subscribe(res => { })

                });
            this.router.navigate(['/']);
        }
        if(appMode.includes('INFO')){
            this.userService.logInfo("Checkout "+JSON.stringify(this.productInOrders)).subscribe(res => { });
        }

        if (appMode.includes('DEBUG')) {
            this.userService.logInfo("Cart component checkout() end").subscribe(res => { });
        }

    }
}

