import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';


import { AdminRoutingModule } from './admin-routing.module';
import { AdminProdPageComponent } from './admin-prod-page/admin-prod-page.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { RouterModule } from '@angular/router';
import { AdminPageComponent } from './admin-page/admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AdminPageComponent,
    AdminProdPageComponent,
    AdminOrdersComponent,
    AdminUsersComponent,
    AdminSettingsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AdminRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule  
  ]
})
export class AdminModule { }
