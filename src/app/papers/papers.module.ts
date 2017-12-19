import { NgModule } from '@angular/core';
import { BrowserModule} from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PapersComponent } from './papers.component';
import { BibtexPaperLoaderService } from './services/bibtex-paper-loader.service';
import {MscLookupService} from './services/msc-lookup.service';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule
  ],
  declarations: [PapersComponent],
  providers: [BibtexPaperLoaderService, MscLookupService],
  bootstrap: [PapersComponent]
})
export class PapersModule { }
