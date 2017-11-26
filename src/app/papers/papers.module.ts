import { NgModule } from '@angular/core';
import { BrowserModule} from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PapersComponent } from './papers.component';
import { BibtexParserService } from './services/bibtex-parser.service';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule
  ],
  declarations: [PapersComponent],
  providers: [BibtexParserService],
  bootstrap: [PapersComponent]
})
export class PapersModule { }
