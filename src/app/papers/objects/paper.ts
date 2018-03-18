export class Paper {

  /**
   * Id number for this paper
   */
  readonly id: number;

  /**
   * List of authors
   */
  readonly authors?: Array<string>;

  /**
   * Title of the article
   */
  readonly title?: string;

  /**
   * Year the paper was published
   */
  readonly year?: number;

  /**
   * Information about the journal in which this paper is published.
   */
  readonly journal?: string;

  /**
   * MRClass / MSC codes for this paper, in priority order (most to least)
   */
  readonly mrclass?: ReadonlyArray<string>;

  /**
   * URL at which the paper can be downloaded
   */
  readonly url?: string;

  /**
   * Abstract, if one is available.
   */
  readonly abstractText?: string;

  /**
   * Create a paper.
   *
   * @param id id for this paper
   * @param author list of authors, as an array
   * @param title the article title
   * @param year publication yearß
   * @param journal the journal in which the paper was published
   * @param mrclass list of MSC codes for this paper, in descending order of significance
   * @param url a URL at which the paper can be downloaded
   * @param abstractText a brief description or synopsis of the paper
   */
  constructor(id: number, author?: string[], title?: string, year?: number, journal?: string,
                mrclass?: Array<string>, url?: string, abstractText?: string) {
    this.id = id;
    this.authors = author;
    this.title = title;
    this.year = year;
    this.journal = journal;
    this.mrclass = mrclass;
    this.url = url;
    this.abstractText = abstractText;
  }
}
