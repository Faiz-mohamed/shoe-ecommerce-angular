import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { user } from '../models/user.model';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const url = state.url
  const user :user | null = auth.getLoggedInUser()

  if(url.startsWith('/admin')){
    if( user && user.role === 'admin'){
      return true;
    }else{
      toastr.error('Admin access only.');
      router.navigate(['/auth/login']);
      return false;
    }
  }
  else{


  if(auth.getLoginStatus()){
    return true;
  }else{
    router.navigate(['/auth/login']);
    toastr.info("Please log in to access this page.")
    return false;
  }
  }
}
