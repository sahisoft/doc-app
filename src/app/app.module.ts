import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule} from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material';

import { AppComponent } from './app.component';
import { RoutePrepService } from './site/services/route-prep.service';

export function RouteInitFactory(routePrepService: RoutePrepService) {
  return () => routePrepService.load();
}

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    MatToolbarModule,
    // initial route configuration for compilation to work correctly,
    // but can be overriden by the RoutePrepService!
    RouterModule.forRoot([
      {
        path: 'papers',
        loadChildren: 'app/papers/papers.module#PapersModule',
      }
    ]), // will be dynamically filled in
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    RoutePrepService,
    {
      provide: APP_INITIALIZER,
      useFactory: RouteInitFactory,
      deps: [RoutePrepService],
      multi: true
    }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
