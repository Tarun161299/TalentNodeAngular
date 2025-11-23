import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BeforLoginHeader } from '../Before Login/befor-login-header/befor-login-header';
import { BeforeLoginFooter } from '../Before Login/before-login-footer/before-login-footer';
import { LoginComponent } from '../Before Login/login-component/login-component';
import { BeforeLoginComponent } from '../Before Login/before-login-component/before-login-component';
import { AfterLoginComponent } from '../After Login/after-login-component/after-login-component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderService } from '../Common/services/loader-service';
import { LoaderComponent } from '../loader-component/loader-component';
import { JobList } from '../After Login/job-list/job-list';
import { UserProfileComponent } from '../After Login/user-profile/user-profile';
import { NgSelectModule } from '@ng-select/ng-select';
import { LandingPage } from '../Before Login/landing-page/landing-page';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet,BeforeLoginComponent,NgSelectModule,AfterLoginComponent,NgxExtendedPdfViewerModule,ReactiveFormsModule,LoaderComponent],

    
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
isLoading:any;
  constructor(private loaderService: LoaderService) {
      this.isLoading = this.loaderService.isLoading;
  }
  protected readonly title = signal('TalentNodeAngular');
}
