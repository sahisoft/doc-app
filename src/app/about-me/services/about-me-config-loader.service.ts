import { Injectable } from '@angular/core';


import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { AboutMeConfig } from '../objects/about-me-config';
import { AboutMeUrlConstantsService } from './about-me-url-constants.service';

// This is a blueprint for parsing an AboutMeConfig entry.
// We expect to see the fields below.
interface IAboutMeConfig {
  readonly name: string;
  readonly aboutMeText: string;
  readonly resumeUrl: string;
  readonly pictureUrl: string;
  readonly emailAddress: string;
  readonly snailMailAddress: string;
  readonly phoneNumber: string;

}

@Injectable()
export class AboutMeConfigLoaderService {

  /**
   * Takes the config data loaded, expected to be in JSON form,
   * and returns it as an AboutMeConfig object.
   *
   * @param {string} configData configuration data in JSON form
   * @returns {AboutMeConfig} configuration data as an AboutMeConfig object
   */
  private static makeConfig(configData: IAboutMeConfig): AboutMeConfig {

    if (configData == null) {
      return new AboutMeConfig();
    }

    return new AboutMeConfig(
      configData.name,
      configData.aboutMeText,
      configData.resumeUrl,
      configData.pictureUrl,
      configData.emailAddress,
      configData.snailMailAddress,
      configData.phoneNumber
    );
  }

  /**
   * Prepare an AboutMeConfigLoader.
   *
   * @param {HttpClient} httpClient an HttpClient to use to make the request to load about-me constants
   * @param {AboutMeUrlConstantsService} aboutMeConstants service exposing data URL's for this about-me component
   */
  constructor(private httpClient: HttpClient,
      private aboutMeConstants: AboutMeUrlConstantsService) { }

  /**
   * Load about-me configuration from the configured URL.
   * @return about-me config!
   */
  public load(): Observable<AboutMeConfig> {
    return this.httpClient.request<IAboutMeConfig>(
      'GET', this.aboutMeConstants.getAboutMeConfigUrl())
      .map(data => AboutMeConfigLoaderService.makeConfig(data));
  }

}
