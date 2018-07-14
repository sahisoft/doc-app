import { TestBed, inject } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { AboutMeUrlConstantsService } from './about-me-url-constants.service';

describe('AboutMeUrlConstantsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AboutMeUrlConstantsService,
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              firstChild: {
                data: {
                  'assets': '/foo'
                }
              }
            }
          }
        }
      ]
    });
  });

  it('should be created', inject([AboutMeUrlConstantsService], (service: AboutMeUrlConstantsService) => {
    expect(service).toBeTruthy();
  }));

  it('should return correct about-me config URL',
    inject([AboutMeUrlConstantsService], (service: AboutMeUrlConstantsService) => {
      expect(service.getAboutMeConfigUrl()).toEqual(
        '/foo/' + AboutMeUrlConstantsService.FILENAME_ABOUT_ME_CONFIG);
    }
  ));
});
