export class AboutMeConfig {

  /**
   * Text for the name section
   */
  readonly name?: string;

  /**
   * Text for the about me section
   */
  readonly aboutMeText?: string;

  /**
   * Link to resume
   */
  readonly resumeUrl?: string;

  /**
   * Path to a picture about you
   */
  readonly pictureUrl?: string;

  /**
   * E-mail address
   */
  readonly emailAddress?: string;

  /**
   * Contact snail mail address
   */
  readonly snailMailAddress?: string;

  /**
   * Contact phone number
   */
  readonly phoneNumber?: string;

  /**
   * Create an about me configuration.
   *
   * @param {string} name name to show
   * @param {string} aboutMeText text to go in the 'about me' section
   * @param {string} resumeUrl resume link to show
   * @param {string} pictureUrl picture URL to show
   * @param {string} emailAddress e-mail address to show
   * @param {string} snailMailAddress snail mail address to show
   * @param {string} phoneNumber phone number to show
   */
  constructor(name?: string, aboutMeText?: string, resumeUrl?: string, pictureUrl?: string,
               emailAddress?: string, snailMailAddress?: string, phoneNumber?: string) {

    this.name = name;
    this.aboutMeText = aboutMeText;
    this.resumeUrl = resumeUrl;
    this.pictureUrl = pictureUrl;
    this.emailAddress = emailAddress;
    this.snailMailAddress = snailMailAddress;
    this.phoneNumber = phoneNumber;
  }

}
