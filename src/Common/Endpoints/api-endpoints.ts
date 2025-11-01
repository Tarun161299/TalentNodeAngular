

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
    Department:'MD/Department',
    Benifits:'MD/Benifits',
    Company:'MD/Company?hrid=',
    JobType:'MD/JobType',
    GetAllSkill:'MD/Skills',
     GetAllDistrict:'MD/District',
     AddEducation:'Education/AddEducation',
     GetAllState:'MD/state',
     saveDocument:`Employee/saveDocument`,
     getEmployeeDetails:'Employee/GetEmployeeDetails?EmployeeID=',
     saveJobs:`Jobs/SaveJobs`,
     GetJobsHr:`Jobs/GetJobsHr?hrid=`

  
};