import { TestBed, inject } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import { MscLookupService } from './msc-lookup.service';
import { UrlConstants } from '../utils/url-constants';

describe('MscLookupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MscLookupService]
    });
  });

  it('should load ' + UrlConstants.MSC_REGISTRY + ' upon startup',
    inject( [MscLookupService, HttpTestingController],
      (service: MscLookupService, httpMock: HttpTestingController) => {

        expect(service).toBeTruthy();
        httpMock.expectOne(UrlConstants.MSC_REGISTRY);

      }
    )
  );

  it('should handle MSC database with single fake key-value pair',
    inject([MscLookupService, HttpTestingController],
      (service: MscLookupService, httpMock: HttpTestingController) => {

        httpMock.expectOne(UrlConstants.MSC_REGISTRY)
          .flush(' key1 val1 is the value');

        expect(service.count()).toBe(1);
        expect(service.get('key1')).toBe('val1 is the value');
      }
    )
  );

  it('should handle MSC database with three fake key-value pairs, and inconsistent spacing / newline',
    inject([MscLookupService, HttpTestingController],
      (service: MscLookupService, httpMock: HttpTestingController) => {

        httpMock.expectOne(UrlConstants.MSC_REGISTRY)
          .flush(`key1 val1 for me\r\nkey2  val2 for  you\n key3\t val3 for\tthem\n`);

        expect(service.count()).toBe(3);
        expect(service.get('key1')).toBe('val1 for me');
        expect(service.get('key2')).toBe('val2 for  you');
        expect(service.get('key3')).toBe('val3 for\tthem');
      }
    )
  );

  it('should handle duplicate entries by letting the latest entry win',
    inject([MscLookupService, HttpTestingController],
      (service: MscLookupService, httpMock: HttpTestingController) => {

        httpMock.expectOne(UrlConstants.MSC_REGISTRY)
          .flush('key1 val1\nkey1 val2');

        expect(service.count()).toBe(1);
        expect(service.get('key1')).toBe('val2');
      }
    )
  );

  it('should strip extra details in braces and parentheses out of value',
    inject([MscLookupService, HttpTestingController],
      (service: MscLookupService, httpMock: HttpTestingController) => {

        httpMock.expectOne(UrlConstants.MSC_REGISTRY)
          .flush('key1 val1 [with some extra1]!\nkey2 (some extra2) val2 (really) is here\nkey3 val3 (extra3)\nkey4 val4 [extra] {extra}');

        expect(service.count()).toBe(4);
        expect(service.get('key1')).toBe('val1!');
        expect(service.get('key2')).toBe('val2 is here');
        expect(service.get('key3')).toBe('val3');
        expect(service.get('key4')).toBe('val4');

      }
    )
  );

  it('should eliminate non-data lines',
    inject([MscLookupService, HttpTestingController],
      (service: MscLookupService, httpMock: HttpTestingController) => {

      const data: Array<string> = [];
      data.push(
        '\\testcommentline',
        '\\random0{test}',
        '\\random1 { single-line value} ',
        '\\random2 {multi\\',
        'line\\',
        'value}',
        '',
        'key0 (test)val0(test) ',
        '',
        'key1 val1 (test1)',
        'key2 val2 {test2}',
        'INVALIDLINE',
        'key3 (test3) val3',
        'key4 val4');

        httpMock.expectOne(UrlConstants.MSC_REGISTRY)
          .flush(data.join('\n'));

        expect(service.count()).toBe(5);
        expect(service.get('key0')).toBe('val0');
        expect(service.get('key1')).toBe('val1');
        expect(service.get('key2')).toBe('val2');
        expect(service.get('key3')).toBe('val3');
        expect(service.get('key4')).toBe('val4');

      }
    )
  );

  afterEach( inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));
});
