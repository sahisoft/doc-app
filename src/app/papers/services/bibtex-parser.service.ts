import { Injectable } from '@angular/core';
import { parseBibFile, BibEntry } from 'bibtex';

import { Paper } from '../objects/paper';

@Injectable()
/**
 * Parses out a list of papers from a bibtex data string.
 */
export class BibtexParserService {

  constructor() { }


  /**
   * Parse the given string of data, expected to be in bib form,
   * and return an array of Paper objects.
   * @param {string} bibData
   */
  parse(bibData: string): Array<Paper> {

    const papers: Array<Paper> = new Array<Paper>();

    parseBibFile(bibData).entries_raw.forEach((bibEntry: BibEntry) => {

      // Extract fields that will be interested in.
      const authors: string[] = this.nullSafeSplit(
        this.extractStringField(bibEntry, 'author'), ' and ');
      const title: string     = this.extractStringField(bibEntry,  'title');
      const year: number      = this.extractNumericField(bibEntry, 'year');
      const journal: string   = this.extractStringField(bibEntry,  'fjournal')
                             || this.extractStringField(bibEntry,  'journal');
      const url: string       = this.extractStringField(bibEntry,  'url');
      const abstract: string  = this.extractStringField(bibEntry,  'abstract');

      // Make a paper!
      papers.push(new Paper(authors, title, year, journal, url, abstract));
    });

    return papers;
  }

  /**
   * Extract a string field from the bibEntry.
   */
  private extractStringField(bibEntry: BibEntry, fieldName: string): string {
    const field = bibEntry.getFieldAsString(fieldName);
    return (field != null) ? field.toString() : null;
  }

  /**
   * Extract a numeric field from the bibEntry.
   */
  private extractNumericField(bibEntry: BibEntry, fieldName: string): number {
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
   * Takes a potentially null input string, and splits it on the given delimiter.
   * If the input string is null, null is returned rather than crashing.
   */
  private nullSafeSplit(toSplit: string, delim: string): string[] {
    return (toSplit != null) ? toSplit.split(delim) : null;
  }

}
