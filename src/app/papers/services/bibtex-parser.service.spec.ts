import { TestBed, inject } from '@angular/core/testing';

import { Paper } from '../objects/paper';
import { BibtexParserService } from './bibtex-parser.service';

describe('BibtexParserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BibtexParserService]
    });
  });

  it('should be created', inject([BibtexParserService], (service: BibtexParserService) => {
    expect(service).toBeTruthy();
  }));

  it('handles empty bibtex input',
    inject([BibtexParserService], (service: BibtexParserService) => {

      const papers: Array<Paper> = service.parse('');
      expect(papers.length).toEqual(0);

    }));

  it('handles single-entry bibtex input with no interesting parameters',
    inject([BibtexParserService], (service: BibtexParserService) => {

      const bibData = '@article {foo, RANDOM = {}}';

      const papers: Array<Paper> = service.parse(bibData);
      expect(papers.length).toEqual(1);

      expect(papers[0].authors).toBeNull();
      expect(papers[0].abstract).toBeNull();
      expect(papers[0].journal).toBeNull();
      expect(papers[0].title).toBeNull();
      expect(papers[0].url).toBeNull();
      expect(papers[0].year).toBeNull();
    }));

  it('handles single-entry bibtex input with empty params',
    inject([BibtexParserService], (service: BibtexParserService) => {

      const bibData = `@article {foo,
        AUTHOR = {},
        Abstract = {},
        TITLe = {},
        JourNal = {},
        url = {},
        year = {},
      }`;

      const papers: Array<Paper> = service.parse(bibData);
      expect(papers.length).toEqual(1);

      expect(papers[0].authors).toEqual(['']);
      expect(papers[0].abstract).toEqual('');
      expect(papers[0].journal).toEqual('');
      expect(papers[0].title).toEqual('');
      expect(papers[0].url).toEqual('');
      expect(papers[0].year).toBeNull();
    }));

  it('handles single-entry bibtex input with real params',
    inject([BibtexParserService], (service: BibtexParserService) => {

      const bibData = `@article {foo,
        author = {John Smith and Sally Smith},
        abstract = {This is my abstract},
        title = {This is my title},
        journal = {This is my journal},
        url = {/papers/mypaper.pdf},
        year = {2017},
      }`;

      const papers: Array<Paper> = service.parse(bibData);
      expect(papers.length).toEqual(1);

      expect(papers[0].authors).toEqual(['John Smith', 'Sally Smith']);
      expect(papers[0].abstract).toEqual('This is my abstract');
      expect(papers[0].title).toEqual('This is my title');
      expect(papers[0].journal).toEqual('This is my journal');
      expect(papers[0].url).toEqual('/papers/mypaper.pdf');
      expect(papers[0].year).toEqual(2017);
    }));

  it('handles multi-entry bibtex input with real params',
    inject([BibtexParserService], (service: BibtexParserService) => {

      const bibData = `@article {foo,
        author = {John Smith and Sally Smith},
        abstract = {This is my first abstract},
        title = {This is my first title},
        journal = {This is my first journal},
        url = {/papers/mypaper1.pdf},
        year = {2017},
      } @book {bar,
        author = {Joe Shmoe and John Smith and Bob McDob},
        abstract = {This is my second abstract},
        title = {This is my second title},
        journal = {This is my second journal},
        url = {/papers/mypaper2.pdf},
        year = {2018},
      }`;

      const papers: Array<Paper> = service.parse(bibData);
      expect(papers.length).toEqual(2);

      expect(papers[0].authors).toEqual(['John Smith', 'Sally Smith']);
      expect(papers[0].abstract).toEqual('This is my first abstract');
      expect(papers[0].title).toEqual('This is my first title');
      expect(papers[0].journal).toEqual('This is my first journal');
      expect(papers[0].url).toEqual('/papers/mypaper1.pdf');
      expect(papers[0].year).toEqual(2017);

      expect(papers[1].authors).toEqual(['Joe Shmoe', 'John Smith', 'Bob McDob']);
      expect(papers[1].abstract).toEqual('This is my second abstract');
      expect(papers[1].title).toEqual('This is my second title');
      expect(papers[1].journal).toEqual('This is my second journal');
      expect(papers[1].url).toEqual('/papers/mypaper2.pdf');
      expect(papers[1].year).toEqual(2018);

    }));

});
