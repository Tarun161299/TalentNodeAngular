export interface DocumentDetails {
    documentID: number;       // Primary Key
    employeeID: number;       // Foreign Key
    docName: string;          // e.g. "Resume", "ID Proof"
    fileName: string;         // Original file name
    fileType: string;         // pdf, docx, jpg, etc.
    fileContentBase64: string; // Base64 string of the file
    link?: string;            // Optional link
    uploadDate?: Date;        // Defaults to current date if needed
    isRemoved?: boolean;      // Defaults to false
    createdBy?: string;
    updatedBy?: string;
  }