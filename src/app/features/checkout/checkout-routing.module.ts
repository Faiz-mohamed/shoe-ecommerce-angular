import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutPageComponent } from './checkout-page/checkout-page.component';
import { OrderPlacedComponent } from './order-placed/order-placed.component';
import { authGuard } from 'src/app/core/guards/auth.guard';
import { UnsavedChangesGuard } from 'src/app/core/guards/unsaved-changes.guard';

const routes: Routes = [
  {path: '', component: CheckoutPageComponent , canActivate : [authGuard] , canDeactivate : [UnsavedChangesGuard] },
  { path: 'orderplaced', component: OrderPlacedComponent , canActivate : [authGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutRoutingModule { }
