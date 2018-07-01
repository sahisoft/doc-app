import { TestBed, inject } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { RoutePrepService } from './route-prep.service';
import { SiteUrlConstants } from '../utils/site-url-constants';

describe('RoutePrepService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RoutePrepService]
    });
  });

  it('should be created', inject([RoutePrepService], (service: RoutePrepService) => {
    expect(service).toBeTruthy();
  }));

  it('should attempt to load ' + SiteUrlConstants.SITE_CONFIG + ' when load() is called',
    inject([RoutePrepService, HttpTestingController],
      (service: RoutePrepService, httpMock: HttpTestingController) => {

        service.load();
        httpMock.expectOne(SiteUrlConstants.SITE_CONFIG);
      }
    )
  );

  it('should have an empty list of routes when invalid configuration is provided',
    inject([RoutePrepService, HttpTestingController],
      (service: RoutePrepService, httpMock: HttpTestingController) => {

        service.load().then(() => {
          expect(service.getRoutes()).toEqual([]);
        });
        httpMock.expectOne(SiteUrlConstants.SITE_CONFIG).flush(
          'bad configuration, not even in JSON format'
        );
      }
    )
  );

  it('should understand a single-route config',
    inject([RoutePrepService, HttpTestingController],
      (service: RoutePrepService, httpMock: HttpTestingController) => {


        service.load().then(() => {
            expect(service.getRoutes()).toEqual([
              {
                path: '',
                loadChildren: 'app/papers/papers.module#PapersModule',
                data: {
                  title: 'My Papers',
                  assets: 'assets/papers'
                }
              }
            ]);
          }
        );

        httpMock.expectOne(SiteUrlConstants.SITE_CONFIG).flush(
          [
            {
              'url': '/',
              'title': 'My Papers',
              'component': 'Papers',
              'assets': 'assets/papers'
            }
          ]
        );
      }
    )
  );

  it('should understand a multi-route config',
    inject([RoutePrepService, HttpTestingController],
      (service: RoutePrepService, httpMock: HttpTestingController) => {

        service.load().then(() => {
            expect(service.getRoutes()).toEqual([
                {
                  path: '',
                  loadChildren: 'app/papers/papers.module#PapersModule',
                  data: {
                    title: 'Papers 1',
                    assets: 'assets/home'
                  },
                },
                {
                  path: 'papers',
                  loadChildren: 'app/papers/papers.module#PapersModule',
                  data: {
                    title: 'Papers 2',
                    assets: 'assets/papers'
                  }
                },
                {
                  path: 'more-papers',
                  loadChildren: 'app/papers/papers.module#PapersModule',
                  data: {
                    title: 'Papers 3',
                    assets: 'assets/more-papers'
                  }
                }
              ]
            );
          }
        );

        httpMock.expectOne(SiteUrlConstants.SITE_CONFIG).flush(
          [
            {
              'url': '/',
              'component': 'Papers',
              'title': 'Papers 1',
              'assets': 'assets/home'
            },
            {
              'url': '/papers',
              'component': 'Papers',
              'title': 'Papers 2',
              'assets': 'assets/papers'
            },
            {
              'url': '/more-papers',
              'component': 'Papers',
              'title': 'Papers 3',
              'assets': 'assets/more-papers'
            }
          ]
        );
      }
    )
  );

  it('should ignore entries with missing or bad information',
    inject([RoutePrepService, HttpTestingController],
      (service: RoutePrepService, httpMock: HttpTestingController) => {

        service.load().then(() => {
            expect(service.getRoutes()).toEqual([
                {
                  path: '',
                  loadChildren: 'app/papers/papers.module#PapersModule',
                  data: {
                    title: 'Papers 1',
                    assets: 'assets/home'
                  },
                },
              ]
            );
          }
        );

        httpMock.expectOne(SiteUrlConstants.SITE_CONFIG).flush(
          [
            {
              'url': '/',
              'component': 'Papers',
              'title': 'Papers 1',
              'assets': 'assets/home'
            },
            {
              'component': 'Papers',
              'assets': 'assets/papers'
            },
            {
              'url': '/papers',
              'component': 'Papers',
              'title': 'Papers 2',
            },
            {
              'url': '/more-papers',
              'assets': 'assets/more-papers',
              'title': 'Papers 3',
            },
            {
              'url': '/more-papers-2',
              'component': 'Invalid',
              'assets': 'assets/more-papers-2',
              'title': 'More Papers'
            }
          ]
        );
      }
    )
  );
});
