export interface ApplyForJob {
  candidateId: number;
  jobId: number;
  status: string;
  appliedDate: Date;
  updatedDate?: Date;
  createdBy?: string;
}
