import { Component, OnInit } from '@angular/core';

import { AboutMeConfig } from './objects/about-me-config';
import { AboutMeConfigLoaderService } from './services/about-me-config-loader.service';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.css']
})
export class AboutMeComponent implements OnInit {

  /**
   * AboutMeConfig to be shown in the UI
   */
  public aboutMeConfig: AboutMeConfig;

  constructor(
    public aboutMeConfigLoaderService: AboutMeConfigLoaderService) { }

  ngOnInit() {

    // Load about-me configuration.
    this.aboutMeConfigLoaderService.load().subscribe(
      aboutMeConfig => {
        this.aboutMeConfig = aboutMeConfig;
      }
    );

  }

}
