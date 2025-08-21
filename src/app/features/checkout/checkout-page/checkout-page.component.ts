import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { cartItems } from 'src/app/core/models/cartItems.model';
import { CartService } from 'src/app/core/services/cart.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.scss']
})
export class CheckoutPageComponent implements OnInit{
  
  cartService :CartService = inject(CartService);
  router : Router = inject(Router);
  auth : AuthService = inject(AuthService)

  cartProducts! :cartItems[];
  totalPrice! :number;
  fullName: string = '';
  submitClicked :boolean = false;

  //===================================
  checkoutForm!: FormGroup;

  ngOnInit(){

    this.cartService.cart.subscribe(cart => {
      this.cartProducts = cart;
      this.totalPrice = cart.reduce((total :number, item :cartItems) =>  {
        return total + (item.product.price * (item.quantity  ?? 1));
      }, 0);
    });

    // Reactive form setup
    this.checkoutForm = new FormGroup({
      fullName: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phoneNumber: new FormControl(null, [Validators.required, Validators.pattern("^(?=(?:.*\\d){10,})[0-9 +\\-]+$")]),
      address: new FormControl(null, Validators.required),
      city: new FormControl(null),
      zip: new FormControl(null, Validators.required),
      country: new FormControl(null, Validators.required),
      paymentMethod: new FormControl(null, Validators.required)
    });

    const userdata = this.auth.getLoggedInUser()
    if(userdata){
      if(userdata.lastName){
        this.fullName = userdata.firstName+' '+userdata.lastName
      }else{
        this.fullName = userdata.firstName
      }
      this.checkoutForm.patchValue({
        fullName : this.fullName,
        email : userdata.email,
        phoneNumber : userdata.phoneNumber
      })
    }

  }

  onProductClick(productId :number){
    this.router.navigate(['shop/product-detail', productId]);
  }

  // Reactive form submit
  onSubmit(): void {
    if (this.checkoutForm.valid) {
      // this.checkoutService.placeOrder(this.checkoutForm.value);
      this.submitClicked = true;
      console.log('Order Data:', this.checkoutForm.value);
    }
  }

  // Helper for invalid input styling
  hasError(controlName: string, errorName: string) {
    const control = this.checkoutForm.get(controlName);
    return control && control.touched && control.hasError(errorName);
  }

  canExit(): boolean {
  if (!this.checkoutForm.dirty) return true;

  // List of controls to check for values
  const fieldsToCheck = ['address', 'city', 'zip', 'country', 'paymentMethod'];

  // Check if any of these fields have a value
  let hasValue = false;
  for (const key of fieldsToCheck) {
    const control = this.checkoutForm.get(key);
    if (control && control.value !== null && control.value !== '') {
      hasValue = true;
      break; 
    }
  }

  if (hasValue && this.submitClicked){
     return true;
    }else if(hasValue){
      return false;
    }

  return true;
}


}
