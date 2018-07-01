import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { RoutePrepService } from './site/services/route-prep.service';

@Component({
  selector: 'app-main',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(public router: Router, private routePrepService: RoutePrepService) { }

  ngOnInit() {

    // Update route configuration based on what the route preparation
    // service told us to do.
    this.router.resetConfig(this.routePrepService.getRoutes());
  }

}
