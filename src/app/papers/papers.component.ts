import { Component, OnInit } from '@angular/core';

import { Paper } from './objects/paper';
import { BibtexPaperLoaderService } from './services/bibtex-paper-loader.service';
import { MscLookupService } from './services/msc-lookup.service';

@Component({
  selector: 'app-papers',
  templateUrl: './papers.component.html',
  styleUrls: ['./papers.component.css']
})
export class PapersComponent implements OnInit {

  /**
   * The papers that will be shown in the UI
   */
  papers: Array<Paper>;

  constructor(
      public paperLoaderService: BibtexPaperLoaderService,
      public mscLookupService: MscLookupService) { }

  ngOnInit() {
    // Load papers.
    this.paperLoaderService.loadPapers().subscribe(
      papers => {
        this.papers = papers;
      }
    );
  }

}
