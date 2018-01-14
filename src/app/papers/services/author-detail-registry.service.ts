import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthorDetail } from '../objects/author-detail';

// This is a blueprint for parsing entries within the AUTHOR_REGISTRY_URL.
// We expect to see the fields listed below, in a valid author entry.
interface IAuthorDetail {
  readonly cite: string;
  readonly show: string;
  readonly type: string;
  readonly url: string;
}

@Injectable()
export class AuthorDetailRegistryService {

  /**
   * Server-side location where the list of collaborators and their homepages can be found.
   */
  static readonly AUTHOR_REGISTRY_URL = '../../assets/author-registry.json';

  /**
   * Author details
   */
  private authorDetails: ReadonlyArray<AuthorDetail>;

  /**
   * Citation name, to index of the AuthorDetail entry in the authorDetails map.
   * This can be used for fast lookups of an AuthorDetail,
   * knowing only its citeStyle.
   */
  private citeIndexMap: Map<String, number>;


  /**
   * Prepare an author registry lookup service.
   * @param {HttpClient} httpClient an HttpClient with which to lookup and parse the author registry
   */
  constructor(private httpClient: HttpClient) {

    this.httpClient.request<IAuthorDetail[]>('GET', AuthorDetailRegistryService.AUTHOR_REGISTRY_URL)
      .subscribe((i_author_details: IAuthorDetail[]) => {

        // We maybe in trouble if we aren't getting an object back.
        if ((typeof i_author_details) !== 'object') {
          this.initAsEmpty();
          return;
        }

        // Prepare citation index map.
        this.citeIndexMap = new Map<String, number>();

        // Scratch space to hold author details.
        const authorDetails: Array<AuthorDetail> = [];

        // Ensure that each author entry is well-defined.
        // If so, save it.
        i_author_details.forEach((i_author_detail: IAuthorDetail) => {

          // Ensure the object is well-formed - all of the fields should be present.
          if  (!i_author_detail.cite || !i_author_detail.show
            || !i_author_detail.type || !i_author_detail.url) {
            return;
          }

          // Make a full-fledged AuthorDetail object, using the contents of the interface.
          const author_detail: AuthorDetail = new AuthorDetail(
            i_author_detail.cite, i_author_detail.show, i_author_detail.type, i_author_detail.url
          );

          // Push it into the authorDetails array, save the index,
          // and set the citation index map accordingly.
          this.citeIndexMap[author_detail.citeStyle]
            = authorDetails.push(author_detail) - 1;
        });

        // authorDetails has been fully built up - save a read-only
        // copy of it.
        this.authorDetails = authorDetails;
      }
    );
  }

  /**
   * Bail out if bad data is received - make all data structures empty!
   */
  private initAsEmpty() {
      this.authorDetails = [];
      this.citeIndexMap = new Map<String, number>();
  }

  /**
   * Get the author details, in order to work with them.
   * Note that the author details are read-only.
   *
   * @return the author details
   */
  getAuthorDetails(): ReadonlyArray<AuthorDetail> {
    return this.authorDetails;
  }

  /**
   * Lookup an AuthorDetail, using their cite-style name.
   *
   * @param citeStyle the author's name in citation format
   * @return the corresponding AuthorDetail if found, else null
   */
  getAuthorByCiteStyle(citeStyle: string): AuthorDetail {
    const index: number = this.citeIndexMap[citeStyle];
    return (typeof index !== 'undefined') ? this.authorDetails[index] : null;
  }

}
