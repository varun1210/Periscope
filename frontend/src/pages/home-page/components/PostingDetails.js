import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card"

export default function PostingDetails( {postingInfo} ) {
  const jobTtile = postingInfo[0].job_title;
  const companyName = postingInfo[0].company_name;
  const jobDescription = postingInfo[0].job_description;
  
  return (
    <Card variant="outlined" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="h4">{jobTtile}</Typography>
      <Typography variant="h5">{companyName}</Typography>
      <Typography variant="p">{jobDescription}</Typography>
    </Card>
  );
}


