import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { AboutMeComponent } from './about-me.component';
import { AboutMeConfig } from './objects/about-me-config';
import { AboutMeConfigLoaderService } from './services/about-me-config-loader.service';

class AboutMeConfigLoaderServiceSpy {
  // Return empty config object.
  load = jasmine.createSpy('load').and.callFake(
    () => Observable.of(new AboutMeConfig()));

}

describe('AboutMeComponent', () => {
  let component: AboutMeComponent;
  let fixture: ComponentFixture<AboutMeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutMeComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
    });

    TestBed.overrideComponent(AboutMeComponent, {
      set: {
        providers: [
          {provide: AboutMeConfigLoaderService, useClass: AboutMeConfigLoaderServiceSpy}
        ]
      }
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
