import { Component, inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {

  private auth :AuthService = inject(AuthService)
  toastr :ToastrService = inject(ToastrService)

  @ViewChild('login') loginForm! :NgForm;

  canExit():boolean{
    if(!this.loginForm.dirty) return true;

    let haveVal = false;
    for( let key in  this.loginForm.value ){
      if( this.loginForm.value[key] !==null && this.loginForm.value[key] !== ''){
        haveVal = true
        break;
      }
    }

    if(this.loginForm.dirty && haveVal && this.auth.getLoginStatus()){ 
      return true;
    }else if(this.loginForm.dirty && haveVal){
      return false;
    }

    return true;
  }

  OnSubmit(login :NgForm){
    this.auth.login( login.form.value.email , login.form.value.password )
    console.log(login.form.value.email)
    console.log(login.form.value.password)
  }
}
