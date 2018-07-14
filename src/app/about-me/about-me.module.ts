import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { MatCardModule, MatListModule } from '@angular/material';

import { AboutMeComponent } from './about-me.component';
import { AboutMeRoutingModule } from './about-me-routing.module';
import { AboutMeConfigLoaderService } from './services/about-me-config-loader.service';
import { AboutMeUrlConstantsService } from './services/about-me-url-constants.service';

@NgModule({
  imports: [
    AboutMeRoutingModule,
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatListModule
  ],
  declarations: [
    AboutMeComponent
  ],
  providers: [
    AboutMeConfigLoaderService,
    AboutMeUrlConstantsService
  ]
})
export class AboutMeModule { }
