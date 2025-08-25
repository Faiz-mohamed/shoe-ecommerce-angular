import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminProdPageComponent } from './admin-prod-page/admin-prod-page.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminPageComponent } from './admin-page/admin.component';

const routes: Routes = [
  { path : '' , component : AdminPageComponent,
    children : [
      { path : '' , redirectTo : 'dashboard' , pathMatch : 'full' },
      { path : 'dashboard' , component : AdminDashboardComponent },
      { path : 'products' , component : AdminProdPageComponent},
      { path : 'orders' , component : AdminOrdersComponent },
      { path : 'users' , component : AdminUsersComponent },
      { path : 'settings' , component : AdminSettingsComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
