import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-all-application',
  imports: [NgxExtendedPdfViewerModule,CommonModule],
  standalone: true,
  templateUrl: './all-application.html',
  styleUrl: './all-application.css'
  
})

export class AllApplication {
// candidate-card.component.ts
constructor() {}

showPdf = false;

  openPdf() {
    debugger
    this.showPdf = true;
  }

  closePdf() {
    this.showPdf = false;
  }

}
