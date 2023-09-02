import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Grid, Paper, TextField, Button, MenuItem, Dialog,
  DialogTitle,
  DialogContent, DialogActions, FormControlLabel
} from "@mui/material";
import DateTimePickerComp from "components/DateTimePicker";
import { useFormik } from "formik";
import * as Yup from "yup";
import LoadingButton from "@mui/lab/LoadingButton";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import { stringSchema, dateSchema, phoneNumberSchema } from "utils/yupSchema";
import InputPhoneNumber from "components/InputPhoneNumber";
import EditIcon from "@material-ui/icons/Edit";
import Switch from "@mui/material/Switch";
import useClientPermission from "custom-hooks/useClientPermission";
import Snackbar from "components/SnackbarMui";
import {getListAsesmenPasienRadiologi, createAsesmenPasienRadiologi, updateAsesmenPasienRadiologi, getDetailAsesmenPasienRadiologi} from "api/radiologi";
import { formatIsoToGen } from "utils/formatTime";
import { statusAlergi, statusKehamilan } from "public/static/data";

import SelectStatic from "components/SelectStatic";


const FormAssessmentPasien = ({  
  data,
  isEditType = false,
  prePopulatedDataForm = {},
  detailPrePopulatedData = {},
  updatePrePopulatedData = () => "update data",}) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const { isActionPermitted } = useClientPermission();
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbar, setSnackbar] = useState({
    state: false,
    type: null,
    message: "",
  });
  const [dataAssessmentPasienRadiologiPerPage, setAssessmentPasienRadiologiPerPage] = useState(8);
  const [
    isLoadingDataAssessmentPasienRadiologi,
    setIsLoadingDataAssessmentPasienRadiologi,
  ] = useState(false);
  const [
    isUpdatingDataAssessmentPasienRadiologi,
    setIsUpdatingDataAssessmentPasienRadiologi,
  ] = useState(false);
  const [sortedData, setSortedData] = useState([]);
  const initDataAssessmentPasienRadiologi = async () => {
    try {
      setIsLoadingDataAssessmentPasienRadiologi(true);
      const params = {
        per_page: dataAssessmentPasienRadiologiPerPage,
      };
      const response = await getListAsesmenPasienRadiologi(params);
      const result = dataAssessmentPasienRadiologiFormatHandler(response.data.data);
      // setDataPermintaanRadiologi(result);
      setDataMetaAssessmentPasienRadiologi(response.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataAssessmentPasienRadiologi(false);
    }
  };

  const updateDataAssessmentPasienRadiologiHandler = async (payload) => {
    try {
      setIsUpdatingDataAssessmentPasienRadiologi(true);
      const response = await getListAsesmenPasienRadiologi(payload);
      const result = dataAssessmentPasienRadiologiFormatHandler(response.data.data);
      // setDataPermintaanRadiologi(result);
      setDataMetaAssessmentPasienRadiologi(response.data.meta);
    } catch (error) {
      console.log(error);
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataAssessmentPasienRadiologi(false);
    }
  };

  // ASSESSMENT PASIEN 
  const [dataAssessmentPasienRadiologi, setDataAssessmentPasienRadiologi] = useState({});
  const [dataMetaAssessmentPasienRadiologi, setDataMetaAssessmentPasienRadiologi] = useState({});
  const [detailDatAssessmentPasienRadiologi, setDetailDataAssessmentPasienRadiologi] = useState(
    {}
  );





  // const handleConfirm = () => {
  //   if (confirmAction === "save") {
  //     AssessmentPasienValidation.handleSubmit()
  //       .then(() => {
  //         // Submission was successful
  //         setSnackbarMessage("Data berhasil disimpan.");
  //         setIsSnackbarOpen(true);
  //       })
  //       .catch((error) => {
  //         // Handle submission error
  //         setSnackbarMessage("Gagal menyimpan data.");
  //         setIsSnackbarOpen(true);
  //       });
  //   } else if (confirmAction === "cancel") {
  //     console.log("Canceling action...");
  //   }
  //   handleCloseDialog();
  // };
  const handleIsEditingMode = (e) => {
    setIsEditingMode(e.target.checked);
  };
  const handleOpenDialog = (action) => {
    setIsDialogOpen(true);
    setConfirmAction(action);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setConfirmAction(null);
  };

  const handleConfirm = () => {
    if (confirmAction === "save") {

      console.log("Saving data...");
      AssessmentPasienValidation.handleSubmit();
    } else if (confirmAction === "cancel") {

      console.log("Canceling action...");
    }
    handleCloseDialog();
  };

  const AssessmentPasienInitialValues = !isEditType
  ?  {
    no_wa: "",
    email: "",
    diambil: null,
    status_alergi: { name: "", value: "" },
    status_kehamilan:{ name: "", value: "" },
    waktu_pemeriksaan: null,
  }: prePopulatedDataForm;

  const AssessmentPasienSchema = Yup.object({
    no_wa: phoneNumberSchema(),
    email: Yup.string().email("Email tidak valid"),
    diambil: dateSchema("Tanggal Pengambilan"),
    status_alergi: Yup.object({
      value: stringSchema("Status alergi", true),
    }),
    status_kehamilan: Yup.object({
      value: stringSchema("Status kehamilan", true),
    }),
    waktu_pemeriksaan: dateSchema("Waktu Pemeriksaan"),
  });

  const AssessmentPasienValidation = useFormik({
    initialValues: AssessmentPasienInitialValues,
    validationSchema: AssessmentPasienSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      let messageContext = isEditType ? "diperbarui" : "ditambahkan";
      let data = {
        no_wa: values.no_wa,
        email: values.email,
        diambil: formatIsoToGen(values.diambil),
        status_alergi: values.status_alergi,
        status_kehamilan: values.status_kehamilan,
        waktu_pemeriksaan: formatIsoToGen(values.waktu_pemeriksaan),
      };
      try {
        if (!isEditType) {
          await createAsesmenPasienRadiologi(data);
          resetForm();
        } else {
          await updateAsesmenPasienRadiologi({ ...data, id: detailPrePopulatedData.id });
          const response = await getDetailAsesmenPasienRadiologi({
            id: detailPrePopulatedData.id,
          });
          updatePrePopulatedData({ ...response.data.data });
        }
        setSnackbar({
          state: true,
          type: "success",
          message: `"Assessment Pasien berhasil ${messageContext}!`,
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
          message: `Terjadi kesalahan, Assessment Pasien gagal ${messageContext}!`,
        });
      }
    },
  });



  
  return (
    <Grid container spacing={2}>
      <Grid container justifyContent="flex-end" spacing={2} sx={{ marginTop: "12px", marginRight: "12px" }}>
        <FormControlLabel control={ <Grid item>
          <Switch
            checked={isEditingMode}
            onChange={handleIsEditingMode}
            inputProps={{ "aria-label": "controlled" }}
            disabled={!isActionPermitted("asesmenpasienradiologi:update")}
          >
            Edit Data
          </Switch>
        </Grid>}>

        </FormControlLabel>
       
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper
          elevation={3}
          sx={{
            padding: "16px",
            mb: "16px",
            mt: "16px",
            opacity: isEditingMode ? 1 : 0.5,
          }}
        >
          <form onSubmit={AssessmentPasienValidation.handleSubmit}>
            <div className="mb-16">
              <TextField
                fullWidth
                id="no_wa"
                name="no_wa"
                label="No. WhatsApp"
                value={AssessmentPasienValidation.values.noWhatsapp}
                onChange={AssessmentPasienValidation.handleChange}
                error={AssessmentPasienValidation.touched.noWhatsapp && Boolean(AssessmentPasienValidation.errors.noWhatsapp)}
                helperText={AssessmentPasienValidation.touched.noWhatsapp && AssessmentPasienValidation.errors.noWhatsapp}
                disabled={!isEditingMode}
              />
            </div>
            <div className="mb-16">
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={AssessmentPasienValidation.values.email}
                onChange={AssessmentPasienValidation.handleChange}
                error={AssessmentPasienValidation.touched.email && Boolean(AssessmentPasienValidation.errors.email)}
                helperText={AssessmentPasienValidation.touched.email && AssessmentPasienValidation.errors.email}
                disabled={!isEditingMode}
              />
            </div>
            <div className="mb-16">
              <DateTimePickerComp
                id="diambil"
                label="Tanggal Diambil"
                handlerRef={AssessmentPasienValidation}
                disabled={!isEditingMode}
              />
            </div>
          </form>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper
          elevation={3}
          sx={{
            padding: "16px",
            mb: "16px", // Add margin-bottom for spacing
            mt: "16px", // Add margin-top for spacing
          }}
        >
          <form onSubmit={AssessmentPasienValidation.handleSubmit}>
            <div className="mb-16">
            <SelectStatic
                  id="status_alergi"
                  handlerRef={AssessmentPasienValidation}
                  label="Status Alergi"
                  options={statusAlergi}
                  disabled={!isEditingMode}
                />
            </div>
            <div className="mb-16">
            <SelectStatic
                  id="status_kehamilan"
                  handlerRef={AssessmentPasienValidation}
                  label="Status Kehamilan"
                  options={statusKehamilan}
                  disabled={!isEditingMode}
                />
            </div>
            <div className="mb-16">
              <DateTimePickerComp
                id="waktu_pemeriksaan"
                label="Waktu Pemeriksaan"
                handlerRef={AssessmentPasienValidation}
                disabled={!isEditingMode}
              />
            </div>
          </form>

        </Paper>
      </Grid>
      <Grid item xs={12} md={12}>
        <Grid container justifyContent="flex-end" spacing={2} sx={{ marginBottom: "16px" }}>
          <Grid item>
            <Button
              variant="contained"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => handleOpenDialog("cancel")}
              disabled={!isEditingMode} 
            >
              BATAL
            </Button>
          </Grid>
          <Grid item>
            <LoadingButton
              type="button"
              variant="contained"
              startIcon={<SaveIcon />}
              loading={AssessmentPasienValidation.isSubmitting}
              onClick={() => handleOpenDialog("save")}
              disabled={!isEditingMode || !isActionPermitted("asesmenpasienradiologi:store")}
            >
              SIMPAN
            </LoadingButton>
          </Grid>
        </Grid>
        <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
          <DialogContent>
            {confirmAction === "save" && <p>Simpan data Assessment Pasien?</p>}
            {confirmAction === "cancel" && <p>Batal mengubah data Assessment Pasien?</p>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              TIDAK
            </Button>
            <Button onClick={handleConfirm} color="primary">
              YA
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
      <Snackbar
        state={snackbar.state}
        setState={setSnackbar}
        message={snackbar.message}
        isSuccessType={snackbar.type === "success"}
        isErrorType={snackbar.type === "error"}
      />
    </Grid>
  );
};

export default FormAssessmentPasien;