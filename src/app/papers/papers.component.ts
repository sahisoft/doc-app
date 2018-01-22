import { Component, OnInit } from '@angular/core';

import { Paper } from './objects/paper';
import { AuthorDetailRegistryService } from './services/author-detail-registry.service';
import { BibtexPaperLoaderService } from './services/bibtex-paper-loader.service';
import { MscLookupService } from './services/msc-lookup.service';

import { TryMscLookup } from './utils/try-msc-lookup';

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

  public tryMscLookup: TryMscLookup;

  constructor(
      public authorDetailRegistryService: AuthorDetailRegistryService,
      public paperLoaderService: BibtexPaperLoaderService,
      public mscLookupService: MscLookupService) { }

  ngOnInit() {
    // Load papers.
    this.paperLoaderService.loadPapers().subscribe(
      papers => {
        this.papers = papers;
      }
    );

    // Set up callback to try MSC lookups.
    this.tryMscLookup = new TryMscLookup(this.mscLookupService);
  }

}
