import { TestBed, inject } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { BibtexPaperLoaderService } from './bibtex-paper-loader.service';
import { PaperUrlConstantsService } from './paper-url-constants.service';

class PaperUrlConstantsServiceSpy {

  static readonly PAPERS_BIB = 'fake_papers.bib';

  getPapersBibUrl = jasmine.createSpy(
    'getPapersBibUrl').and.callFake(
    () => PaperUrlConstantsServiceSpy.PAPERS_BIB);

}

describe('BibtexPaperLoaderService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BibtexPaperLoaderService,
        {provide: PaperUrlConstantsService, useClass: PaperUrlConstantsServiceSpy}
    ]});
  });

  it('should be created',
    inject([BibtexPaperLoaderService], (service: BibtexPaperLoaderService) => {
      expect(service).toBeTruthy();
    })
  );


  // Try loading data with a mocked error.
  it('should return an error if data cannot be loaded',
    inject([BibtexPaperLoaderService, HttpTestingController],
      (service: BibtexPaperLoaderService, httpMock: HttpTestingController) => {

        service.loadPapers().subscribe(
          data => {
            fail('Should not have gotten data: ' + data);
          },
          failure => {
            expect(failure.error.type).toBe('PAPER_LOAD_FAIL');
          }
        );

        const request = httpMock.expectOne(PaperUrlConstantsServiceSpy.PAPERS_BIB);
        request.error(new ErrorEvent('PAPER_LOAD_FAIL'));
      }
    )
  );

  it('handles empty bibtex input',
    inject([BibtexPaperLoaderService, HttpTestingController],
      (service: BibtexPaperLoaderService, httpMock: HttpTestingController) => {

        service.loadPapers().subscribe(
          papers => {
            expect(papers.length).toEqual(0);
          }
        );

        const request = httpMock.expectOne(PaperUrlConstantsServiceSpy.PAPERS_BIB);
        request.flush('\n');
      }
    )
  );

  it('handles single-entry bibtex input with no interesting parameters',
    inject([BibtexPaperLoaderService, HttpTestingController],
      (service: BibtexPaperLoaderService, httpMock: HttpTestingController) => {

        service.loadPapers().subscribe(
          papers => {

            expect(papers.length).toEqual(1);

            expect(papers[0].id).toEqual(1);
            expect(papers[0].authors).toBeNull();
            expect(papers[0].abstractText).toBeNull();
            expect(papers[0].journal).toBeNull();
            expect(papers[0].mrclass).toBeNull();
            expect(papers[0].title).toBeNull();
            expect(papers[0].url).toBeNull();
            expect(papers[0].year).toBeNull();
          }
        );

        const request = httpMock.expectOne(PaperUrlConstantsServiceSpy.PAPERS_BIB);
        request.flush('@article {foo, RANDOM = {}}');
      }
    )
  );

  it('handles single-entry bibtex input with empty params',
    inject([BibtexPaperLoaderService, HttpTestingController],
      (service: BibtexPaperLoaderService, httpMock: HttpTestingController) => {

        service.loadPapers().subscribe(
          papers => {

            expect(papers.length).toEqual(1);

            expect(papers[0].id).toEqual(1);
            expect(papers[0].authors).toEqual(['']);
            expect(papers[0].abstractText).toEqual('');
            expect(papers[0].journal).toEqual('');
            expect(papers[0].mrclass).toEqual(['']);
            expect(papers[0].title).toEqual('');
            expect(papers[0].url).toEqual('');
            expect(papers[0].year).toBeNull();
          }
        );

        const request = httpMock.expectOne(PaperUrlConstantsServiceSpy.PAPERS_BIB);
        request.flush(`@article {foo,
          AUTHOR = {},
          Abstract = {},
          TITLe = {},
          mrClass = {},
          JourNal = {},
          url = {},
          year = {},
          }`);
      }
    )
  );

  it('handles single-entry bibtex input with real params',
    inject([BibtexPaperLoaderService, HttpTestingController],
      (service: BibtexPaperLoaderService, httpMock: HttpTestingController) => {

        service.loadPapers().subscribe(
          papers => {

            expect(papers.length).toEqual(1);

            expect(papers[0].id).toEqual(1);
            expect(papers[0].authors).toEqual(['John Smith', 'Sally Smith']);
            expect(papers[0].abstractText).toEqual('This is my abstract');
            expect(papers[0].title).toEqual('This is my title');
            expect(papers[0].journal).toEqual('This is my journal');
            expect(papers[0].mrclass).toEqual(['foo1', 'foo2', 'foo3']);
            expect(papers[0].url).toEqual('/papers/mypaper.pdf');
            expect(papers[0].year).toEqual(2017);
          }
        );

        const request = httpMock.expectOne(PaperUrlConstantsServiceSpy.PAPERS_BIB);
        request.flush(`@article {foo,
        author = {John Smith and Sally Smith},
        abstract = {This is my abstract},
        title = {This is my title},
        mrclass = {foo1 (foo2 foo3)},
        journal = {This is my journal},
        url = {/papers/mypaper.pdf},
        year = {2017},
        }`);
      }
    )
  );

  it('handles multi-entry bibtex input with real params',
    inject([BibtexPaperLoaderService, HttpTestingController],
      (service: BibtexPaperLoaderService, httpMock: HttpTestingController) => {

        service.loadPapers().subscribe(
          papers => {
            expect(papers.length).toEqual(2);

            expect(papers[0].id).toEqual(1);
            expect(papers[0].authors).toEqual(['John Smith', 'Sally Smith']);
            expect(papers[0].abstractText).toEqual('This is my first abstract');
            expect(papers[0].title).toEqual('This is my first title');
            expect(papers[0].journal).toEqual('This is my first journal');
            expect(papers[0].mrclass).toEqual(['foo1', 'foo2', 'foo3']);
            expect(papers[0].url).toEqual('/papers/mypaper1.pdf');
            expect(papers[0].year).toEqual(2017);

            expect(papers[1].id).toEqual(2);
            expect(papers[1].authors).toEqual(['Joe Shmoe', 'John Smith', 'Bob McDob']);
            expect(papers[1].abstractText).toEqual('This is my second abstract');
            expect(papers[1].title).toEqual('This is my second title');
            expect(papers[1].journal).toEqual('This is my second journal');
            expect(papers[1].mrclass).toEqual(['foo4', 'foo5', 'foo6']);
            expect(papers[1].url).toEqual('/papers/mypaper2.pdf');
            expect(papers[1].year).toEqual(2018);
          }
        );

        const request = httpMock.expectOne(PaperUrlConstantsServiceSpy.PAPERS_BIB);
        request.flush(`@article {foo,
        author = {John Smith and Sally Smith},
        abstract = {This is my first abstract},
        title = {This is my first title},
        journal = {This is my first journal},
        mrclass = {foo1 foo2 (foo3)},
        url = {/papers/mypaper1.pdf},
        year = {2017},
      } @book {bar,
        author = {Joe Shmoe and John Smith and Bob McDob},
        abstract = {This is my second abstract},
        title = {This is my second title},
        journal = {This is my second journal},
        mrclass = {(foo4 foo5) foo6},
        url = {/papers/mypaper2.pdf},
        year = {2018},
      }`);
      }
    )
  );

  it('does not strip out math symbols',
    inject([BibtexPaperLoaderService, HttpTestingController],
      (service: BibtexPaperLoaderService, httpMock: HttpTestingController) => {

        service.loadPapers().subscribe(
          papers => {
            expect(papers.length).toEqual(1);
            expect(papers[0].title).toEqual('{L}ie superalgebra $\\mathfrak{q}(n)$');
          }
        );

        const request = httpMock.expectOne(PaperUrlConstantsServiceSpy.PAPERS_BIB);
        request.flush(`@article {foo,
          title={{L}ie superalgebra $\\mathfrak{q}(n)$}
        }`);
      }
    )
  );

  afterEach( inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));

});
