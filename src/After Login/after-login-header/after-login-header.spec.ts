import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterLoginHeader } from './after-login-header';

describe('AfterLoginHeader', () => {
  let component: AfterLoginHeader;
  let fixture: ComponentFixture<AfterLoginHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AfterLoginHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfterLoginHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
