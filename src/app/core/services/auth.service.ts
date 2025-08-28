import { inject, Injectable } from '@angular/core';
import { user } from '../models/user.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private Users: user[] = [
    { "id":"U-1001" , "firstName": "Admin", "email": "admin@admin.com", "phoneNumber": "+91 9876543210", "password": "admin", "role": "admin" },
    { "id":"U-1002" , "firstName": "Arjun", "lastName": "Nair", "email": "arjun.nair@example.com", "phoneNumber": "+91 9876543210", "password": "Arjun@123", "role": "user" },
    { "id":"U-1003" , "firstName": "Sara", "lastName": "K", "email": "sara.k@example.com", "phoneNumber": "+91 9123456780", "password": "Sara#456", "role": "user" },
    { "id":"U-1004" , "firstName": "Faiz", "lastName": "mohamed", "email": "faiz@example.com", "phoneNumber": "+91 9012345678", "password": "Faiz123", "role": "user" },
    { "id":"U-1005" , "firstName": "Ananya", "lastName": "Reddy", "email": "ananya.reddy@example.com", "phoneNumber": "+91 9988776655", "password": "Ananya@2024", "role": "user" },
    { "id":"U-1006" , "firstName": "Vikram", "lastName": "Singh", "email": "vikram.singh@example.com", "phoneNumber": "+91 8899776655", "password": "Vikram*321", "role": "user" }
  ];

  private toastr: ToastrService = inject(ToastrService);
  router: Router = inject(Router);

  private ALL_USERS_KEY = 'allUsers';
  private USER_KEY = 'loggedInUser';
  private ADMIN_KEY = 'loggedInAdmin';

  loggedInUser: user | null =
    JSON.parse(sessionStorage.getItem(this.ADMIN_KEY) || 'null') ||
    JSON.parse(localStorage.getItem(this.USER_KEY) || 'null');

  isLoggedIn: boolean = !!this.loggedInUser;

  // =========================================================

  constructor() {
    // Ensure allUsers exists and load it into this.Users
    const stored = localStorage.getItem(this.ALL_USERS_KEY);
    if (!stored) {
      localStorage.setItem(this.ALL_USERS_KEY, JSON.stringify(this.Users));
    } else {
      // Load persisted users into the service array so login/signUp see latest users
      this.Users = JSON.parse(stored);
    }
  }

  getLoginStatus(): boolean {
    return this.isLoggedIn;
  }

  getLoggedInUser(): user | null {
    return this.loggedInUser;
  }

  getAllUsers(){
    if(this.getLoggedInUser()?.role === 'admin'){
    const storedUsers = localStorage.getItem(this.ALL_USERS_KEY);
    this.Users = storedUsers ? JSON.parse(storedUsers) : this.Users;
    return this.Users;    
    }else{return null};
  }

  logOut() {
    if (this.loggedInUser?.role === 'admin') {
      sessionStorage.removeItem(this.ADMIN_KEY);
    } else {
      localStorage.removeItem(this.USER_KEY);
    }

    this.loggedInUser = null;
    this.isLoggedIn = false;
    this.toastr.success('You have logged out.');
    this.router.navigate(['/auth/login']);
  }

  login(email: string, password: string) {
    const storedUsers = localStorage.getItem(this.ALL_USERS_KEY);
    this.Users = storedUsers ? JSON.parse(storedUsers) : this.Users;

    const userFound: user | undefined = this.Users.find(u => u.email === email);

    if (!userFound) {
      this.toastr.error('User does not Exist', 'Login Failed');
      console.log('Email does not exists'); // error
      this.isLoggedIn = false;
      return;
    }

    if (userFound.password !== password) {
      this.toastr.warning('Invalid Email or Password');
      console.log('incorrect password'); // error
      this.isLoggedIn = false;
      return;
    }

    this.loggedInUser = userFound;
    this.isLoggedIn = true;

    // Persist login based on role
    if (userFound.role === 'admin') {
      sessionStorage.setItem(this.ADMIN_KEY, JSON.stringify(userFound));
      this.toastr.success('Welcome Admin!');
      this.router.navigate(['/admin']);
    } else {
      localStorage.setItem(this.USER_KEY, JSON.stringify(userFound));
      this.toastr.success('', 'Login Successful');
      this.router.navigate(['/']);
    }
  }

  signUp(newUser: user) {
    // Load latest users and check
    const storedUsers = localStorage.getItem(this.ALL_USERS_KEY);
    this.Users = storedUsers ? JSON.parse(storedUsers) : this.Users;

    const checknewUser = this.Users.find(u => u.email === newUser.email);

    if (checknewUser) {
      this.isLoggedIn = false;
      this.toastr.error('User with this Email aldready exist', 'Login Failed');
      console.log('user aldready exists'); // error;
      return;
    }

    // push and persist all users
    this.Users.push(newUser);
    localStorage.setItem(this.ALL_USERS_KEY, JSON.stringify(this.Users));

    // set logged in and persist according to role (admin -> session)
    this.loggedInUser = newUser;
    this.isLoggedIn = true;

    if (newUser.role === 'admin') {
      sessionStorage.setItem(this.ADMIN_KEY, JSON.stringify(newUser));
    } else {
      localStorage.setItem(this.USER_KEY, JSON.stringify(newUser));
    }

    this.toastr.success('Account created successfully', 'Login Successful');
    this.router.navigate(['/']);
    console.log('user crted & logged in'); // success
  }
}
