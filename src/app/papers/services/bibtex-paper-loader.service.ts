import { Injectable } from '@angular/core';
import * as bibtexParse from 'bibtex-parser-js';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Paper } from '../objects/paper';
import { PaperUrlConstantsService } from '../services/paper-url-constants.service';

@Injectable()
/**
 * Loads a bibtex file via HTTP request, and makes it available for consumption
 * as an array of Paper objects.
 */
export class BibtexPaperLoaderService {

  /**
   * Parse the given string of data, expected to be in bib form,
   * and return an array of Paper objects.
   * @param {string} bibData
   */
  static parse(bibData: string): Array<Paper> {

    const papers: Array<Paper> = [];

    let nextId = 0;

    bibtexParse.toJSON(bibData).forEach(entry => {

      // No point in proceeding with this entry if there are no entry tags to parse.
      if (!entry.hasOwnProperty('entryTags')) {
        return;
      }

      const tags = entry.entryTags;

      // Extract fields that we will be interested in.
      const authors: Array<string> = this.nullSafeSplit(
        this.takeString(tags, 'AUTHOR'), ' and '
      );
      const title: string          = this.takeString(tags, 'TITLE');
      const year: number           = this.takeNumber(tags, 'YEAR');
      const journal: string        = this.takeString(tags, 'FJOURNAL')
                                  || this.takeString(tags, 'JOURNAL');
      const mrclass: Array<string> = this.nullSafeSplit(
        this.nullSafeStrip(this.takeString(tags, 'MRCLASS'),
          new RegExp('\\(|\\)', 'g')),
        ' '
      );
      const url: string            = this.takeString(tags, 'URL');
      const abstractText: string   = this.takeString(tags, 'ABSTRACT');

      // Make a paper!
      papers.push(new Paper(++nextId,
        authors, title, year, journal, mrclass, url, abstractText));
    });

    return papers;
  }

  /**
   * Extract a string field from the entry.
   * If there is no such field, or it is not a string, return null.
   */
  static takeString(entry, fieldName: string): string {
    if (entry.hasOwnProperty(fieldName)) {
      const value = entry[fieldName];
      if (typeof value === 'string') {
        return value;
      }
    }

    return null;
  }

  /**
   * Extract a numeric field from the entry.
   * If there is no such field, or it is not a number, return null.
   */
  static takeNumber(entry, fieldName: string): number {

    if (entry.hasOwnProperty(fieldName)) {
      const value = entry[fieldName];
      if (typeof value === 'number') {
        return value;
      } else if (typeof value === 'string') {
        const numValue: number = Number.parseInt(value);
        if (!Number.isNaN(numValue)) {
          return numValue;
        }
      }
    }

    return null;
  }

  /**
   * Strip out undesired characters from a string.
   * Handles the fact that the string may be null.
   */
  static nullSafeStrip(toStrip: string, stripSet: string | RegExp): string {
    return (toStrip != null) ? toStrip.replace(stripSet, '') : null;
  }

  /**
   * Takes a potentially null input string, and splits it on the given delimiter.
   * If the input string is null, null is returned rather than crashing.
   */
  static nullSafeSplit(toSplit: string, delim: string | RegExp): Array<string> {
    return (toSplit != null) ? toSplit.split(delim) : null;
  }

  /**
   * Prepare a BibtexPaperLoader.
   * @param {HttpClient} httpClient an HttpClient to use to make the request to load paper data
   * @param {PaperUrlConstantsService} paperUrlConstants service exposing data URL's for this papers component
   */
  constructor(private httpClient: HttpClient,
    private paperUrlConstants: PaperUrlConstantsService) { }

  /**
   * Load the data from the given URL.
   * @return papers!
   */
  public loadPapers(): Observable<Array<Paper>> {
    return this.httpClient.request('GET', this.paperUrlConstants.getPapersBibUrl(), {responseType: 'text'})
      .map(data => BibtexPaperLoaderService.parse(data));
  }
}
