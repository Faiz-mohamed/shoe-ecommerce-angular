import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/core/models/product.model';
import { CartService } from 'src/app/core/services/cart.service';
import { ProductService } from 'src/app/core/services/product.service';
import { SearchService } from 'src/app/core/services/search.service';

@Component({
  selector: 'product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit{

  ProductService :ProductService = inject(ProductService)
  router :Router = inject(Router)
  cartService :CartService = inject(CartService)
  searchService : SearchService = inject(SearchService)
  activatedRoute : ActivatedRoute = inject(ActivatedRoute)
  toastr :ToastrService = inject(ToastrService)

  products :Product[] = this.ProductService.getProducts()
  // filteredProducts = [...this.products]

  itemsPerPage :number = 8;
  page :number = 1;

  categories = ['All', 'Men', 'Women', 'Kids', 'Sports'];
  activeCategory = signal<string>('All');
  
  ngOnInit(){
    this.activatedRoute.queryParams.subscribe((params)=>{
      if(params['category']){
        this.activeCategory.set(params['category'])
      }
    })
  }

  getActiveCategory(category :string){
    this.activeCategory.set(category) 
  }


  filteredProducts = computed<Product[]>(() =>
    this.ProductService.filterProductByCategorySearch(this.activeCategory() , this.searchService.searchText())
  )


  onProductClick(id :number){
    this.router.navigate(['shop/product-detail', id])
  }

onAddToCartClicked(event: Event, product: Product) {
  event.stopPropagation();

  if (this.cartService.isProductInCart(product)) {

    this.toastr.clear()

    setTimeout(() => {
      this.toastr.warning(
      "This item is already in your cart",
      '',
      {
        timeOut: 3650,
        positionClass: 'toast-bottom-center',
        progressBar: true,
        progressAnimation: 'increasing',
        newestOnTop: true,   // keep newest on top
        closeButton: true,
        tapToDismiss: true,
        disableTimeOut: false,
        easeTime: 300
      }
    );
    }, 301);
    
  } else {
    this.cartService.addTocart(product);  // add first

    this.toastr.clear()


    setTimeout(()=>{
      this.toastr.success(
      `has been added to your cart`,
      `${product.name}`,
      {
        timeOut: 3650,
        positionClass: 'toast-bottom-center',
        progressBar: true,
        progressAnimation: 'increasing',
        newestOnTop: true,  // consistent with warning
        closeButton: true,
        tapToDismiss: true,
        disableTimeOut: false,
        easeTime: 300,
        enableHtml: true    // if you want HTML for buttons later
      }
    );
    },301)
    
  }
}

}

