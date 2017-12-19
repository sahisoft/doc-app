import { Injectable } from '@angular/core';
import { parseBibFile, BibEntry } from 'bibtex';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Paper } from '../objects/paper';

@Injectable()
/**
 * Loads a bibtex file via HTTP request, and makes it available for consumption
 * as an array of Paper objects.
 */
export class BibtexPaperLoaderService {

  /**
   * Server-side location where the paper bibliography can be found.
   */
  static readonly PAPER_URL = '../../assets/papers.bib';

  /**
   * Parse the given string of data, expected to be in bib form,
   * and return an array of Paper objects.
   * @param {string} bibData
   */
  static parse(bibData: string): Array<Paper> {

    const papers: Array<Paper> = [];

    parseBibFile(bibData).entries_raw.forEach((bibEntry: BibEntry) => {

      // Extract fields that will be interested in.
      const authors: Array<string> = this.nullSafeSplit(
        this.extractStringField(bibEntry, 'author'), ' and ');
      const title: string          = this.extractStringField(bibEntry,  'title');
      const year: number           = this.extractNumericField(bibEntry, 'year');
      const journal: string        = this.extractStringField(bibEntry,  'fjournal')
        || this.extractStringField(bibEntry,  'journal');
      const mrclass: Array<string> = this.nullSafeSplit(
        this.nullSafeStrip(
          this.extractStringField(bibEntry, 'mrclass'), new RegExp('\\(|\\)', 'g'),
        ), ' '
      );
      const url: string            = this.extractStringField(bibEntry,  'url');
      const abstract: string       = this.extractStringField(bibEntry,  'abstract');

      // Make a paper!
      papers.push(new Paper(authors, title, year, journal, mrclass, url, abstract));
    });

    return papers;
  }

  /**
   * Extract a string field from the bibEntry.
   */
  static extractStringField(bibEntry: BibEntry, fieldName: string): string {
    const field = bibEntry.getFieldAsString(fieldName);
    return (field != null) ? field.toString() : null;
  }

  /**
   * Extract a numeric field from the bibEntry.
   */
  static extractNumericField(bibEntry: BibEntry, fieldName: string): number {
    const field = bibEntry.getFieldAsString(fieldName);

    // Sometimes, getFieldAsString() will return a string even when it is a number.
    if (field != null) {
      if (typeof field === 'string') {
        const numVal: number = Number.parseInt(<string>(field));
        if (!Number.isNaN(numVal)) {
          return numVal;
        }
      } else if (typeof field === 'number') {
        return <number>(field);
      }
    }
    // Otherwise - there is nothing - return null.
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
   */
  constructor(private httpClient: HttpClient) { }

  /**
   * Load the data from the given URL.
   * @return papers!
   */
  public loadPapers(): Observable<Array<Paper>> {
    return this.httpClient.request('GET', BibtexPaperLoaderService.PAPER_URL, {responseType: 'text'})
      .map(data => BibtexPaperLoaderService.parse(data));
  }
}
