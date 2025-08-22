import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { cartItems } from '../models/cartItems.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<cartItems[]>([])
  cart = this.cartSubject.asObservable();

  addTocart(product : Product){
    const currentCart = [...this.cartSubject.value];
    const checkCartItems = currentCart.find(item => item.product.id === product.id)

    if(checkCartItems){
      checkCartItems.quantity! = 1
    }else{
      currentCart.push({ product , quantity : 1})
    }

    this.cartSubject.next(currentCart)
  }

  isProductInCart( product :Product ) :boolean{
    const currentCart = [...this.cartSubject.value];
    const checkCartItems = currentCart.find(item => item.product.id === product.id)
    if(checkCartItems){
      return true
    }else{
      return false;
    }
  }

  removeFromCart(productId :number){
    const updatedCart = this.cartSubject.value.filter(item => item.product.id !== productId);
    this.cartSubject.next(updatedCart)
  }

  increaseQuantity(productId :number , quantity? :number | undefined | null){
    const currentCart = [...this.cartSubject.value];
    const checkCartItems = currentCart.find(item => item.product.id === productId)

    if(checkCartItems){
      if(!quantity){
        checkCartItems.quantity! += 1 ;
        this.cartSubject.next(currentCart)
      }else{
      checkCartItems.quantity = quantity;
      this.cartSubject.next(currentCart)
      }
    }
  }

  decreaseQuantity(productId :number , quantity? :number | undefined ){
    const currentCart = [...this.cartSubject.value];
    const checkCartItems = currentCart.find(item => item.product.id === productId)

    if(checkCartItems){
      if(!quantity){
        if(checkCartItems.quantity! > 1){
        checkCartItems.quantity! -= 1;
        this.cartSubject.next(currentCart)
      }
      }else{
        checkCartItems.quantity = quantity;
        this.cartSubject.next(currentCart)
      }
    }
  }

  

  // getCart(){
  //   return [...this.cartProducts]
  // }

  // getTotal(): number {
  //   return this.getCart().reduce((sum, p) => sum + p.price, 0);
  // }
  constructor() { }
}
