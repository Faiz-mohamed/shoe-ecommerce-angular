import { inject, Injectable } from '@angular/core';
import { user } from '../models/user.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private Users :user[] = [
  {
    "firstName": "Arjun",
    "lastName": "Nair",
    "email": "arjun.nair@example.com",
    "phoneNumber": "+91 9876543210",
    "password": "Arjun@123"
  },
  {
    "firstName": "Sara",
    "lastName": "K",
    "email": "sara.k@example.com",
    "phoneNumber": "+91 9123456780",
    "password": "Sara#456"
  },
  {
    "firstName": "Faiz",
    "email": "faiz@example.com",
    "phoneNumber": "+91 9012345678",
    "password": "Faiz123"
  },
  {
    "firstName": "Ananya",
    "lastName": "Reddy",
    "email": "ananya.reddy@example.com",
    "phoneNumber": "+91 9988776655",
    "password": "Ananya@2024"
  },
  {
    "firstName": "Vikram",
    "lastName": "Singh",
    "email": "vikram.singh@example.com",
    "phoneNumber": "+91 8899776655",
    "password": "Vikram*321"
  }
]



  //=================================================================================================================//

  private toastr :ToastrService = inject(ToastrService)
  router : Router = inject(Router)

  isLoggedIn :boolean = false
  loggedInUser! : user | null;
  

  getLoginStatus() :boolean{
    return this.isLoggedIn;
  }

  getLoggedInUser():user | null{
    return this.loggedInUser;
  }

  logOut(){
    this.isLoggedIn = false;
    this.loggedInUser = null;
    this.toastr.success('You have logged out.')
    this.router.navigate(['/'])
  }

  login(email :string , password :string){
    const user :user | undefined = this.Users.find(u => u.email === email)

    if(!user){
      this.toastr.error('User does not Exist' , 'Login Failed')
      console.log('Email does not exists') //error
      this.isLoggedIn = false;
      this.getLoginStatus()
      return;
    }

    if(user?.password !== password){
      this.toastr.warning("Invalid Email or Password")
      console.log("incorrect password") // eror
      this.isLoggedIn = false;
      this.getLoginStatus()
      return;
    }

    this.loggedInUser = user
    console.log(user)
    this.isLoggedIn = true;
    this.toastr.success('' , 'Login Successful')
    this.router.navigate(['/'])
    console.log('user logged in') // success
    return this.loggedInUser = user

  }

  signUp(newUser :user){
    const checknewUser = this.Users.find( u => u.email === newUser.email);

    if(checknewUser){
      this.isLoggedIn = false;
      this.getLoginStatus();
      this.toastr.error('User with this Email aldready exist' , 'Login Failed')
      console.log('user aldready exists') //error;
      return;
    }

    this.Users.push(newUser);
    this.loggedInUser = newUser;
    this.isLoggedIn = true;
    this.getLoginStatus();
    this.toastr.success('Account created successfully','Login Successful')
    this.router.navigate(['/'])
    console.log('user crted & logged in') //succes
  }

  constructor() { }
}
