import { TestBed, inject } from '@angular/core/testing';

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

  // TODO - single entry unit test

  // TODO - multi entry unit test
});
