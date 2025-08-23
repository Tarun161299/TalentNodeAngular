import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllApplication } from './all-application';

describe('AllApplication', () => {
  let component: AllApplication;
  let fixture: ComponentFixture<AllApplication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllApplication]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllApplication);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
