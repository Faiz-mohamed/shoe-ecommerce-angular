import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutPageComponent } from './checkout-page/checkout-page.component';
import { OrderPlacedComponent } from './order-placed/order-placed.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CheckoutPageComponent,
    OrderPlacedComponent
  ],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    ReactiveFormsModule
  ],
  exports: []
})
export class CheckoutModule { }
