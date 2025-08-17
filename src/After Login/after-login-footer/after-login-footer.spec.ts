import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterLoginFooter } from './after-login-footer';

describe('AfterLoginFooter', () => {
  let component: AfterLoginFooter;
  let fixture: ComponentFixture<AfterLoginFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AfterLoginFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfterLoginFooter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
