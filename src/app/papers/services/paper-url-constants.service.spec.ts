import { TestBed, inject } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { PaperUrlConstantsService } from './paper-url-constants.service';

describe('PaperUrlConstantsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [PaperUrlConstantsService,
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
      }
    );
  });

  it('should be created',
    inject([PaperUrlConstantsService], (service: PaperUrlConstantsService) => {
      expect(service).toBeTruthy();
    }
  ));

  it('should return correct author registry URL',
    inject([PaperUrlConstantsService], (service: PaperUrlConstantsService) => {
      expect(service.getAuthorRegistryUrl()).toEqual(
        '/foo/' + PaperUrlConstantsService.FILENAME_AUTHOR_REGISTRY);
    }
  ));

  it('should return correct MSC registry file URL',
    inject([PaperUrlConstantsService], (service: PaperUrlConstantsService) => {
      expect(service.getMscRegistryUrl()).toEqual(
        '/foo/' + PaperUrlConstantsService.FILENAME_MSC_REGISTRY);
    }
  ));

  it('should return correct papers BIB file URL',
    inject([PaperUrlConstantsService], (service: PaperUrlConstantsService) => {
      expect(service.getPapersBibUrl()).toEqual(
        '/foo/' + PaperUrlConstantsService.FILENAME_PAPERS_BIB);
    }
  ));
});
