import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Route } from '@angular/router';

import { SiteUrlConstants } from '../utils/site-url-constants';

import 'rxjs/add/operator/map';

// This is a blueprint for parsing entries within the SITE_CONFIG.
// We expect to see the fields listed below, in a valid site configuration.
interface ISiteConfigEntry {
  readonly url: string;
  readonly component: string;
  readonly assets: string;
}

@Injectable()
export class RoutePrepService {

  /**
   * Routes that we have loaded
   */
  private routes: Route[];

  /**
   * Static function to determine the relative navigation URL for a route,
   * based on the string form specified.
   */
  static resolveRouteUrl(url_str: string): string {

    // Expect the route URL to begin with a slash, so that it's clear the user
    // intended a relative path within the website.
    if (!url_str.startsWith('/')) {
      return null;
    }

    // Strip all leading slashes off the route URL, since Angular's representation of the route
    // is not supposed to contain one.
    return url_str.replace(new RegExp('^\/+'), '');
  }

  /**
   * Static function to determine the component that should be loaded for a route,
   * based on the string form of its name. If it could not be resolved, return null.
   */
  static resolveRouteComponent(component_str: string): any {

    switch (component_str) {
      case 'Papers': {
        return 'app/papers/papers.module#PapersModule';
      }
    }

    return null;
  }

  /**
   * Static function to determine the assets directory that should be loaded for a route,
   * based on the string form of the assets directory specified.
   */
  static resolveRouteAssets(assets_str: string): string {

    // So far, there are no special validation rules for the assets folder - just return the string verbatim.
    // We are making this function look like the others for consistency.
    return assets_str;

  }

  /**
   * Static function to build an Angular route from a site config entry.
   *
   * @param i_sc_entry site config entry parsed from the SITE_CONFIG_FILE
   * @return a valid Angular route for the site config entry, if the entry was valid, else null
   */
  static buildRoute(i_sc_entry: ISiteConfigEntry): Route {

    // Check the entry for well-formedness - all of the expected fields should be present.
    if (!i_sc_entry.url || !i_sc_entry.component || !i_sc_entry.assets ) {
      return null;
    }

    // Resolve the route URL, fail if invalid.
    const route_url: string = RoutePrepService.resolveRouteUrl(i_sc_entry.url);
    if (route_url === null) {
      return null;
    }

    // Resolve the route component, fail if invalid.
    const route_component = RoutePrepService.resolveRouteComponent(i_sc_entry.component);
    if (route_component === null) {
      return null;
    }

    // Resolve the route assets folder, fail if invalid.
    const route_assets = RoutePrepService.resolveRouteAssets(i_sc_entry.assets);
    if (route_assets === null) {
      return null;
    }

    return {
      path: route_url,
      loadChildren: route_component,
      data: {
        assets: route_assets
      }
    };
  }

  /**
   * Asynchronously load the routes based on the entries in the SITE_CONFIG file.
   * @param {ISiteConfigEntry[]} i_sc_entries
   */
  private static loadRoutes(i_sc_entries: ISiteConfigEntry[]): Route[] {
    // Sanity check - we need an object
    if ((typeof i_sc_entries) !== 'object') {
      return [];
    }

    // Iterate each entry in the site config file
    const routes: Array<Route> = [];
    i_sc_entries.forEach((i_sc_entry: ISiteConfigEntry) => {

      const route: Route = RoutePrepService.buildRoute(i_sc_entry);

      // If the site config entry resolved to a null route, don't add it.
      if (route === null) {
        return;
      }

      routes.push(route);

    });

    // We have figured out all the (valid) routes on the site - game time!
    return routes;
  }

  /**
   * Prepare a service that will parse the site configuration.
   * @param {HttpClient} httpClient an HttpClient with which to retrieve
   * the static site configuration file
   */
  constructor(private httpClient: HttpClient) {
    // Nothing to do here, call load() if you are interested in data.
    this.routes = [];
  }

  /**
   * Load routes.
   */
  load(): Promise<Route[]> {
    return this.httpClient.request<ISiteConfigEntry[]>('GET', SiteUrlConstants.SITE_CONFIG)
      .map(data => RoutePrepService.loadRoutes(data))
      .toPromise()
      .then(
        (routes: Route[]) => {
          this.routes = routes;
          return routes;
        }
      );
  }

  /**
   * Get routes.
   */
  getRoutes(): Route[] {
    return this.routes;
  }


}
