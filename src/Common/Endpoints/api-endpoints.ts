

import { environment } from "../Environments/enironmets";

export const ApiEndpoints = {


    GetAllEmployes: `Employee/Get_All_Employee_Data`,
    saveEmployee:`Employee/saveEmployee`,
    SaveExperience:`Experience/SaveExperience`,
    saveSkillDetails:`Employee/saveSkillDetails`,
    GetResumeByEmployeeId:`Employee/GetResume?EmployeeID=`,
    Authentication:`UserAuthentication/Authenticate`,
    ModuleByRole:`MdModules/GetModuleByRole?RoleId=`,
      Signup: 'Signup/SaveSignup',
    CheckEmail: 'employees/check-email', 
    CheckContact: 'employees/check-contact',
    saveProfile:'UserProfile/SaveUserProfile',
    Qualification:'MD/Qualification',
    GetAllSkill:'MD/Skills',
     GetAllDistrict:'MD/District',
     AddEducation:'Education/AddEducation',
     GetAllState:'MD/state',
     getEmployeeDetails:'Employee/GetEmployeeDetails?EmployeeID='

  
};