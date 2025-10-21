import { TestBed } from '@angular/core/testing';

import { Imageupload } from './imageupload';

describe('Imageupload', () => {
  let service: Imageupload;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Imageupload);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
