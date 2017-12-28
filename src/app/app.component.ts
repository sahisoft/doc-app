import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private router: Router ) { }

  ngOnInit() {
    this.setStartingLocation();
  }

  /**
   * Set the starting location for the site.
   */
  setStartingLocation() {
    // For now, navigate to /papers to show that the routing is working properly.
    // // There is nothing else interesting to show yet.
    this.router.navigate(['papers']);
  }

}
