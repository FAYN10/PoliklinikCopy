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
import SelectAsync from "components/SelectAsync";
import SelectStatic from "components/SelectStatic";
import DatePicker from "components/DatePicker";
import { stringSchema, dateSchema } from "utils/yupSchema";
import { createSuster, updateSuster, getDetailSuster } from "api/suster";
import { getListOptionEmployee } from "api/employee";
import { statusPPA, statusAktif } from "public/static/data";
import { formatIsoToGen } from "utils/formatTime";
import useClientPermission from "custom-hooks/useClientPermission";

const FormSuster = ({
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

  const susterInitialValue = !isEditType
    ? {
        employee_id: { id: "", name: "" },
        status_aktif: { name: "", value: "" },
        no_str: "",
        tgl_expired_str: null,
        status_ppa: { name: "", value: "" },
      }
    : prePopulatedDataForm;

  const susterSchema = Yup.object({
    employee_id: Yup.object({
      id: stringSchema("Karyawan", true),
    }),
    status_aktif: Yup.object({
      value: Yup.boolean("Pilih status").required("Status wajib diisi"),
    }),
    no_str: stringSchema("Nomor STR", true),
    tgl_expired_str: dateSchema("Tanggal kadaluarsa STR"),
    status_ppa: Yup.object({
      value: stringSchema("Status PPA", true),
    }),
  });

  const susterValidation = useFormik({
    initialValues: susterInitialValue,
    validationSchema: susterSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      let messageContext = isEditType ? "diperbarui" : "ditambahkan";
      let data = {
        employee_id: values.employee_id.id,
        status_aktif: values.status_aktif.value,
        no_str: values.no_str,
        tgl_expired_str: formatIsoToGen(values.tgl_expired_str),
        status_ppa: values.status_ppa.value,
      };
      try {
        if (!isEditType) {
          await createSuster(data);
          resetForm();
        } else {
          await updateSuster({ ...data, id: detailPrePopulatedData.id });
          const response = await getDetailSuster({
            id: detailPrePopulatedData.id,
          });
          updatePrePopulatedData({ ...response.data.data });
        }
        setSnackbar({
          state: true,
          type: "success",
          message: `"${values.employee_id.name}" berhasil ${messageContext}!`,
        });
      } catch (error) {
        console.log(error);
        setSnackbar({
          state: true,
          type: "error",
          message: `Terjadi kesalahan, "${values.employee_id.name}" gagal ${messageContext}!`,
        });
      }
    },
  });

  return (
    <>
      <Paper sx={{ width: "100%", padding: 2, paddingTop: 3 }}>
        <form onSubmit={susterValidation.handleSubmit}>
          <FocusError formik={susterValidation} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <div className="mb-16">
                <SelectAsync
                  id="employee_id"
                  labelField="Karyawan"
                  labelOptionRef="name"
                  labelOptionSecondRef="id"
                  valueOptionRef="id"
                  handlerRef={susterValidation}
                  handlerFetchData={getListOptionEmployee}
                  handlerOnChange={(value) => {
                    if (value) {
                      susterValidation.setFieldValue("employee_id", value);
                    } else {
                      susterValidation.setFieldValue("employee_id", {
                        id: "",
                        name: "",
                      });
                    }
                  }}
                />
              </div>
              <div className="mb-16">
                <SelectStatic
                  id="status_aktif"
                  handlerRef={susterValidation}
                  label="Status"
                  options={statusAktif}
                />
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className="mb-16">
                <TextField
                  fullWidth
                  id="no_str"
                  name="no_str"
                  label="Nomor STR"
                  value={susterValidation.values.no_str}
                  onChange={susterValidation.handleChange}
                  error={
                    susterValidation.touched.no_str &&
                    Boolean(susterValidation.errors.no_str)
                  }
                  helperText={
                    susterValidation.touched.no_str &&
                    susterValidation.errors.no_str
                  }
                />
              </div>
              <div className="mb-16">
                <DatePicker
                  id="tgl_expired_str"
                  label="Tanggal kadaluarsa STR"
                  handlerRef={susterValidation}
                />
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className="mb-16">
                <SelectStatic
                  id="status_ppa"
                  handlerRef={susterValidation}
                  label="Status PPA"
                  options={statusPPA}
                />
              </div>
            </Grid>
          </Grid>
          <div className="mt-16 flex justify-end items-center">
            <Button
              type="button"
              variant="outlined"
              startIcon={<BackIcon />}
              sx={{ marginRight: 2 }}
              onClick={() => router.push("/suster")}
            >
              Kembali
            </Button>
            {isEditType ? (
              <LoadingButton
                type="submit"
                variant="contained"
                disabled={
                  JSON.stringify(susterValidation.initialValues) ===
                    JSON.stringify(susterValidation.values) ||
                  !isActionPermitted("suster:update")
                }
                startIcon={<SaveIcon />}
                loadingPosition="start"
                loading={susterValidation.isSubmitting}
              >
                Simpan perubahan
              </LoadingButton>
            ) : (
              <LoadingButton
                type="submit"
                variant="contained"
                disabled={!isActionPermitted("suster:store")}
                startIcon={<PlusIcon />}
                loadingPosition="start"
                loading={susterValidation.isSubmitting}
              >
                Tambah Perawat
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

export default FormSuster;
