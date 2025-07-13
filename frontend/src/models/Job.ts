export interface Job {
  jobId: number,
  company: string,
  title: string,
  location: string,
  jobDescription: string | null,
  medianPay: number | null,
  minPay: number | null,
  maxPay: number | null,
  industry: string | null, 
  experience: string | null,
  link: string | null,
}

export interface JobSummary {
  jobId: number, 
  company: string, 
  title: string, 
  location: string, 
  medianPay: number | null,
  minPay: number | null, 
  maxPay: number | null, 
  link: string | null
}