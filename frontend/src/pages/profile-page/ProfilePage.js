import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import NavBar from "../common-components/NavBar";

function ProfilePage() {
  return (
    <div className="ProfilePageClass">
      <Container maxWidth="lg"> 
        <Box className="ProfilePageBox" bgcolor="primary.light">
          <Box m={2}>
            <NavBar />
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default ProfilePage;
