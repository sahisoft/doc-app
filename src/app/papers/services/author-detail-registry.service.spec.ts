import { TestBed, inject } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthorDetailRegistryService } from './author-detail-registry.service';
import { AuthorDetail } from '../objects/author-detail';
import { PaperUrlConstantsService } from './paper-url-constants.service';

class PaperUrlConstantsServiceSpy {

  static readonly AUTHOR_REGISTRY = 'fake_authors.json';

  getAuthorRegistryUrl = jasmine.createSpy(
      'getAuthorRegistryUrl').and.callFake(
    () => PaperUrlConstantsServiceSpy.AUTHOR_REGISTRY);
}

describe('AuthorDetailRegistryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthorDetailRegistryService,
        {provide: PaperUrlConstantsService, useClass: PaperUrlConstantsServiceSpy}
      ]});
  });

  it('should load ' + PaperUrlConstantsServiceSpy.AUTHOR_REGISTRY + ' upon startup',
    inject([AuthorDetailRegistryService, HttpTestingController],
      (service: AuthorDetailRegistryService, httpMock: HttpTestingController) => {

        expect(service).toBeTruthy();
        httpMock.expectOne(PaperUrlConstantsServiceSpy.AUTHOR_REGISTRY);
      }
    )
  );

  it('should handle bad input correctly',
    inject([AuthorDetailRegistryService, HttpTestingController],
      (service: AuthorDetailRegistryService, httpMock: HttpTestingController) => {

          httpMock.expectOne(PaperUrlConstantsServiceSpy.AUTHOR_REGISTRY)
            .flush('badResponse');

          expect(service.getAuthorDetails()).toEqual([]);
        }
      )
  );

  it('should handle empty array correctly',
    inject([AuthorDetailRegistryService, HttpTestingController],
      (service: AuthorDetailRegistryService, httpMock: HttpTestingController) => {

          httpMock.expectOne(PaperUrlConstantsServiceSpy.AUTHOR_REGISTRY)
            .flush([]);

          expect(service.getAuthorDetails()).toEqual([]);
        }
      )
  );

  it('should handle valid single-author record correctly',
    inject([AuthorDetailRegistryService, HttpTestingController],
      (service: AuthorDetailRegistryService, httpMock: HttpTestingController) => {

        httpMock.expectOne(PaperUrlConstantsServiceSpy.AUTHOR_REGISTRY)
          .flush(
            [{
              'cite': 'Smith, John',
              'show': 'John Smith',
              'type': 'owner',
              'url': 'https://www.example.com/'
            }]
          );

        const authorDetail = new AuthorDetail('Smith, John',
          'John Smith',
          'owner',
          'https://www.example.com/');

        expect(service.getAuthorDetails()).toEqual([authorDetail]);
        expect(service.getAuthorByCiteStyle('Smith, John')).toEqual(authorDetail);
        expect(service.getAuthorByCiteStyle('John Smith')).toBeNull();

      }
    )
  );

  it('should ignore author records with missing or empty attributes',
    inject([AuthorDetailRegistryService, HttpTestingController],
      (service: AuthorDetailRegistryService, httpMock: HttpTestingController) => {

        httpMock.expectOne(PaperUrlConstantsServiceSpy.AUTHOR_REGISTRY).
          flush(
            [
              {'show': 'Bad Author 1'},
              ,
              {
                'cite': 'Smith, John',
                'show': 'John Smith',
                'type': 'owner',
                'url': 'https://www.example.com/'
              },
              {},
              ,
              ,
            ]
          );

        const authorDetail = new AuthorDetail('Smith, John',
          'John Smith',
          'owner',
          'https://www.example.com/');

        expect(service.getAuthorDetails()).toEqual([authorDetail]);
        expect(service.getAuthorByCiteStyle('Smith, John')).toEqual(authorDetail);
        expect(service.getAuthorByCiteStyle('John Smith')).toBeNull();

      }
    )
  );

  it('should allow records with extra unused attributes',
    inject([AuthorDetailRegistryService, HttpTestingController],
      (service: AuthorDetailRegistryService, httpMock: HttpTestingController) => {

        httpMock.expectOne(PaperUrlConstantsServiceSpy.AUTHOR_REGISTRY).flush(
          [{
            'cite': 'Smith, John',
            'show': 'John Smith',
            'type': 'owner',
            'url': 'https://www.example.com/',
            'extra': 'unused'
          }]
        );

        const authorDetail = new AuthorDetail('Smith, John',
          'John Smith',
          'owner',
          'https://www.example.com/');

        expect(service.getAuthorDetails()).toEqual([authorDetail]);
        expect(service.getAuthorByCiteStyle('Smith, John')).toEqual(authorDetail);
        expect(service.getAuthorByCiteStyle('John Smith')).toBeNull();
      }
    )
  );

  it('should handle multiple records correctly',
    inject([AuthorDetailRegistryService, HttpTestingController],
      (service: AuthorDetailRegistryService, httpMock: HttpTestingController) => {

        httpMock.expectOne(PaperUrlConstantsServiceSpy.AUTHOR_REGISTRY).flush(
          [{
            'cite': 'Smith, John',
            'show': 'John Smith',
            'type': 'owner',
            'url': 'https://www.example.com/',
          }, {
            'cite': 'Shmoe, Joe',
            'show': 'Joe Shmoe',
            'type': 'collaborator',
            'url': 'https://www.example.org/'
          }]
        );

        const authorDetail1 = new AuthorDetail('Smith, John',
          'John Smith',
          'owner',
          'https://www.example.com/');
        const authorDetail2 = new AuthorDetail('Shmoe, Joe',
          'Joe Shmoe',
          'collaborator',
          'https://www.example.org/');

        expect(service.getAuthorDetails()).toEqual([authorDetail1, authorDetail2]);
        expect(service.getAuthorByCiteStyle('Smith, John')).toEqual(authorDetail1);
        expect(service.getAuthorByCiteStyle('John Smith')).toBeNull();
        expect(service.getAuthorByCiteStyle('Shmoe, Joe')).toEqual(authorDetail2);
        expect(service.getAuthorByCiteStyle('Joe Shmoe')).toBeNull();
      }
    )
  );

  it('should let a second record with an identical cite key override the first in cite style lookups',
    inject([AuthorDetailRegistryService, HttpTestingController],
      (service: AuthorDetailRegistryService, httpMock: HttpTestingController) => {

        httpMock.expectOne(PaperUrlConstantsServiceSpy.AUTHOR_REGISTRY).flush(
          [{
            'cite': 'Smith, John',
            'show': 'John Smith',
            'type': 'owner',
            'url': 'https://www.example.com/',
          }, {
            'cite': 'Smith, John',
            'show': 'John Smith',
            'type': 'collaborator',
            'url': 'https://www.example.org/'
          }]
        );

        const authorDetail1 = new AuthorDetail('Smith, John',
          'John Smith',
          'owner',
          'https://www.example.com/');
        const authorDetail2 = new AuthorDetail('Smith, John',
          'John Smith',
          'collaborator',
          'https://www.example.org/');

        expect(service.getAuthorDetails()).toEqual([authorDetail1, authorDetail2]);
        expect(service.getAuthorByCiteStyle('Smith, John')).toEqual(authorDetail2);
        expect(service.getAuthorByCiteStyle('John Smith')).toBeNull();
      }
    )
  );

});
