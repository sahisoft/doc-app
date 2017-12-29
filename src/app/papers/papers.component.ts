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

  /**
   * Result of the last MSC lookup.
   */
  lastMscValSet: Set<string>;

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

    // Last lookup was null.
    this.lastMscValSet = new Set<string>();
  }

  /**
   * Try a lookup of multiple MSC codes against the mscLookupService.
   * The lookup will only be attempted if we appear to have a real MSC code.
   *
   * Will return whether the lookups were successful. If so, the results will be stored
   * in lastMscValSet for use in the template.
   */
  tryMscLookups(mscKeys: Array<string>): boolean {

    // Clear the results of the last lookup before we proceed.
    this.lastMscValSet.clear();

    // No MSC, no lookup.
    if (mscKeys == null) {
      return false;
    }

    // For each key...
    mscKeys.forEach(
      ((mscKey: string) => {
        // If it doesn't match expected pattern (5 characters, starting with two numbers) - don't do the lookup.
        if (!mscKey.match(new RegExp('^\\d{2}[\\S]{3}$'))) {
          return;
        }
        // If the MSC follows the pattern digit-digit-letter-digit-digit, replace the last two digits with 'xx'.
        // This means we are looking at a super-specific MSC, and its parent rollup code is actually more interesting
        // to show to the user. After attempting this replacement, then proceed with the actual lookup.
        const mscVal = this.mscLookupService.get(
          mscKey.replace(new RegExp('^(\\d{2}[A-Z])(\\d{2})$'), '$1xx'));

        // If we have a value, add it to the set. By using a set, we ensure that only distinct items will be shown.
        if (mscVal) {
          this.lastMscValSet.add(mscVal);
        }
      })
    );

    // Success is defined by whether there is at least one result to show.
    return this.lastMscValSet.size !== 0;
  }

}
