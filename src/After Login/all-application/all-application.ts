import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { EmployeeService } from '../../Common/services/employee-service';
import { EmployeeData } from '../../Model/EmployeeData';
import { DocumentDetails } from '../../Model/DocumentDetails';
import { ReactiveFormsModule } from '@angular/forms';
import { Imageupload } from '../../Common/services/imageupload';

@Component({
  selector: 'app-all-application',
  imports: [PdfViewerModule,CommonModule,ReactiveFormsModule],
  standalone: true,
  templateUrl: './all-application.html',
  styleUrl: './all-application.css'
  
})

export class AllApplication {
// candidate-card.component.ts
pdfBase64:any="";
pdfBlobUrl: string | null = null;
documentdetails:any ;
employeeList:EmployeeData[] =[];
showP:any='';
constructor(private employeeService:EmployeeService,private imageperofile:Imageupload) {
  this.showP=this.imageperofile.base64String();
}
candidates = [
  {
    name: 'John Doe',
    appliedFor: 'Software Engineer',
    qualification: 'B.Tech in Computer Science',
    experience: '3 Years',
    location: 'Delhi',
    phone: '+91 9876543210',
    email: 'john.doe@email.com',
    img: 'https://i.pravatar.cc/60?img=5',
    status: 'new'
  },
  {
    name: 'Jane Smith',
    appliedFor: 'UI Designer',
    qualification: 'B.Des in Visual Communication',
    experience: '2 Years',
    location: 'Bangalore',
    phone: '+91 9123456780',
    email: 'jane.smith@email.com',
    img: 'https://i.pravatar.cc/60?img=6',
    status: 'shortlisted'
  },
  {
    name: 'Michael Lee',
    appliedFor: 'Project Manager',
    qualification: 'MBA in Project Management',
    experience: '5 Years',
    location: 'Mumbai',
    phone: '+91 9988776655',
    email: 'michael.lee@email.com',
    img: 'https://i.pravatar.cc/60?img=7',
    status: 'rejected'
  }
];
showPdf = false;
ngOnInit(): void {
  // This code runs when the page/component loads
  console.log('Page loaded!');
   this.loadAllEmployeeData();
}
  // openPdf() {
  //   debugger
   
  // }
loadAllEmployeeData(){
  
this.employeeService.getEmployeesDetails().subscribe({
  next: (res) => {
   
    this.employeeList= res;
  },
  error: (err) => {
    console.error('Error fetching documents', err);
  }
});;
}
closeModal() {
    this.showPdf = false;
  }
  openPdf(id: number) {
  
    debugger
    this.employeeService.getResumeByEmployeeId(id).subscribe({
      next: (res) => {
        debugger
        this.documentdetails= res;
        this.pdfBase64=this.documentdetails.fileContentBase64;//"data:application/pdf;base64,"+
        //this.pdfBase64=this.base64ToUint8Array(this.documentdetails.fileContentBase64);
        this.showPdf = true;
      },
      error: (err) => {
        console.error('Error fetching documents', err);
      }
    });;
    
    // Implement PDF opening logic here
  }
  base64ToUint8Array(base64: string): Uint8Array {
    const raw = atob(base64);
    const uint8Array = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
      uint8Array[i] = raw.charCodeAt(i);
    }
    return uint8Array;
  }
}
