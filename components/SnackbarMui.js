import { useEffect, forwardRef } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SnackbarMui = ({
  message,
  state,
  setState,
  isSuccessType = false,
  isWarningType = false,
  isInfoType = false,
  isErrorType = false,
}) => {
  const onClose = () => {
    setState(false);
  };
  if (isSuccessType) {
    return (
      <div style={{ width: "400px" }}>
        <Snackbar
          open={state}
          autoHideDuration={3000}
          onClose={onClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            {message}
          </Alert>
        </Snackbar>
      </div>
    );
  }
  if (isWarningType) {
    return (
      <div style={{ width: "400px" }}>
        <Snackbar
          open={state}
          autoHideDuration={3000}
          onClose={onClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="warning" sx={{ width: "100%" }}>
            {message}
          </Alert>
        </Snackbar>
      </div>
    );
  }
  if (isInfoType) {
    return (
      <div style={{ width: "400px" }}>
        <Snackbar
          open={state}
          autoHideDuration={3000}
          onClose={onClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="info" sx={{ width: "100%" }}>
            {message}
          </Alert>
        </Snackbar>
      </div>
    );
  }
  if (isErrorType) {
    return (
      <div style={{ width: "400px" }}>
        <Snackbar
          open={state}
          autoHideDuration={3000}
          onClose={onClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="error" sx={{ width: "100%" }}>
            {message}
          </Alert>
        </Snackbar>
      </div>
    );
  }
  return null;
};

export default SnackbarMui;
