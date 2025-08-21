import { Component , inject } from '@angular/core';
import { CartService } from 'src/app/core/services/cart.service';
import { cartItems } from 'src/app/core/models/cartItems.model';
import { Router } from '@angular/router';

@Component({
  selector: 'cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss']
})
export class CartPageComponent {
  cartService :CartService = inject(CartService);
  route :Router = inject(Router)

  cartProducts! :cartItems[];
  totalPrice! :number;
  cartItemsNumber! :number;
  // productQuantity! :number;
  // updatedQuantity! :any;

  ngOnInit(){
    this.cartService.cart.subscribe(cart => {
      this.cartProducts = cart;
      this.cartItemsNumber = cart.length;
      this.totalPrice = cart.reduce((total :number, item :cartItems) =>  {
    return total + (item.product.price * (item.quantity  ?? 1));
  }, 0);
    })
  }

  onProductClick(id :number){
    this.route.navigate(['shop/product-detail', id])
  }

  remove(id :number){
    this.cartService.removeFromCart(id);
  }

  decreaseQuantity(Id :number){
    const selectedP = this.cartProducts.find(i => i.product.id === Id);
    
    this.cartService.decreaseQuantity(Id)
  }

  increaseQuantity(Id :number){
    this.cartService.increaseQuantity(Id)
  }
}
