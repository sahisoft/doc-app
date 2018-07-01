import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PapersComponent } from './papers.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: PapersComponent
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class PapersRoutingModule { }
