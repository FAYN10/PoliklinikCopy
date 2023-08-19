import React from "react";
import { Grid, TextField, Button, MenuItem, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";

const FormAssessmentPetugas = () => {
  const initialValues = {
    namaPemeriksaan: "",
    jenisPemeriksaan: "",
    persiapanPemeriksaan: [],
  };

  const validationSchema = Yup.object({
    namaPemeriksaan: Yup.string().required("Nama pemeriksaan wajib dipilih"),
    jenisPemeriksaan: Yup.string().required("Jenis pemeriksaan wajib diisi"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      // Add your submission logic here
    },
  });

  const namaPemeriksaanOptions = ["X-RAY", "CT Scan", "USG", "MRI", "APPENDICOGRAM", "BNO", "HSG"];

  const persiapanPemeriksaanOptions = {
    APPENDICOGRAM: [
      "Pasien minum Barium Sulfat (BaSO4)",
    ],
    USG: [
      "Puasa makan 6 jam sebelum pemeriksaan",
      "Selama puasa dianjurkan banyak minum air putih",
      "30 menit sebelum pemeriksaan USG minum ± 3 gelas air putih, lalu tahan kencing",
    ],
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-16">
            <TextField
              fullWidth
              select
              id="namaPemeriksaan"
              name="namaPemeriksaan"
              label="Nama Pemeriksaan"
              value={formik.values.namaPemeriksaan}
              onChange={formik.handleChange}
              error={formik.touched.namaPemeriksaan && Boolean(formik.errors.namaPemeriksaan)}
              helperText={formik.touched.namaPemeriksaan && formik.errors.namaPemeriksaan}
            >
              {namaPemeriksaanOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className="mb-16">
            <TextField
              fullWidth
              id="jenisPemeriksaan"
              name="jenisPemeriksaan"
              label="Jenis Pemeriksaan"
              value={formik.values.jenisPemeriksaan}
              onChange={formik.handleChange}
              error={formik.touched.jenisPemeriksaan && Boolean(formik.errors.jenisPemeriksaan)}
              helperText={formik.touched.jenisPemeriksaan && formik.errors.jenisPemeriksaan}
            />
          </div>
          <div className="mb-16">
            <FormGroup>
              {persiapanPemeriksaanOptions[formik.values.namaPemeriksaan]?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      value={option}
                      checked={formik.values.persiapanPemeriksaan.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          formik.setFieldValue(
                            "persiapanPemeriksaan",
                            formik.values.persiapanPemeriksaan.concat(option)
                          );
                        } else {
                          formik.setFieldValue(
                            "persiapanPemeriksaan",
                            formik.values.persiapanPemeriksaan.filter((item) => item !== option)
                          );
                        }
                      }}
                    />
                  }
                  label={option}
                />
              ))}
            </FormGroup>
          </div>
          
        </form>
      </Grid>
      <Grid container justifyContent="center" spacing={2}>
          <Grid item>
            <LoadingButton
              type="submit"
              variant="contained"
              color="success"
              startIcon={<SaveIcon />}
              loading={formik.isSubmitting}
            >
              SIMPAN
            </LoadingButton>
          </Grid>
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
        </Grid>
    </Grid>
  );
};

export default FormAssessmentPetugas;
