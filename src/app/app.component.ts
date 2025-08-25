import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'shoe';

  router :Router = inject(Router)


  //=============================

  // Centralized route-listener to toggle the root scrollbar hide class
  // (adds/removes 'hide-page-scrollbar' on <html> and <body> when URL starts with /admin)
  private _routeSub: any = null;

  ngOnInit(): void {
    // handle initial URL (app might boot on an admin route)
    try {
      this._updateScrollbarForUrl(this.router.url);
    } catch (e) {
      // ignore if router.url isn't available for some reason
    }

    // subscribe to navigation events and react on NavigationEnd-like events
    this._routeSub = this.router.events.subscribe((ev: any) => {
      // ev.urlAfterRedirects exists on NavigationEnd; ev.url exists on some events too
      const url = ev && (ev.urlAfterRedirects ?? ev.url) ? (ev.urlAfterRedirects ?? ev.url) : null;
      if (url) {
        this._updateScrollbarForUrl(url);
      }
    });
  }

  ngOnDestroy(): void {
    if (this._routeSub && typeof this._routeSub.unsubscribe === 'function') {
      this._routeSub.unsubscribe();
    }
  }

  private _updateScrollbarForUrl(url: string) {
    // normalize
    const path = url.startsWith('/') ? url : '/' + url;
    const isAdminRoute = path.startsWith('/admin');

    if (isAdminRoute) {
      document.documentElement.classList.add('hide-page-scrollbar');
      document.body.classList.add('hide-page-scrollbar');
    } else {
      document.documentElement.classList.remove('hide-page-scrollbar');
      document.body.classList.remove('hide-page-scrollbar');
    }
  }
}
