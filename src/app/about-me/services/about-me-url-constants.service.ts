import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class AboutMeUrlConstantsService {

  /**
   * Server-side location where the about-me configuration can be found
   */
  static readonly FILENAME_ABOUT_ME_CONFIG = 'about-me.json';

  /**
   * Assets folder under which to find the file above
   */
  private readonly assetsDir: string;


  /**
   * Exposes data URL's needed by the about-me service,
   * relative to the specified assets folder.
   */
  constructor(private route: ActivatedRoute) {
    this.assetsDir = this.route.snapshot.firstChild.data['assets'];
  }

  /**
   * Return the about-me config URL.
   */
  public getAboutMeConfigUrl(): string {
    return this.assetsDir + '/' + AboutMeUrlConstantsService.FILENAME_ABOUT_ME_CONFIG;
  }

}
