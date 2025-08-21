import { Component, OnInit , inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/core/models/product.model';
import { CartService } from 'src/app/core/services/cart.service';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'product-detail-page',
  templateUrl: './product-detail-page.component.html',
  styleUrls: ['./product-detail-page.component.scss']
})
export class ProductDetailPageComponent  implements OnInit{
  product :any; 
  productQuantity! :number;
  updatedQuantity! :any;

  route :ActivatedRoute = inject(ActivatedRoute)
  productService : ProductService = inject(ProductService)
  cartService : CartService = inject(CartService)

  ngOnInit(){
    const id = Number(this.route.snapshot.paramMap.get('id'))
    this.product = this.productService.getProductById(id)
    this.cartService.cart.subscribe( cart => {
    this.updatedQuantity = cart.find(i => i.product.id === id)?.quantity
    })

    if(this.updatedQuantity){
      this.productQuantity = this.updatedQuantity
    }else{
      this.productQuantity = 1
    }
  }

  onAddToCartClicked(product :Product){
    this.cartService.addTocart(product);
    this.cartService.increaseQuantity(product.id , this.productQuantity)
  }

  increaseQuantity(Id :number){
    //this.cartService.increaseQuantity(Id)
    this.productQuantity += 1
  }

  decreaseQuantity(Id :number){
    //////// this.cartService.decreaseQuantity(Id)
    if(this.productQuantity > 1){
      this.productQuantity -= 1
    }
  }
}
