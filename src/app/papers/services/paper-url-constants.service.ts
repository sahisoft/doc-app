import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class PaperUrlConstantsService {

  /**
   * Server-side location where the list of collaborators and their homepages can be found.
   */
  static readonly FILENAME_AUTHOR_REGISTRY = 'author-registry.json';

  /**
   * Server-side location where the MSC 2010 database in tex form can be found.
   */
  static readonly FILENAME_MSC_REGISTRY = 'msc2010-final.txt';

  /**
   * Server-side location where the paper bibliography can be found.
   */
  static readonly FILENAME_PAPERS_BIB = 'papers.bib';

  /**
   * Assets folder under which to find the files above
   */
  private readonly assetsDir: string;

  /**
   * Exposes data URL's needed by papers services, relative to the specified assets folder.
   */
  constructor(private route: ActivatedRoute) {
    this.assetsDir = this.route.snapshot.firstChild.data['assets'];
  }

  /**
   * Return the author registry file.
   */
  public getAuthorRegistryUrl(): string {
    return this.assetsDir + '/' + PaperUrlConstantsService.FILENAME_AUTHOR_REGISTRY;
  }

  /**
   * Return the MSC registry file
   */
  public getMscRegistryUrl(): string {
    return this.assetsDir + '/' + PaperUrlConstantsService.FILENAME_MSC_REGISTRY;
  }

  /**
   * Return the papers BIB file.
   */
  public getPapersBibUrl(): string {
    return this.assetsDir + '/' + PaperUrlConstantsService.FILENAME_PAPERS_BIB;
  }


}
