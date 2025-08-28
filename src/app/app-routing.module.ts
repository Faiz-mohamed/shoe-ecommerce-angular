import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home page/home.component';
import { NotFoundPageComponent } from './features/not-found-page/not-found-page.component';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '' , component: HomeComponent},

  {path: 'auth' ,
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
   },
  
  { path : 'cart' ,
    loadChildren: () => import('./features/cart/cart.module').then(m => m.CartModule)
  },

  { path : 'checkout' , 
    loadChildren: () => import('./features/checkout/checkout.module').then(m => m.CheckoutModule),
    canActivate : [authGuard]
  },

  { path: 'shop',
    loadChildren: () => import('./features/products/products.module').then(m => m.ProductsModule)
  },

  { path : 'userprofile',
    loadChildren: () => import('./features/userProfile/userprofile.module').then(m => m.UserprofileModule),
    canActivate : [authGuard]
  },

  { path : 'admin' ,
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
    canActivate : [authGuard]
  },

  { path : '**' , component : NotFoundPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled', // 👈 this makes route changes scroll to top
      anchorScrolling: 'enabled',           // 👈 this allows scrolling to #ids
      preloadingStrategy : PreloadAllModules
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
