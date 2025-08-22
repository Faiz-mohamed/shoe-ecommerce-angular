import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { HomeModule } from './features/home/home.module';
import { CoreModule } from './core/core.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotFoundPageComponent } from './features/not-found-page/not-found-page.component';




@NgModule({
  declarations: [
    AppComponent,
    NotFoundPageComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HomeModule,
    CoreModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
  positionClass: 'toast-top-right',    // top-right, top-left, bottom-left, bottom-right, toast-center
  timeOut: 3400,                       // how long toast stays (ms)
  closeButton: true,                   // adds close button
  progressBar: true,                   // shows progress bar
  preventDuplicates: true,             // prevents showing same toast again
  newestOnTop: true,                   // new toasts appear above old ones
  easeTime: 300,                       // animation speed
  enableHtml: true                     // allow HTML inside toast
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
