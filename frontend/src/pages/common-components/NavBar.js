import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

export default function NavBar() {
  return (
    <Box>
      <Tabs centered variant="standard" textColor="primary">
        <Tab label="Jobs" sx={{fontWeight : 'bold', fontSize : '24px'}}></Tab>
        <Tab label="ATS Scan" sx={{fontWeight : 'bold', fontSize : '24px'}}></Tab>
        <Tab label="Account" sx={{fontWeight : 'bold', fontSize : '24px'}}></Tab>
      </Tabs>
    </Box>
  );
}
