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
import { createUser } from "api/user";
// import { createUser, updateUser, getDetailUser } from "api/user";
import SelectMultiple from "components/SelectMultiple";
import SelectAsync from "components/SelectAsync";
import { getListOptionEmployee } from "api/employee";
import { getListRole } from "api/role";
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
        username: "",
        email: "",
        password: "",
        password_confirm: "",
        roles: [],
        employee_id: { id: "", name: "" },
      }
    : prePopulatedDataForm;

  const schema = Yup.object({
    username: stringSchema("Username", true),
    email: Yup.string()
      .email("Masukan email yang valid")
      .required("Wajib diisi"),
    password: Yup.string().min(8, "Minimal 8 karakter").required("Wajib diisi"),
    password_confirm: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Password harus sama"
    ),
    roles: Yup.array().min(1, "Minimal pilih 1 role").required("Wajib diisi"),
    employee_id: Yup.object({
      id: stringSchema("Karyawan", true),
    }),
  });

  const validation = useFormik({
    initialValues: initialValue,
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      let messageContext = isEditType ? "diperbarui" : "ditambahkan";
      let data = {
        ...values,
        roles: values.roles.map((e) => e.id),
        employee_id: values.employee_id.id,
      };
      delete data.password_confirm;
      try {
        if (!isEditType) {
          await createUser(data);
          resetForm();
        } else {
          // await updateUser({ ...data, id: detailPrePopulatedData.id });
          // const response = await getDetailUser({
          //   id: detailPrePopulatedData.id,
          // });
          // updatePrePopulatedData({ ...response.data.data });
        }
        setSnackbar({
          state: true,
          type: "success",
          message: `"${values.username}" berhasil ${messageContext}!`,
        });
      } catch (error) {
        console.log(error);
        setSnackbar({
          state: true,
          type: "error",
          message: `Terjadi kesalahan, "${values.username}" gagal ${messageContext}!`,
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
                id="username"
                name="username"
                label="Username"
                autoComplete="off"
                value={validation.values.username}
                onChange={validation.handleChange}
                error={
                  validation.touched.username &&
                  Boolean(validation.errors.username)
                }
                helperText={
                  validation.touched.username && validation.errors.username
                }
              />
            </Grid>
            <Grid item md={12}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                autoComplete="new-username"
                value={validation.values.email}
                onChange={validation.handleChange}
                error={
                  validation.touched.email && Boolean(validation.errors.email)
                }
                helperText={validation.touched.email && validation.errors.email}
              />
            </Grid>
            <Grid item md={12}>
              <SelectAsync
                id="employee_id"
                valueOptionRef="id"
                labelOptionRef="name"
                labelField="Karyawan"
                handlerFetchData={getListOptionEmployee}
                handlerRef={validation}
                handlerOnChange={(value) => {
                  if (value) {
                    validation.setFieldValue("employee_id", value);
                  } else {
                    validation.setFieldValue("employee_id", {
                      id: "",
                      name: "",
                    });
                  }
                }}
              />
            </Grid>
            <Grid item md={12}>
              <SelectMultiple
                id="roles"
                labelField="Roles"
                labelOptionRef="name"
                handlerRef={validation}
                handlerFetchData={getListRole}
              />
            </Grid>
            <Grid item md={12}>
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
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
                id="password_confirm"
                name="password_confirm"
                label="Konfirmasi password"
                type="password"
                autoComplete="new-password"
                value={validation.values.password_confirm}
                onChange={validation.handleChange}
                error={
                  validation.touched.password_confirm &&
                  Boolean(validation.errors.password_confirm)
                }
                helperText={
                  validation.touched.password_confirm &&
                  validation.errors.password_confirm
                }
              />
            </Grid>
          </Grid>
          <div className="mt-16 flex justify-end items-center">
            <Button
              type="button"
              variant="outlined"
              startIcon={<BackIcon />}
              sx={{ marginRight: 2 }}
              onClick={() => router.push("/user")}
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
                  !isActionPermitted("user:update")
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
                disabled={!isActionPermitted("user:store")}
                startIcon={<PlusIcon />}
                loadingPosition="start"
                loading={validation.isSubmitting}
              >
                Tambah Pengguna
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
