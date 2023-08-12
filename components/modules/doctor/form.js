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
import { createDoctor, updateDoctor, getDetailDoctor } from "api/doctor";
import { getListOptionEmployee } from "api/employee";
import { getListPoliklinik } from "api/poliklinik";
import { statusPPA, statusAktif } from "public/static/data";
import { formatIsoToGen } from "utils/formatTime";
import useClientPermission from "custom-hooks/useClientPermission";

const FormDoctor = ({
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

  const doctorInitialValue = !isEditType
    ? {
        employee_id: { id: "", name: "" },
        poliklinik_id: { id: "", name: "" },
        status_aktif: { name: "", value: "" },
        no_sip: "",
        tgl_expired_sip: null,
        status_ppa: { name: "", value: "" },
      }
    : prePopulatedDataForm;

  const doctorSchema = Yup.object({
    employee_id: Yup.object({
      id: stringSchema("Karyawan", true),
    }),
    poliklinik_id: Yup.object({
      id: stringSchema("Poliklinik", true),
    }),
    status_aktif: Yup.object({
      value: Yup.boolean("Pilih status").required("Status wajib diisi"),
    }),
    no_sip: stringSchema("Nomor SIP", true),
    tgl_expired_sip: dateSchema("Tanggal kadaluarsa SIP"),
    status_ppa: Yup.object({
      value: stringSchema("Status PPA", true),
    }),
  });

  const doctorValidation = useFormik({
    initialValues: doctorInitialValue,
    validationSchema: doctorSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      let messageContext = isEditType ? "diperbarui" : "ditambahkan";
      let data = {
        employee_id: values.employee_id.id,
        poliklinik_id: values.poliklinik_id.id,
        status_aktif: values.status_aktif.value,
        no_sip: values.no_sip,
        tgl_expired_sip: formatIsoToGen(values.tgl_expired_sip),
        status_ppa: values.status_ppa.value,
      };
      try {
        if (!isEditType) {
          await createDoctor(data);
          resetForm();
        } else {
          await updateDoctor({ ...data, id: detailPrePopulatedData.id });
          const response = await getDetailDoctor({
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
        <form onSubmit={doctorValidation.handleSubmit}>
          <FocusError formik={doctorValidation} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <div className="mb-16">
                <SelectAsync
                  id="employee_id"
                  labelField="Karyawan"
                  labelOptionRef="name"
                  labelOptionSecondRef="id"
                  valueOptionRef="id"
                  handlerRef={doctorValidation}
                  handlerFetchData={getListOptionEmployee}
                  handlerOnChange={(value) => {
                    if (value) {
                      doctorValidation.setFieldValue("employee_id", value);
                    } else {
                      doctorValidation.setFieldValue("employee_id", {
                        id: "",
                        name: "",
                      });
                    }
                  }}
                />
              </div>
              <div className="mb-16">
                <SelectAsync
                  id="poliklinik_id"
                  labelField="Poliklinik"
                  labelOptionRef="name"
                  valueOptionRef="id"
                  handlerRef={doctorValidation}
                  handlerFetchData={getListPoliklinik}
                  handlerOnChange={(value) => {
                    if (value) {
                      doctorValidation.setFieldValue("poliklinik_id", value);
                    } else {
                      doctorValidation.setFieldValue("poliklinik_id", {
                        id: "",
                        name: "",
                      });
                    }
                  }}
                />
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className="mb-16">
                <SelectStatic
                  id="status_aktif"
                  handlerRef={doctorValidation}
                  label="Status"
                  options={statusAktif}
                />
              </div>
              <div className="mb-16">
                <TextField
                  fullWidth
                  id="no_sip"
                  name="no_sip"
                  label="Nomor SIP"
                  value={doctorValidation.values.no_sip}
                  onChange={doctorValidation.handleChange}
                  error={
                    doctorValidation.touched.no_sip &&
                    Boolean(doctorValidation.errors.no_sip)
                  }
                  helperText={
                    doctorValidation.touched.no_sip &&
                    doctorValidation.errors.no_sip
                  }
                />
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className="mb-16">
                <DatePicker
                  id="tgl_expired_sip"
                  label="Tanggal kadaluarsa SIP"
                  handlerRef={doctorValidation}
                />
              </div>
              <div className="mb-16">
                <SelectStatic
                  id="status_ppa"
                  handlerRef={doctorValidation}
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
              onClick={() => router.push("/doctor")}
            >
              Kembali
            </Button>
            {isEditType ? (
              <LoadingButton
                type="submit"
                variant="contained"
                disabled={
                  JSON.stringify(doctorValidation.initialValues) ===
                    JSON.stringify(doctorValidation.values) ||
                  !isActionPermitted("doctor:update")
                }
                startIcon={<SaveIcon />}
                loadingPosition="start"
                loading={doctorValidation.isSubmitting}
              >
                Simpan perubahan
              </LoadingButton>
            ) : (
              <LoadingButton
                type="submit"
                variant="contained"
                disabled={!isActionPermitted("doctor:store")}
                startIcon={<PlusIcon />}
                loadingPosition="start"
                loading={doctorValidation.isSubmitting}
              >
                Tambah Dokter
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

export default FormDoctor;
