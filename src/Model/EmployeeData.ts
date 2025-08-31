// src/app/models/employee.model.ts

import { Qualification } from "./Qualification";
import { Skills } from "./Skills";

export interface EmployeeData {
  employeeID: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  emp_Qualification: Qualification[];
  experience: number;
  emp_Skills: Skills[];
  districtName: string;
  stateName: string;
  empImage:string;
}
