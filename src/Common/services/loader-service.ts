import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
 isLoading: boolean = false;

 show() {
    this.isLoading = true;
  }

  hide() {
    this.isLoading = false;
  }
}
