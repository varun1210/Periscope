export default interface Job {
  jobId: string,
  company: string,
  title: string,
  location: string,
  jobDescription: string,
  medianPay: number,
  minPay: number,
  maxPay: number,
  age: number,
  industry: string, 
  experience: string,
  link: string,
}

export default interface JobSummary {
  jobId: string, 
  company: string, 
  title: string, 
  location: string, 
  medianPay: number,
  minPay: number, 
  maxPay: number, 
  link: string
}