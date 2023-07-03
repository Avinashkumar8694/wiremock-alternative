import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMockApiComponent } from './add-mock-api.component';

describe('AddMockApiComponent', () => {
  let component: AddMockApiComponent;
  let fixture: ComponentFixture<AddMockApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMockApiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMockApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
