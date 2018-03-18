import { BibtexPaperLoaderService } from '../services/bibtex-paper-loader.service';
import { MscLookupService } from '../services/msc-lookup.service';
import { Paper } from '../objects/paper';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/observable/of';

export class IndexPapersByClass {

  /**
   * Distinct MSC descriptions that were actually used,
   * in sorted order.
   */
  private sortedMscDescs: ReadonlySet<string>;

  /**
   * Mapping of MSC descriptions to papers
   */
  private mscDescToPapersMap: ReadonlyMap<string, ReadonlySet<Paper>>;

  /**
   * Mark when ready for consumption
   */
  private ready: BehaviorSubject<boolean>;

  /**
   * Build utility class which will take papers from the given BibtexPaperLoaderService,
   * look up their MSC codes, and index them by their MSC codes.
   *
   * @param {MscLookupService} mscLookupService
   * @param {BibtexPaperLoaderService} paperLoaderService
   */
  constructor (private mscLookupService: MscLookupService,
       private paperLoaderService: BibtexPaperLoaderService) {

    // Not ready for consumption yet
    this.ready = new BehaviorSubject<boolean>(false);

    // Sorted MSC descriptions, initially empty.
    this.sortedMscDescs = new Set<string>();

    // MSC descriptions to papers, initially empty.
    this.mscDescToPapersMap = new Map<string, ReadonlySet<Paper>>();

    // Iterate through papers, when both services are ready.
    this.mscLookupService.isReady().subscribe( (mscLookupServiceReady: boolean) => {

      // Wait til ready!
      if (!mscLookupServiceReady) {
        return;
      }

      this.paperLoaderService.loadPapers().subscribe(
        (papers: Array<Paper>) => {

          const mapData = new Map<string, Set<Paper>>();

          // For each paper...
          papers.forEach(paper => {

            // Look at each mrclass code, add the code as a key
            // and add the paper as a value in that code's set.
            if (paper.mrclass === null) {
              return;
            }

            paper.mrclass.forEach(code => {

              // Get the code description. If there isn't one,
              // we won't index this paper by it.
              const codeDesc = mscLookupService.get(code);
              if (!codeDesc) {
                return;
              }

              // We have a code description. Index the paper.
              if (!mapData.has(codeDesc)) {
                mapData.set(codeDesc, new Set<Paper>());
              }
              mapData.get(codeDesc).add(paper);
            });

          });

          // Save it all.
          this.sortedMscDescs = new Set<string>(
            Array.from(mapData.keys()).sort()
          );
          this.mscDescToPapersMap = mapData;
          this.ready.next(true);
        }
      );

    });
  }

  /**
   * Return whether ready for consumption.
   */
  public isReady(): Observable<boolean> {
    return this.ready.asObservable();
  }

  /**
   * Get the map keys in sorted order. This will only return data if the MscLookupService is ready.
   */
  public getSortedDescriptions(): ReadonlySet<string> {
    return this.sortedMscDescs;
  }

  /**
   * Get the papers for a given description. This will only return data if the MscLookupService
   * is ready.
   */
  public getPapersForDescription(description: string): ReadonlySet<Paper> {
    return this.mscDescToPapersMap.get(description);
  }

}
