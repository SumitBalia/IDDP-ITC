import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CookieService } from 'ngx-cookie-service';
import { ProductInOrder } from '../../models/ProductInOrder';
import { ProductInfo } from '../../models/productInfo';
import { UserService } from "../../services/user.service";
import { appMode } from '../../../environments/environment';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  title: string;
  count: number;
  productInfo: ProductInfo;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    if (appMode.includes('DEBUG')) {
      this.userService.logInfo("Product Details init start").subscribe(res => { });
    }
    this.getProduct();
    this.title = 'Product Detail';
    this.count = 1;
    if (appMode.includes('DEBUG')) {
      this.userService.logInfo("Product Details init end").subscribe(res => { });
    }
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
  //   // Add '${implements OnChanges}' to the class.
  //   console.log(changes);
  //   if (this.item.quantity in changes) {

  //   }
  // }

  getProduct(): void {
    if (appMode.includes('DEBUG')) {
      this.userService.logInfo("Product Details getProduct() start").subscribe(res => { });
    }
    const id = this.route.snapshot.paramMap.get('id');
    this.productService.getDetail(id).subscribe(
      prod => {
        this.productInfo = prod;
      },
      _ => console.log('Get Cart Failed')
    );
    if (appMode.includes('INFO')) {
      this.userService.logInfo("Product Details: " + JSON.stringify(this.productInfo)).subscribe(res => { });
    }
    if (appMode.includes('DEBUG')) {
      this.userService.logInfo("Product Details getProduct() end").subscribe(res => { });
    }
  }

  addToCart() {
    if (appMode.includes('DEBUG')) {
      this.userService.logInfo("Product Details addToCart() start").subscribe(res => { });
    }
    this.cartService
      .addItem(new ProductInOrder(this.productInfo, this.count))
      .subscribe(
        res => {
          if (!res) {
            console.log('Add Cart failed' + res);
            throw new Error();
          }
          this.router.navigateByUrl('/cart');
        },
        _ => console.log('Add Cart Failed')
      );
    if (appMode.includes('DEBUG')) {
      this.userService.logInfo("Product Details addToCart() end").subscribe(res => { });
    }
  }

  validateCount() {
    console.log('Validate');
    const max = this.productInfo.productStock;
    if (this.count > max) {
      this.count = max;
    } else if (this.count < 1) {
      this.count = 1;
    }
  }
}
