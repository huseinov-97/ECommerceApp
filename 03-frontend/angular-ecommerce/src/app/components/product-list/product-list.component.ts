import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/common/cart-item';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  rangeMode: boolean;

  searchMode: boolean;
  products: Product[] = [];
  currentCategoryId: number;
  currentCategoryName: string;
  previousCategoryId: number;

  // new properties for pagination
  thePageNumber: number;
  thePageSize: number = 20;
  theTotalElements: number;

  previousKeyword: string = null;


  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {

    this.rangeMode = this.route.snapshot.paramMap.has('number');

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.rangeMode){
      this.handleRangeProducts();
    }

    if (this.searchMode){
      this.handleSearchProducts();
    }
    else{
    this.handleListProducts();
    }

  }

  handleRangeProducts(){
     }

  handleSearchProducts(){

    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');

    // if we have a diff keyword than previous then set thePageNumber to 1
    // tslint:disable-next-line: triple-equals
    if (this.previousKeyword != theKeyword){
      this.thePageNumber = 1;
    }
    this.previousKeyword = theKeyword;
    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);
    // now search for the products using keyword
    this.productService.searchProductsPaginate(this.thePageNumber - 1,
                                              this.thePageSize,
                                              theKeyword).subscribe(this.processResult());
  }

  handleListProducts(){
        // check if "id" parameter is available
        const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

        if (hasCategoryId) {
          // get the "id" param string. convert string to a number using the "+" symbol
          this.currentCategoryId = +this.route.snapshot.paramMap.get('id');

          // get the "name" param string
          this.currentCategoryName = this.route.snapshot.paramMap.get('name');
        }
        else {
          // not category id available ... default to category id 1
          this.currentCategoryId = 1;
          this.currentCategoryName = 'Books';
        }

        //
        // check if we have different category than previous


        // if we have different category id than previous then set pageNumber to 1
        // tslint:disable-next-line: triple-equals
        if (this.previousCategoryId != this.currentCategoryId){
          this.thePageNumber = 1;
        }
        this.previousCategoryId = this.currentCategoryId;

        console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

        //
        // now get the products for the given category id
        this.productService.getProductListPaginate(this.thePageNumber - 1,
                                                    this.thePageSize,
                                                    this.currentCategoryId)
                                                    .subscribe(this.processResult());
  }
  processResult(){
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }
  updatePageSize(pageSize: number){
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(theProduct: Product){
    console.log(`Add to Cart: ${theProduct.name}, ${theProduct.unitPrice}`);
    // TODO:
    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);
  }
}
