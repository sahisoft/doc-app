import { NgModule } from '@angular/core';
import { BrowserModule} from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { PapersComponent } from './papers.component';
import { BibtexPaperLoaderService } from './services/bibtex-paper-loader.service';
import { MscLookupService } from './services/msc-lookup.service';
import { RenderTexDirective } from './directives/render-tex.directive';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule
  ],
  declarations: [
    PapersComponent,
    RenderTexDirective
  ],
  providers: [
    BibtexPaperLoaderService,
    MscLookupService
  ],
  exports: [
    PapersComponent
  ]
})
export class PapersModule { }
