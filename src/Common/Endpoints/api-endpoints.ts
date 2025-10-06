

import { environment } from "../Environments/enironmets";

export const ApiEndpoints = {


    GetAllEmployes: `Employee/Get_All_Employee_Data`,
    GetResumeByEmployeeId:`Employee/GetResume?EmployeeID=`,
    Authentication:`UserAuthentication/Authenticate`,
    ModuleByRole:`MdModules/GetModuleByRole?RoleId=`,
      Signup: 'Signup/SaveSignup',
    CheckEmail: 'employees/check-email', 
    CheckContact: 'employees/check-contact',
    saveProfile:'UserProfile/SaveUserProfile',
    GetAllSkill:'MD/Skills',
     GetAllDistrict:'MD/District',
     GetAllState:'MD/state',
     getEmployeeDetails:'Employee/GetEmployeeDetails?EmployeeID='

  
};