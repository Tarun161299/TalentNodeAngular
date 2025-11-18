import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderService } from '../Common/services/loader-service';

@Component({
  selector: 'app-loader',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './loader-component.html',
  styleUrl: './loader-component.css'
})
export class LoaderComponent {
  constructor(public loader: LoaderService) {}
}
