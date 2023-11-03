import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import NavBar from "../common-components/NavBar";
import Input from "@mui/material/Input";

function AtsScan() {
  return (
    <div className="AtsScanPage">
      <Container maxWidth="lg"> 
        <Box className="AtsScanBox" bgcolor="primary.light">
          <Box m={2}>
            <NavBar />
          </Box>
          <Box m={2}>
            <Input type="file" />
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default AtsScan;
