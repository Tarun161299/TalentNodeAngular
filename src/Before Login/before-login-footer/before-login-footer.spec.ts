import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeforeLoginFooter } from './before-login-footer';

describe('BeforeLoginFooter', () => {
  let component: BeforeLoginFooter;
  let fixture: ComponentFixture<BeforeLoginFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeforeLoginFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeforeLoginFooter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
