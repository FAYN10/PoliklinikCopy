import { useState } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { FocusError } from "focus-formik-error";
import * as Yup from "yup";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import PlusIcon from "@material-ui/icons/Add";
import BackIcon from "@material-ui/icons/ArrowBack";
import SaveIcon from "@material-ui/icons/Save";
import Snackbar from "components/SnackbarMui";
import Grid from "@mui/material/Grid";
import { stringSchema } from "utils/yupSchema";
import {
  createPendidikan,
  updatePendidikan,
  getDetailPendidikan,
} from "api/pendidikan";
import useClientPermission from "custom-hooks/useClientPermission";

const Form = ({
  isEditType = false,
  prePopulatedDataForm = {},
  detailPrePopulatedData = {},
  updatePrePopulatedData = () => "update data",
}) => {
  const router = useRouter();
  const { isActionPermitted } = useClientPermission();
  const [snackbar, setSnackbar] = useState({
    state: false,
    type: null,
    message: "",
  });

  const initialValue = !isEditType
    ? {
        name: "",
      }
    : prePopulatedDataForm;

  const schema = Yup.object({
    name: stringSchema("Nama pendidikan", true),
  });

  const validation = useFormik({
    initialValues: initialValue,
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      let messageContext = isEditType ? "diperbarui" : "ditambahkan";
      let data = {
        ...values,
      };
      try {
        if (!isEditType) {
          await createPendidikan(data);
          resetForm();
        } else {
          await updatePendidikan({ ...data, id: detailPrePopulatedData.id });
          const response = await getDetailPendidikan({
            id: detailPrePopulatedData.id,
          });
          updatePrePopulatedData({ ...response.data.data });
        }
        setSnackbar({
          state: true,
          type: "success",
          message: `"${values.name}" berhasil ${messageContext}!`,
        });
      } catch (error) {
        console.log(error);
        setSnackbar({
          state: true,
          type: "error",
          message: `Terjadi kesalahan, "${values.name}" gagal ${messageContext}!`,
        });
      }
    },
  });

  return (
    <>
      <Paper sx={{ width: "100%", padding: 2, paddingTop: 3 }}>
        <form onSubmit={validation.handleSubmit}>
          <FocusError formik={validation} />
          <Grid container spacing={2}>
            <Grid item md={12}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Nama"
                autoComplete="off"
                value={validation.values.name}
                onChange={validation.handleChange}
                error={
                  validation.touched.name && Boolean(validation.errors.name)
                }
                helperText={validation.touched.name && validation.errors.name}
              />
            </Grid>
          </Grid>
          <div className="mt-16 flex justify-end items-center">
            <Button
              type="button"
              variant="outlined"
              startIcon={<BackIcon />}
              sx={{ marginRight: 2 }}
              onClick={() => router.push("/pendidikan")}
            >
              Kembali
            </Button>
            {isEditType ? (
              <LoadingButton
                type="submit"
                variant="contained"
                disabled={
                  JSON.stringify(validation.initialValues) ===
                    JSON.stringify(validation.values) ||
                  !isActionPermitted("pendidikan:update")
                }
                startIcon={<SaveIcon />}
                loadingPosition="start"
                loading={validation.isSubmitting}
              >
                Simpan perubahan
              </LoadingButton>
            ) : (
              <LoadingButton
                type="submit"
                variant="contained"
                disabled={!isActionPermitted("pendidikan:store")}
                startIcon={<PlusIcon />}
                loadingPosition="start"
                loading={validation.isSubmitting}
              >
                Tambah Pendidikan
              </LoadingButton>
            )}
          </div>
        </form>
      </Paper>
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

export default Form;
