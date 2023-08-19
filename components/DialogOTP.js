import { useState } from "react";
import { useRouter } from "next/router";
import Dialog from "@mui/material/Dialog";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Grid, TextField, Button } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { stringSchema } from "utils/yupSchema";
import Snackbar from "components/SnackbarMui";
import { twoFactor } from "api/login";
import { setItem as setCookie } from "utils/cookies";
import { setItem as setStorage } from "utils/storage";

const DialogOTP = ({ state, setState, data }) => {
  const router = useRouter();
  const [snackbar, setSnackbar] = useState({
    state: false,
    type: null,
    message: "",
  });

  const initialValue = {
    otp: "",
  };

  const schema = Yup.object({
    otp: stringSchema("OTP", true),
  });

  const validation = useFormik({
    initialValues: initialValue,
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      data.otp = values.otp;
      try {
        const response = await twoFactor(data);
        setCookie("client", response.data.data.access_token);
        setStorage("basic_client", response.data.data);
        router.push("/dashboard");
        setSnackbar({
          state: true,
          type: "success",
          message: `Berhasil`,
        });
      } catch (error) {
        setSnackbar({
          state: true,
          type: "error",
          message: `Terjadi kesalahan!`,
        });
      } finally {
        resetForm();
        handleClose();
      }
    },
  });

  const handleClose = () => {
    validation.resetForm();
    setState(false);
  };

  return (
    <>
      <Dialog onClose={handleClose} open={state}>
        <div className="p-16">
          <form onSubmit={validation.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item md={12}>
                <TextField
                  fullWidth
                  id="otp"
                  name="otp"
                  label="Validasi OTP"
                  // type="password"
                  // autoComplete="new-password"
                  value={validation.values.otp}
                  onChange={validation.handleChange}
                  error={
                    validation.touched.otp && Boolean(validation.errors.otp)
                  }
                  helperText={validation.touched.otp && validation.errors.otp}
                />
              </Grid>
            </Grid>
            <div className="mt-14 flex justify-end items-center">
              <Button
                type="button"
                variant="outlined"
                sx={{ marginRight: 2 }}
                onClick={handleClose}
              >
                Batal
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={validation.isSubmitting}
              >
                Submit
              </LoadingButton>
            </div>
          </form>
        </div>
      </Dialog>
      <Snackbar
        state={snackbar.state}
        setState={setSnackbar}
        message={snackbar.message}
        isSuccessType={snackbar.type === "success"}
        isErrorType={snackbar.type === "error"}
      />
    </>
  );
};

export default DialogOTP;
