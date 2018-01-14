/**
 * This enum describes the types of authors recognized
 * on this website.
 */
export enum AuthorType {

  /**
   * An owner is an author who owns this website.
   */
  Owner,

  /**
   * A collaborator is an author who does not own this website,
   * but has worked with the author on papers.
   */
  Collaborator,

  /**
   * Unknown - we don't know what type of author this is
   */
  Unknown

}
