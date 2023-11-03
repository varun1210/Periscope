import Stack from "@mui/material/Stack";
import PostingTile from "./PostingTile";
import Box from "@mui/material/Box";

export default function PostList({ jobsData }) {
  return (
    <Stack spacing={1}>
      <PostingTile
        title={jobsData[0].job_title}
        company={jobsData[0].company_name}
        salary={`${jobsData[0].min_salary} - ${jobsData[0].max_salary}`}
      />
      <PostingTile
        title={jobsData[1].job_title}
        company={jobsData[1].company_name}
        salary={`${jobsData[1].min_salary} - ${jobsData[1].max_salary}`}
      />
      <PostingTile
        title={jobsData[2].job_title}
        company={jobsData[2].company_name}
        salary={`${jobsData[2].min_salary} - ${jobsData[2].max_salary}`}
      />
      <PostingTile
        title={jobsData[3].job_title}
        company={jobsData[3].company_name}
        salary={`${jobsData[3].min_salary} - ${jobsData[3].max_salary}`}
      />
      <PostingTile
        title={jobsData[4].job_title}
        company={jobsData[4].company_name}
        salary={`${jobsData[4].min_salary} - ${jobsData[4].max_salary}`}
      />
    </Stack>
  );
}
