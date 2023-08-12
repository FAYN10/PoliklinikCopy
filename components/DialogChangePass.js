import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import { updateUserPassword } from "api/user";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Grid, TextField, Button } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { stringSchema } from "utils/yupSchema";
import { getItem } from "utils/storage";
import Snackbar from "components/SnackbarMui";

const DialogChangePass = ({ state, setState }) => {
  const [snackbar, setSnackbar] = useState({
    state: false,
    type: null,
    message: "",
  });
  const basicData = getItem("basic_client");

  const initialValue = {
    old_password: "",
    password: "",
    password_confirmation: "",
  };

  const schema = Yup.object({
    old_password: stringSchema("Password lama", true),
    password: Yup.string().min(8, "Minimal 8 karakter").required("Wajib diisi"),
    password_confirmation: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Password harus sama"
    ),
  });

  const validation = useFormik({
    initialValues: initialValue,
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        await updateUserPassword({ ...values, id: basicData.user.id });
        setSnackbar({
          state: true,
          type: "success",
          message: `Berhasil mengubah password`,
        });
      } catch (error) {
        console.log(error);
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
                  id="old_password"
                  name="old_password"
                  label="Password lama"
                  type="password"
                  autoComplete="new-password"
                  value={validation.values.old_password}
                  onChange={validation.handleChange}
                  error={
                    validation.touched.old_password &&
                    Boolean(validation.errors.old_password)
                  }
                  helperText={
                    validation.touched.old_password &&
                    validation.errors.old_password
                  }
                />
              </Grid>
              <Grid item md={12}>
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Password baru"
                  type="password"
                  autoComplete="new-password"
                  value={validation.values.password}
                  onChange={validation.handleChange}
                  error={
                    validation.touched.password &&
                    Boolean(validation.errors.password)
                  }
                  helperText={
                    validation.touched.password && validation.errors.password
                  }
                />
              </Grid>
              <Grid item md={12}>
                <TextField
                  fullWidth
                  id="password_confirmation"
                  name="password_confirmation"
                  label="Konfirmasi password baru"
                  type="password"
                  autoComplete="new-password"
                  value={validation.values.password_confirmation}
                  onChange={validation.handleChange}
                  error={
                    validation.touched.password_confirmation &&
                    Boolean(validation.errors.password_confirmation)
                  }
                  helperText={
                    validation.touched.password_confirmation &&
                    validation.errors.password_confirmation
                  }
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
                Simpan
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

export default DialogChangePass;
