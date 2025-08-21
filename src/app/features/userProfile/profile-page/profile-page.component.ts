import { Component, inject, OnInit } from '@angular/core';
import { user } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit{
  auth : AuthService = inject(AuthService)

  user :user | null | undefined = null;
  
  ngOnInit(){
    this.user = this.auth.getLoggedInUser()
  }

  logOut(){
    this.auth.logOut()
  }
}
