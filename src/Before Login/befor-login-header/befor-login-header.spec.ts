import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeforLoginHeader } from './befor-login-header';

describe('BeforLoginHeader', () => {
  let component: BeforLoginHeader;
  let fixture: ComponentFixture<BeforLoginHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeforLoginHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeforLoginHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
