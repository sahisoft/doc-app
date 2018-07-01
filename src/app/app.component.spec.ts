import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MatToolbarModule } from '@angular/material';

import { AppComponent } from './app.component';
import { RoutePrepService } from './site/services/route-prep.service';

class RouterSpy {
  // We will expect resetConfig to be called.
  resetConfig = jasmine.createSpy('resetConfig');
}


class RoutePrepServiceSpy {

  // Return an empty set of routes when asked.
  getRoutes = jasmine.createSpy('getRoutes').and.callFake(
    () => []
  );
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppComponent ],
      imports: [
        MatToolbarModule,
        RouterTestingModule.withRoutes([{path: 'papers', redirectTo: '/'}])
      ],
      providers: [
        { provide: Router, useClass: RouterSpy },
        { provide: RoutePrepService, useClass: RoutePrepServiceSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('should reset route config when initialized', () => {
    component.ngOnInit();
    expect(component.router.resetConfig).toHaveBeenCalled();
  });
});
