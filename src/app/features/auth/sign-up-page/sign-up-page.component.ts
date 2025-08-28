import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { user } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { passwordMatchvalidator } from 'src/app/core/validators/passwordMatchValidator';

@Component({
  selector: 'sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.scss']
})
export class SignUpPageComponent implements OnInit{

  auth : AuthService = inject(AuthService)
  
  signUpForm! :FormGroup;

  ngOnInit(){

    this.signUpForm = new FormGroup({
      firstName : new FormControl(null , Validators.required),
      lastName : new FormControl(null),
      email : new FormControl(null , [Validators.required , Validators.email]),
      phoneNumber : new FormControl(null , [Validators.minLength(10) , Validators.pattern("^[0-9]{10}$")]),
      password : new FormControl(null , Validators.required),
      confirmPassword : new FormControl(null , Validators.required)
    } , {validators : passwordMatchvalidator})
  }

  onSubmit(){

    const userData: user = {
      firstName: this.signUpForm.value.firstName,
      lastName: this.signUpForm.value.lastName || undefined,
      email: this.signUpForm.value.email,
      phoneNumber: this.signUpForm.value.phoneNumber || undefined,
      password: this.signUpForm.value.password,
      role: "user"
    };

    this.auth.signUp(userData)

  }

  canExit(){

    if(!this.signUpForm.dirty) return true;

    let haveVal = false;
    for( let key in this.signUpForm.value){
      if( this.signUpForm.value[key] !==null && this.signUpForm.value[key] !== '' ){
        haveVal = true
        break;
      }
    }

    if(this.signUpForm.dirty && haveVal && this.auth.getLoginStatus()){ 
      return true;
    }else if(this.signUpForm.dirty && haveVal){
      return false;
    }

    return true;

  }

}
