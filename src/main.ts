import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { importProvidersFrom } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PdfViewerModule } from 'ng2-pdf-viewer';

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(PdfViewerModule),
    ...(appConfig.providers ?? [])
    // other providers...
  ],
})
  .catch((err) => console.error(err));
