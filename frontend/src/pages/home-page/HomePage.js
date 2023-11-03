import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import PostingDetails from "./components/PostingDetails";
import PostList from "./components/PostList";
import NavBar from "../common-components/NavBar";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import JOBS_DATA from "../../data"

function HomePage() {
  return (
    <div className="HomePage">
      <Container maxWidth="lg">
        <Box className="Appbox" bgcolor="primary.light">
          <Box m={2}>
            <NavBar />
          </Box>
          <Box m={2}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <PostList jobsData={JOBS_DATA.data} />
              </Grid>
              <Grid item xs={9}>
                <PostingDetails postingInfo={JOBS_DATA.data}/>
              </Grid>
            </Grid>
          </Box>
          <Box m={2} display="flex" justifyContent="center" alignItems="center">
              <Pagination count={10} shape="rounded" />
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default HomePage;
