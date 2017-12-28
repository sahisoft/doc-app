import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { PapersModule } from './papers/papers.module';
import { PapersComponent } from './papers/papers.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot([
      { path: 'papers', component: PapersComponent }
    ]),
    PapersModule,
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
