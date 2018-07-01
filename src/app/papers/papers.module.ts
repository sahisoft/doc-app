import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { MatCardModule, MatListModule } from '@angular/material';

import { PapersComponent } from './papers.component';
import { PapersRoutingModule } from './papers-routing.module';
import { PaperUrlConstantsService } from './services/paper-url-constants.service';
import { AuthorDetailRegistryService } from './services/author-detail-registry.service';
import { BibtexPaperLoaderService } from './services/bibtex-paper-loader.service';
import { MscLookupService } from './services/msc-lookup.service';
import { RenderTexDirective } from './directives/render-tex.directive';
import { RenderBylineDirective } from './directives/render-byline.directive';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatListModule,
    PapersRoutingModule
  ],
  declarations: [
    PapersComponent,
    RenderTexDirective,
    RenderBylineDirective
  ],
  providers: [
    AuthorDetailRegistryService,
    BibtexPaperLoaderService,
    PaperUrlConstantsService,
    MscLookupService
  ]
})
export class PapersModule { }
