import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  searchText = signal<string>('')
  updateSearch(text :string){
    this.searchText.set(text.trim().toLowerCase())
  }
  constructor() { }
}
