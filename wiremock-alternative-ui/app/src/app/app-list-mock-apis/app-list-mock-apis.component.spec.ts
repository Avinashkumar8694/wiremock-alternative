import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppListMockApisComponent } from './app-list-mock-apis.component';

describe('AppListMockApisComponent', () => {
  let component: AppListMockApisComponent;
  let fixture: ComponentFixture<AppListMockApisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppListMockApisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppListMockApisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
