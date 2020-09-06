import {Component, OnDestroy, OnInit} from '@angular/core';
// import {prod, products} from '../shared/mockData';
import {ProductService} from '../../services/product.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from "rxjs";
import { UserService } from '../../services/user.service';
import { appMode } from '../../../environments/environment';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit, OnDestroy {


  title: string;
  page: any;
  private paramSub: Subscription;
  private querySub: Subscription;


  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private user: UserService) {

  }


  ngOnInit() {
    if(appMode.includes('DEBUG')){
      this.user.logInfo("Card component init start").subscribe(res => { });
    }
    this.querySub = this.route.queryParams.subscribe(() => {
      this.update();
    });
    this.paramSub = this.route.params.subscribe(() => {
      this.update();
    });
    if(appMode.includes('DEBUG')){
      this.user.logInfo("Card component init End").subscribe(res => { });
    }

  }

  ngOnDestroy(): void {
    this.querySub.unsubscribe();
    this.paramSub.unsubscribe();
  }

  update() {
    if(appMode.includes('DEBUG')){
      this.user.logInfo("Card component update() start").subscribe(res => { });
    }
    if (this.route.snapshot.queryParamMap.get('page')) {
      const currentPage = +this.route.snapshot.queryParamMap.get('page');
      const size = +this.route.snapshot.queryParamMap.get('size');
      this.getProds(currentPage, size);
    } else {
      this.getProds();
    }
    if(appMode.includes('DEBUG')){
      this.user.logInfo("Card component update() end").subscribe(res => { });
    }
  }
  getProds(page: number = 1, size: number = 3) {
    if(appMode.includes('DEBUG')){
      this.user.logInfo("Card component getProds() start").subscribe(res => { });
    }
    if (this.route.snapshot.url.length == 1) {
      this.productService.getAllInPage(+page, +size)
        .subscribe(page => {
          this.page = page;
          this.title = 'Get Whatever You Want!';
        });
        if(appMode.includes('INFO')){
          this.user.logInfo("Page"+this.page).subscribe(res => { });
        }
    } else { //  /category/:id
      const type = this.route.snapshot.url[1].path;
      this.productService.getCategoryInPage(+type, page, size)
        .subscribe(categoryPage => {
          this.title = categoryPage.category;
          this.page = categoryPage.page;
        });

        if(appMode.includes('INFO')){
          this.user.logInfo("Category"+this.title).subscribe(res => { });
        }
    }
    if(appMode.includes('DEBUG')){
      this.user.logInfo("Card component getProds() end").subscribe(res => { });
    }

  }


}
