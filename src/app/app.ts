import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BeforLoginHeader } from '../Before Login/befor-login-header/befor-login-header';
import { BeforeLoginFooter } from '../Before Login/before-login-footer/before-login-footer';
import { LoginComponent } from '../Before Login/login-component/login-component';
import { BeforeLoginComponent } from '../Before Login/before-login-component/before-login-component';
import { AfterLoginComponent } from '../After Login/after-login-component/after-login-component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,BeforeLoginComponent,AfterLoginComponent,NgxExtendedPdfViewerModule],

    
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('TalentNodeAngular');
}
