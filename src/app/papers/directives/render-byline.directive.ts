import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

import { AuthorDetail } from '../objects/author-detail';
import { AuthorDetailRegistryService } from '../services/author-detail-registry.service';
import { AuthorType } from '../enums/author-type.enum';
import { Paper } from '../objects/paper';

@Directive({
  selector: '[appRenderByline]',
})
export class RenderBylineDirective implements OnChanges {

  @Input() paper: Paper;

  constructor(private element: ElementRef,
      private authorDetailRegistryService: AuthorDetailRegistryService) {

  }

  ngOnChanges() {

    // Tokens that will be printed.
    const bylineTokens: Array<string> = [];

    // Append collaborators.
    if (this.appendCollaboratorLinks(bylineTokens)) {
      this.appendNewline(bylineTokens);
    }

    // Append journal and year.
    if (this.appendJournalAndYear(bylineTokens)) {
      this.appendNewline(bylineTokens);
    }

    // Write to the HTML.
    this.element.nativeElement.innerHTML = bylineTokens.join('');
  }

  /**
   * Append collaboratorLinks to the bylineTokens.
   */
  private appendCollaboratorLinks(bylineTokens: Array<string>): boolean {

    const collaboratorLinks: Array<string> = this.getCollaboratorLinks();

    // If there are any collaborators, write
    // 'Joint with: <comma-separated list of collaborators'.
    const haveCollaborators: boolean = (collaboratorLinks.length > 0);
    if (haveCollaborators) {
      bylineTokens.push('Joint with ');
      bylineTokens.push(collaboratorLinks.join(', '));
      bylineTokens.push('.');
    }

    return haveCollaborators;
  }

  /**
   * Infer the appropriate print style for an author who is missing an AuthorDetail with
   * an explicitly specified print style.
   *
   * Essentially, if it's in the format 'LAST, FIRST',
   * make it be 'FIRST LAST' - otherwise just leave it as is.
   */
  private inferPrintStyle(citeStyle: string): string {

    let retStr = citeStyle;
    retStr = citeStyle.replace(new RegExp('(.*),\s?(.*)', 'g'),
      (match: any, lastName: string, firstName: string) => {
          return firstName + ' ' + lastName;
        }
    );
    return retStr;
  }

  /**
   * Generates an array of links with collaborators' names, to their respective websites
   * @returns {Array<string>} links to collaborators
   */
  private getCollaboratorLinks(): Array<string> {

    // No paper, no work to do
    if (!this.paper.authors) {
      return [];
    }

    const collaboratorLinks: Array<string> = [];

    this.paper.authors.forEach((authorCiteStyle: string) => {

      // Try to find details about this author.
      const authorDetail: AuthorDetail
        = this.authorDetailRegistryService.getAuthorByCiteStyle(authorCiteStyle);

      // If the author is not known - err on the side of caution and show them.
      if (authorDetail == null) {
        collaboratorLinks.push(this.inferPrintStyle(authorCiteStyle));
        return;
      }

      // Skip this entry if the author is known, but is an owner.
      // We only want to show collaborators on the byline for each paper,
      // because the owner's involvement is implied, and constantly showing so
      // would be redundant.
      if (authorDetail.authorType === AuthorType.Owner) {
        return;
      }

      // Add the collaborator's print-style name, with a link to their website.
      collaboratorLinks.push(
        ''.concat(
          '<a href=\"', authorDetail.websiteUrl, '\">',
          authorDetail.printStyle, '</a>'
        )
      );
    });

    return collaboratorLinks;
  }

  /**
   * Append a newline to the bylineTokens.
   */
  private appendNewline(bylineTokens: Array<string>): boolean {
    bylineTokens.push('<br/>');
    return true;
  }

  /**
   * Append a journal and year to the bylineTokens.
   */
  private appendJournalAndYear(bylineTokens: Array<string>): boolean {

    // No paper, no work to do
    if (!this.paper) {
      return false;
    }

    let somethingAppended = false;

    // Append journal in italics if it exists.
    if (this.paper.journal) {
      bylineTokens.push(''.concat('<i>', this.paper.journal, '</i> '));
      somethingAppended = true;
    }

    // Append the year in parentheses if it exists.
    if (this.paper.year) {
      bylineTokens.push(''.concat('(', this.paper.year.toString(), ')'));
      somethingAppended = true;
    }

    return somethingAppended;
  }

}
