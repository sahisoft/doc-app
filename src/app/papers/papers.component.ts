import { Component, OnInit } from '@angular/core';

import { Paper } from './objects/paper';
import { AuthorDetailRegistryService } from './services/author-detail-registry.service';
import { BibtexPaperLoaderService } from './services/bibtex-paper-loader.service';
import { MscLookupService } from './services/msc-lookup.service';

import { IndexPapersByClass } from './utils/index-papers-by-class';
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
  public papers: Array<Paper>;

  /**
   * Utility to do MSC lookups
   */
  public tryMscLookup: TryMscLookup;

  /**
   * Utility to index papers by their respective classes
   */
  public indexPapersByClass: IndexPapersByClass;

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

    // Index papers by their class.
    this.indexPapersByClass = new IndexPapersByClass(
      this.mscLookupService, this.paperLoaderService
    );
  }

}
