export interface Job {
  jobId: string,
  company: string,
  title: string,
  location: string,
  jobDescription: string,
  medianPay: number | null,
  minPay: number | null,
  maxPay: number | null,
  age: number | null,
  industry: string, 
  experience: string | null,
  link: string,
}

export interface JobSummary {
  jobId: string, 
  company: string, 
  title: string, 
  location: string, 
  medianPay: number | null,
  minPay: number | null, 
  maxPay: number | null, 
  link: string
}