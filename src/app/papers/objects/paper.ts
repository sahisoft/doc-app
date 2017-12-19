export class Paper {

  /**
   * List of authors
   */
  authors?: Array<string>;

  /**
   * Title of the article
   */
  title?: string;

  /**
   * Year the paper was published
   */
  year?: number;

  /**
   * Information about the journal in which this paper is published.
   */
  journal?: string;

  /**
   * MRClass / MSC codes for this paper, in priority order (most to least)
   */
  mrclass?: Array<string>;

  /**
   * URL at which the paper can be downloaded
   */
  url?: string;

  /**
   * Abstract, if one is available.
   */
  abstract?: string;

  /**
   * Create a paper.
   *
   * @param author list of authors, as an array
   * @param title the article title
   * @param year publication year
   * @param journal the journal in which the paper was published
   * @param mrclass list of MSC codes for this paper, in descending order of significance
   * @param url a URL at which the paper can be downloaded
   * @param abstract a brief description or synopsis of the paper
   */
  constructor(author?: string[], title?: string, year?: number, journal?: string,
                mrclass?: Array<string>, url?: string, abstract?: string) {
    this.authors = author;
    this.title = title;
    this.year = year;
    this.journal = journal;
    this.mrclass = mrclass;
    this.url = url;
    this.abstract = abstract;
  }
}
