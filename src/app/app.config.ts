import { ApplicationConfig,ErrorHandler,provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
//import { BeforLoginHeaderComponent } from './befor-login-header/befor-login-header.component';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

// Custom error handler (optional)
class CustomErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    console.error('Global error handler:', error);
    // Add your custom error handling logic here
  }
}

export const appConfig: ApplicationConfig = {
  
  providers: [
   // provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(), // Required for toastr
    provideToastr({
      timeOut: 30000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      }),
      { provide: ErrorHandler, useClass: CustomErrorHandler }
  ]
};

