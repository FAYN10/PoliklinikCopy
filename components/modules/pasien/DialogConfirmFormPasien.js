import { forwardRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
// import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogConfirmPasien = ({
  state = false,
  stateHandler = () => {},
  noRm = null,
}) => {
  const router = useRouter();
  const handlerClose = () => {
    stateHandler({
      state: false,
      noRm: null,
    });
  };
  return (
    <>
      <Dialog
        open={state}
        onClose={(_, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") return;
          handlerClose();
        }}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {/* <DialogTitle id="alert-dialog-title">Pasien</DialogTitle> */}
        <DialogContent>
          <DialogContentText>
            Lanjut ke pendaftaran rawat jalan?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handlerClose}>
            Batal
          </Button>
          <Button
            color="success"
            onClick={() =>
              router.push(
                {
                  pathname: "/pasien/create/rawat-jalan",
                  query: {
                    initial_no_rm: noRm,
                  },
                },
                "/pasien/create/rawat-jalan"
              )
            }
          >
            Lanjutkan
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DialogConfirmPasien;
