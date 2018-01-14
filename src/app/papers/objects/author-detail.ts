import { AuthorType } from '../enums/author-type.enum';

/**
 * Represents details about an author, for public consumption.
 */
export class AuthorDetail {

  /**
   * The name to use to lookup this author for citations
   */
  readonly citeStyle: string;

  /**
   * The name to use to display this author
   */
  readonly printStyle: string;

  /**
   * The type of this author
   */
  readonly authorType: AuthorType;

  /**
   * URL of this author's website
   */
  readonly websiteUrl: string;

  /**
   * Takles a string, and tries to translate it to
   * the appropriate AuthorType enum. If the translation fails,
   * AuthorType.Unknown will be returned.
   *
   * @param {string} authorTypeStr string description of the author type
   * @returns {AuthorType} an AuthorType enum that matches the string
   */
  static translateAuthorType(authorTypeStr: string): AuthorType {

    let retVal: AuthorType = AuthorType.Unknown;

    // Attempt to do a fairly literal translation of the string
    // to the most appropriate matching enum.
    switch (authorTypeStr.toLowerCase()) {
      case 'owner': {
        retVal = AuthorType.Owner;
        break;
      }
      case 'collaborator': {
        retVal = AuthorType.Collaborator;
        break;
      }
      default: {
        break;
      }
    }

    return retVal;
  }

  /**
   * Build an author object with the
   * @param {string} citeStyle author's name in citation format
   * @param {string} printStyle author's name in printable format
   * @param {string} authorTypeStr type of author (expected to match something in AuthorType enum)
   * @param {string} websiteUrl a link to the author's website
   */
  constructor(citeStyle: string, printStyle: string, authorTypeStr: string, websiteUrl: string) {
    this.citeStyle  = citeStyle;
    this.printStyle = printStyle;
    this.authorType = AuthorDetail.translateAuthorType(authorTypeStr);
    this.websiteUrl = websiteUrl;
  }

}
