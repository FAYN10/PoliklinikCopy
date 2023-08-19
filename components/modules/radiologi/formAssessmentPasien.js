import { useEffect, useState } from "react";
import { Grid, Paper, TextField, Button, MenuItem, Dialog,
DialogTitle,
DialogContent, } from "@mui/material";
import DateTimePickerComp from "components/DateTimePicker";
import { useFormik } from "formik";
import * as Yup from "yup";
import LoadingButton from "@mui/lab/LoadingButton";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import UpdateIcon from "@material-ui/icons/Update";

const FormAssessmentPasien = () => {
  // form --stuff
  const initialValues = {
    metodePenyampaianHasil: "",
    noWhatsapp: "",
    email: "",
    diambil: null,
    statusAlergi: "",
    statusKehamilan: "",
    waktuPemeriksaan: null,
  };

  const validationSchema = Yup.object({
    metodePenyampaianHasil: Yup.string().required("Metode wajib dipilih"),
    noWhatsapp: Yup.string().when("metodePenyampaianHasil", {
      is: "WhatsApp",
      then: Yup.string()
        .matches(/^[0-9]+$/, "Nomor WhatsApp hanya boleh mengandung angka")
        .required("Nomor WhatsApp wajib diisi"),
    }),
    email: Yup.string().when("metodePenyampaianHasil", {
      is: "Email",
      then: Yup.string()
        .email("Email tidak valid")
        .required("Email wajib diisi"),
    }),diambil: Yup.string().when("metodePenyampaianHasil", {
      is: "Tanggal Diambil",
      then: Yup.date().required("Tanggal diambil wajib diisi"),
    }),
    statusAlergi: Yup.string().required("Status alergi wajib dipilih"),
    statusKehamilan: Yup.string().required("Status kehamilan wajib dipilih"),
 
    waktuPemeriksaan: Yup.date().required("Waktu pemeriksaan wajib diisi"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {

      console.log(values);
    },
  });

  const metodePenyampaianHasilOptions = ["WhatsApp", "Email", "Diambil"];
  const statusAlergiOptions = ["Ada", "Tidak Ada"];
  const statusKehamilanOptions = ["Ada", "Tidak Ada"];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-16">
            <TextField
              fullWidth
              id="noWhatsapp"
              name="noWhatsapp"
              label="No. WhatsApp"
              value={formik.values.noWhatsapp}
              onChange={formik.handleChange}
              error={formik.touched.noWhatsapp && Boolean(formik.errors.noWhatsapp)}
              helperText={formik.touched.noWhatsapp && formik.errors.noWhatsapp}
            />
          </div>
          <div className="mb-16">
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </div>
          <div className="mb-16">
            <DateTimePickerComp
              id="diambil"
              label="Tanggal Diambil"
              handlerRef={formik}
            />
          </div>
          
        </form>
      </Grid>
      <Grid item xs={12} md={6}>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-16">
            <TextField
              fullWidth
              select
              id="statusAlergi"
              name="statusAlergi"
              label="Status Alergi"
              value={formik.values.statusAlergi}
              onChange={formik.handleChange}
              error={formik.touched.statusAlergi && Boolean(formik.errors.statusAlergi)}
              helperText={formik.touched.statusAlergi && formik.errors.statusAlergi}
            >
              {statusAlergiOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className="mb-16">
            <TextField
              fullWidth
              select
              id="statusKehamilan"
              name="statusKehamilan"
              label="Status Kehamilan"
              value={formik.values.statusKehamilan}
              onChange={formik.handleChange}
              error={formik.touched.statusKehamilan && Boolean(formik.errors.statusKehamilan)}
              helperText={formik.touched.statusKehamilan && formik.errors.statusKehamilan}
            >
              {statusKehamilanOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </div><div className="mb-16">
            <DateTimePickerComp
              id="waktuPemeriksaan"
              label="Waktu Pemeriksaan"
              handlerRef={formik}
            />
          </div>
        </form><Grid item xs={12} md={12}>
        <Grid container justifyContent="right" spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => {
                console.log("Cancel button clicked");
              }}
            >
              BATAL
            </Button>
          </Grid>
          <Grid item>
            <LoadingButton
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              loading={formik.isSubmitting}
            >
              SIMPAN
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
      
      </Grid>
    </Grid>
  );
};

export default FormAssessmentPasien;