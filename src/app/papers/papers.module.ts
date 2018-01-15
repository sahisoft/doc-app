import { NgModule } from '@angular/core';
import { BrowserModule} from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { MatCardModule, MatListModule } from '@angular/material';

import { PapersComponent } from './papers.component';
import { AuthorDetailRegistryService } from './services/author-detail-registry.service';
import { BibtexPaperLoaderService } from './services/bibtex-paper-loader.service';
import { MscLookupService } from './services/msc-lookup.service';
import { RenderTexDirective } from './directives/render-tex.directive';
import { RenderBylineDirective } from './directives/render-byline.directive';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatListModule
  ],
  declarations: [
    PapersComponent,
    RenderTexDirective,
    RenderBylineDirective
  ],
  providers: [
    AuthorDetailRegistryService,
    BibtexPaperLoaderService,
    MscLookupService
  ],
  exports: [
    PapersComponent
  ]
})
export class PapersModule { }
