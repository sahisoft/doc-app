import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Paper } from './objects/paper';
import { BibtexParserService } from './services/bibtex-parser.service';

@Component({
  selector: 'app-papers',
  templateUrl: './papers.component.html',
  styleUrls: ['./papers.component.css']
})
export class PapersComponent implements OnInit {

  /**
   * The papers that will be shown in the UI
   */
  private papers: Array<Paper>;

  constructor(
      private httpClientService: HttpClient,
      private bibtexParserService: BibtexParserService) { }

  ngOnInit() {
    this.httpClientService.request('GET', '../../../assets/papers.bib', {responseType: 'text'} ).subscribe(
      data => {
        this.papers = this.bibtexParserService.parse(data);
      }
    );
  }

}
