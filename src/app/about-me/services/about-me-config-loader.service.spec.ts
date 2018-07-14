import { TestBed, inject } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AboutMeConfigLoaderService } from './about-me-config-loader.service';
import { AboutMeUrlConstantsService } from './about-me-url-constants.service';
import {AboutMeConfig} from '../objects/about-me-config';

class AboutMeUrlConstantsServiceSpy {
  static readonly ABOUT_ME_CONFIG = 'about-me.json';

  getAboutMeConfigUrl = jasmine.createSpy(
    'getAboutMeConfigUrl').and.callFake(
    () => AboutMeUrlConstantsServiceSpy.ABOUT_ME_CONFIG);
}

describe('AboutMeConfigLoaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AboutMeConfigLoaderService,
        {provide: AboutMeUrlConstantsService, useClass: AboutMeUrlConstantsServiceSpy}
    ]});
  });

  it('should be created', inject([AboutMeConfigLoaderService], (service: AboutMeConfigLoaderService) => {
    expect(service).toBeTruthy();
  }));

  it('should return an error if data cannnot be loaded',
    inject([AboutMeConfigLoaderService, HttpTestingController],
      (service: AboutMeConfigLoaderService, httpMock: HttpTestingController) => {

        service.load().subscribe(
          data => {
            fail('Should not have gotten data: ' + data);
          },
          failure => {
            expect(failure.error.type).toBe('ABOUT_ME_LOAD_FAIL');
          }
        );

        const request = httpMock.expectOne(AboutMeUrlConstantsServiceSpy.ABOUT_ME_CONFIG);
        request.error(new ErrorEvent('ABOUT_ME_LOAD_FAIL'));
      }
    )
  );

  it('returns an empty object with empty input',
    inject([AboutMeConfigLoaderService, HttpTestingController],
      (service: AboutMeConfigLoaderService, httpMock: HttpTestingController) => {

        service.load().subscribe(
          config => {
            expect(config).toEqual(new AboutMeConfig());
          }
        );

        const request = httpMock.expectOne(AboutMeUrlConstantsServiceSpy.ABOUT_ME_CONFIG);
        request.flush('');
      }
    )
  );

  it('returns an empty object with poorly structured input',
  inject([AboutMeConfigLoaderService, HttpTestingController],
    (service: AboutMeConfigLoaderService, httpMock: HttpTestingController) => {

      service.load().subscribe(
        config => {
          expect(config).toEqual(new AboutMeConfig());
        }
      );

      const request = httpMock.expectOne(AboutMeUrlConstantsServiceSpy.ABOUT_ME_CONFIG);
      request.flush('bad input');
    }
  ));

  it('returns a valid object with all fields filled out, if all fields specified',
    inject([AboutMeConfigLoaderService, HttpTestingController],
      (service: AboutMeConfigLoaderService, httpMock: HttpTestingController) => {

      service.load().subscribe(
      config => {
          expect(config).toEqual(new AboutMeConfig('a', 'b', 'c', 'd', 'e', 'f', 'g'));
        }
      );

      const request = httpMock.expectOne(AboutMeUrlConstantsServiceSpy.ABOUT_ME_CONFIG);
      request.flush({
        'name': 'a',
        'aboutMeText': 'b',
        'resumeUrl': 'c',
        'pictureUrl': 'd',
        'emailAddress': 'e',
        'snailMailAddress': 'f',
        'phoneNumber': 'g'
      });
    }
  ));

  it('returns a valid object with undefined fields, if fields were omitted in the input',
    inject([AboutMeConfigLoaderService, HttpTestingController],
      (service: AboutMeConfigLoaderService, httpMock: HttpTestingController) => {

        service.load().subscribe(
          config => {
            expect(config).toEqual(new AboutMeConfig(undefined, 'a', undefined, 'b', undefined, 'c', undefined));
          }
        );

        const request = httpMock.expectOne(AboutMeUrlConstantsServiceSpy.ABOUT_ME_CONFIG);
        request.flush({
          'aboutMeText': 'a',
          'pictureUrl': 'b',
          'snailMailAddress': 'c'
      });
    }
  ));
});
