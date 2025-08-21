import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  onAddToCartClicked(event :Event , product :Product){
    event.stopPropagation();
    this.cartService.addTocart(product)
  }
}
