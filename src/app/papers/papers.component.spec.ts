import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { PapersComponent } from './papers.component';
import { BibtexPaperLoaderService } from './services/bibtex-paper-loader.service';
import { MscLookupService } from './services/msc-lookup.service';

class Paper {}

class BibtexPaperLoaderServiceSpy {
  loadPapers = jasmine.createSpy('loadPapers').and.callFake(
    () => Observable.of<Paper>([]));
}

class MscLookupServiceSpy {
  // Don't expect anything to be called here, because we are returning an empty list of papers above.
  // We may flesh out this unit test further in later versions.
}


describe('PapersComponent', () => {
  let component: PapersComponent;
  let fixture: ComponentFixture<PapersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PapersComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
    });

    TestBed.overrideComponent(PapersComponent, {
      set: {
        providers: [
          {provide: BibtexPaperLoaderService, useClass: BibtexPaperLoaderServiceSpy},
          {provide: MscLookupService, useClass: MscLookupServiceSpy}
        ]
      }
    });

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PapersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
