import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MscLookupService {

  /**
   * Server-side location where the MSC 2010 database in tex form can be found.
   */
  static readonly MSC_REGISTRY_URL = '../../assets/msc2010-final.txt';

  /**
   * Map of MSC code to its description.
   */
  private mscDescMap: Map<string, string>;

  /**
   * If a match contains both leading and trailing space, deduplicate by only returning
   * the trailing space. Otherwise, return no space at all.
   */
  static trimEdgeSpaces(match: any, leadingSpace: string, trailingSpace: string) {
    if (leadingSpace.length > 0 && trailingSpace.length > 0) {
      return trailingSpace;
    }
    return '';
  }

  /**
   * Remove extra details in a piece of text, that are present inside either
   * parentheses () or brackets [].
   */
  static stripExtraDetails(text: string): string {
    return text.replace(new RegExp(/( *)\([^)]*\)( *)/g), MscLookupService.trimEdgeSpaces)
               .replace(new RegExp(/( *)\[[^\]]*]( *)/g), MscLookupService.trimEdgeSpaces)
               .replace(new RegExp(/( *){[^}]*}( *)/g),   MscLookupService.trimEdgeSpaces);
  }

  /**
   * Prepare a MSC lookup service.
   * @param {HttpClient} httpClient an HttpClient with which to load data from the database
   */
  constructor(private httpClient: HttpClient) {

    this.mscDescMap = new Map<string, string>();

    this.httpClient.request('GET', MscLookupService.MSC_REGISTRY_URL, {responseType: 'text'})
      .map((result: string) => result
        .replace(new RegExp('\\\\[^\\n]*({[^}]*})', 'g'), '') // eliminate headers
        .split(new RegExp('[\\r?\\n]+'))) // split on each remaining line
        .subscribe((mappings: Array<string>) => {

          mappings.forEach((mapping: string) => {
            // First word in the line will be the key, and the remainder will be the value.
            // So split on the first whitespace. If the split doesn't result in two pieces,
            // skip the line as it is not a key-value pair.
            const tokens = mapping.match('^\\s*(\\S+)\\s+(.+)$');
            if (tokens == null) {
              return;
            }

            const key = tokens[1];
            const val = MscLookupService.stripExtraDetails(tokens[2]);

            this.mscDescMap.set(key, val);
          });
        }
      );
  }

  /**
   * Retrieve the value for a given MSC key.
   */
  public get(key: string): string {
    return this.mscDescMap.get(key);
  }

  /**
   * Return the number of key-value pairs held by the lookup service.
   */
  public count(): number {
    return this.mscDescMap.size;
  }

}
