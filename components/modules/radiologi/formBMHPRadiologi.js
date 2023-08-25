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
import Grid from "@mui/material/Grid";
import DatePicker from "components/DatePicker";
import Snackbar from "components/SnackbarMui";
import { formatIsoToGen } from "utils/formatTime";
import { dateSchema, stringSchema, phoneNumberSchema } from "utils/yupSchema";
import useClientPermission from "custom-hooks/useClientPermission";
import {createBMHPRadiologi, updateBMHPRadiologi, getDetailBMHPRadiologi} from "api/radiologi";

    const FormBMHPRadiologi = ({
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

        const BMHPRadiologiInitialValue = !isEditType
        ?{
            namaBarang: "",
            jumlahBarang: "",
            waktuPemakaian: "",
        }
        :prePopulatedDataForm;

        const BMHPRadiologischema = Yup.object({
            namaBarang: stringSchema("Nama Barang", true),
            jumlahBarang: stringSchema("Jumlah Barang", true),
            waktuPemakaian: dateSchema("Waktu Pemakaian"),
        });

        const BMHPRadiologiValidation = useFormik({
            initialValues: BMHPRadiologiInitialValue,
            validationSchema: BMHPRadiologischema,
            enableReinitialize: true,
            onSubmit: async (values, {resetForm, setFieldError}) => {
                let messageContext = isEditType ? "diperbarui" : "ditambahkan";
                let formattedData = {...values};
                    formattedData = {
                      ...formattedData,
                      namaBarang: values.namaBarang,
                      jumlahBarang: values.jumlahBarang,
                      waktuPemakaian: formatIsoToGen(values.waktuPemakaian),
                    };
                let validData = {};
                for (let key in formattedData) {
                    if (formattedData[key]) {
                      validData[`${key}`] = formattedData[key];
                    }
                  }
                  try {
                    if (!isEditType) {
                      await createBMHPRadiologi(validData);
                      resetForm();
                    } else {
                      await updateBMHPRadiologi({ ...validData, id: detailPrePopulatedData.id });
                      const response = await getDetailBMHPRadiologi({
                        id: detailPrePopulatedData.id,
                      });
                      updatePrePopulatedData({ ...response.data.data });
                    }
                    setSnackbar({
                      state: true,
                      type: "success",
                      message: `"${validData.name}" berhasil ${messageContext}!`,
                    });
                  } catch (error) {
                    if (Object.keys(error.errorValidationObj).length >= 1) {
                      for (let key in error.errorValidationObj) {
                        setFieldError(key, error.errorValidationObj[key][0]);
                      }
                    }
                    setSnackbar({
                      state: true,
                      type: "error",
                      message: `Terjadi kesalahan, "${validData.name}" gagal ${messageContext}!`,
                    });
                  }
                },
              });
              return(
                <>
                <Paper sx={{ width: "100%", padding: 2, paddingTop: 3 }}>
        <div className="font-14 mb-14">
          <i>
            Catatan: Field bertanda{" "}
            <span className="font-w-700 font-16">*</span> wajib terisi
          </i>
        </div>
        <form onSubmit={BMHPRadiologiValidation.handleSubmit}>
          <FocusError formik={BMHPRadiologiValidation} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <div className="mb-16">
                <TextField
                  fullWidth
                  id="namaBarang"
                  name="namaBarang"
                  label="Nama Barang"
                  value={BMHPRadiologiValidation.values.nip}
                  onChange={BMHPRadiologiValidation.handleChange}
                  error={
                    BMHPRadiologiValidation.touched.nip &&
                    Boolean(BMHPRadiologiValidation.errors.nip)
                  }
                  helperText={
                    BMHPRadiologiValidation.touched.nip &&
                    BMHPRadiologiValidation.errors.nip
                  }
                />
              </div>
              <div className="mb-16">
                <TextField
                  fullWidth
                  id="jumlahBarang"
                  name="jumlahBarang"
                  label="Jumlah Barang *"
                  value={BMHPRadiologiValidation.values.name}
                  onChange={BMHPRadiologiValidation.handleChange}
                  error={
                    BMHPRadiologiValidation.touched.name &&
                    Boolean(BMHPRadiologiValidation.errors.name)
                  }
                  helperText={
                    BMHPRadiologiValidation.touched.name &&
                    BMHPRadiologiValidation.errors.name
                  }
                />
              </div>
              <div className="mb-16">
                <DatePicker
                  id="waktuPemakaian"
                  label="Waktu Pemakaian *"
                  handlerRef={BMHPRadiologiValidation}
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
              onClick={() => router.push("/bmhpradiologi")}
            >
              Kembali
            </Button>
            {isEditType ? (
              <LoadingButton
                type="submit"
                variant="contained"
                disabled={
                  JSON.stringify(BMHPRadiologiValidation.initialValues) ===
                    JSON.stringify(BMHPRadiologiValidation.values) ||
                  !isActionPermitted("bmhpradiologi:update")
                }
                startIcon={<SaveIcon />}
                loadingPosition="start"
                loading={BMHPRadiologiValidation.isSubmitting}
              >
                Simpan perubahan
              </LoadingButton>
            ) : (
              <LoadingButton
                type="submit"
                variant="contained"
                disabled={!isActionPermitted("bmhpradiologi:store")}
                startIcon={<PlusIcon />}
                loadingPosition="start"
                loading={BMHPRadiologiValidation.isSubmitting}
              >
                Tambah BMHP Radiologi
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


export default FormBMHPRadiologi;
