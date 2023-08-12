import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

const SpinnerMui = ({ size = 40, color = "#128a43" }) => {
  return <CircularProgress style={{ width: size, height: size, color }} />;
};

export default SpinnerMui;
