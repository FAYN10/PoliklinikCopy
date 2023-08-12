import { useState } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Top from "./Top";
import Side from "./Side";

const drawerWidth = 279;
const bgMain = "#f9fafb";
const Layout = ({ window, children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Top mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <Side
        window={window}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: bgMain,
        }}
      >
        {/* ghost-toolbar */}
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
