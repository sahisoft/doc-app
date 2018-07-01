import { Component, OnInit } from '@angular/core';

import { Route, Router } from '@angular/router';
import { RoutePrepService } from './site/services/route-prep.service';

// Blue print for navigation items we will show.
interface IAppNavItem {

  readonly url: string;
  readonly title: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  /**
   * Page navigation items, which will be shown at the top.
   */
  public nav_items: IAppNavItem[] = [];

  constructor(public router: Router, private routePrepService: RoutePrepService) { }

  ngOnInit() {

    // Update route configuration based on what the route preparation
    // service told us to do.
    this.router.resetConfig(this.routePrepService.getRoutes());

    // Set navigation items on the page.
    this.setNavItems();
  }

  setNavItems() {
    const routes: Route[] = this.routePrepService.getRoutes();

    // Clear the current nav items (if there are any).
    this.nav_items = [];

    // Add new nav items, derived from the routes we want.
    routes.forEach(
      (route: Route) => {
        this.nav_items.push(
          {
            url: route.path,
            title: route.data.title
          }
        );
      }
    );
  }

}
