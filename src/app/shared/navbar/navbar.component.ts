import { Component, inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { CartService } from 'src/app/core/services/cart.service';
import { SearchService } from 'src/app/core/services/search.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
  cartService :CartService = inject(CartService)
  searchService :SearchService = inject(SearchService)
  router :Router = inject(Router);
  auth :AuthService = inject(AuthService)

  cartItemsNumber! :number;
  searchText! :string;
  LivesearchText! :string;

  ngOnInit(){
    this.cartService.cart.subscribe( cart => {
      this.cartItemsNumber = cart.length
    })
    console.log(this.router.url)
  }

  get isLoggedIn() :boolean{
    return this.auth.getLoginStatus()
  }

  get showSearchBar(): boolean {
    const url = this.router.url;
    return !(url === '/auth/login' || url === '/auth/signup' || url.startsWith('/admin'));
  }

  onSearchClick(form :NgForm){

    this.searchText = form.value.search;
    const currentUrl = this.router.url
    if(currentUrl.startsWith('/shop')){
      this.searchService.updateSearch(this.searchText)
      console.log(this.searchText)
    }
    else{
      if(this.searchText.trim().toLowerCase() !== '')
      this.router.navigate(['/shop'])
      this.searchService.updateSearch(this.searchText)
    }
  }

  onSearchInput(){
    if(this.LivesearchText.trim() === ''){
      this.searchService.updateSearch('')
    }
  }
}