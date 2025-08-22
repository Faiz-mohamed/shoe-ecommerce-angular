import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductPageComponent } from './product-page/product-page.component';
import { ProductDetailPageComponent } from './product-detail-page/product-detail-page.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ProductPageComponent,
    ProductDetailPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ProductsRoutingModule,
    NgxPaginationModule
  ],
  exports: []
})
export class ProductsModule { }
