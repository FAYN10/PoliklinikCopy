import { useState, useEffect, forwardRef, useRef } from "react";
import { useRouter } from "next/router";
import { FocusError } from "focus-formik-error";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import LoadingButton from "@mui/lab/LoadingButton";
import PlusIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";
import BackIcon from "@material-ui/icons/ArrowBack";
import { parse } from "date-fns";
import DateTimePicker from "components/DateTimePicker";
import {
  formatReadable,
  formatIsoToGenTime,
  formatLabelDate,
} from "utils/formatTime";
import { useFormik } from "formik";
import * as Yup from "yup";
import Snackbar from "components/SnackbarMui";
import { stringSchema, phoneNumberSchema } from "utils/yupSchema";
import InputPhoneNumber from "components/InputPhoneNumber";
import SelectAsync from "components/SelectAsync";
import { getInsurance } from "api/general";
import { getListOptionPoliklinik } from "api/poliklinik";
import { getListOptionDoctor } from "api/doctor";
import {
  getPasienByNoRm,
  createRawatJalan,
  getListPasien,
  searchPasien,
} from "api/pasien";
import SpinnerMui from "components/SpinnerMui";
import FormRawatJalanTable from "components/modules/pasien/formRawatJalanTable";
import ReactToPrint from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

const pasienTableHead = [
  {
    id: "no_rm",
    label: "Nomor RM",
  },
  {
    id: "nama_pasien",
    label: "Nama",
  },
  {
    id: "alamat_domisili",
    label: "Alamat",
  },
];

const dummyRes = {
  agama: "6f47e989-9104-4e72-9a5e-54fae1810865",
  alamat_domisili: null,
  alamat_ktp: "a",
  asuransi: null,
  bahasa: null,
  created_at: "2022-12-03T13:03:22.000000Z",
  id: "a1045356-935d-4b2c-9579-e5b9f1b75736",
  jenis_kelamin: true,
  kabupaten_domisili: null,
  kabupaten_ktp: "PV0101",
  kecamatan_domisili: null,
  kecamatan_ktp: "PV010108",
  kelurahan_domisili: null,
  kelurahan_ktp: "PV01010801",
  kewarganegaraan: "Indonesia",
  kode_pos_domisili: null,
  kode_pos_ktp: null,
  nama_ibu: " ",
  nama_pasien: "tes popup",
  negara_domisili: null,
  nik: "1111111111111121",
  no_asuransi: null,
  no_passport: null,
  no_rm: "087523",
  nowa: "6212121",
  pasien_id_old: "122200010020",
  pekerjaan: "5b57d67b-c1cf-448b-ae4d-15d3b766adb6",
  pendidikan: "7db89cf8-cf38-41da-b974-e6a63353cf94",
  provinsi_domisili: null,
  provinsi_ktp: "PV01",
  rt_domisili: null,
  rt_ktp: null,
  rw_domisili: null,
  rw_ktp: null,
  status: "Janda/Duda",
  suami_istri: null,
  suku: null,
  tanggal_lahir: "2022-12-02T00:00:00.000000Z",
  telepon: "6212121",
  tempat_lahir: "a",
  umur: 0,
  updated_at: "2022-12-03T13:03:22.000000Z",
  user_id: "1",
};

const dataPasienFormatHandler = (payload) => {
  const result = payload.map((e) => {
    return {
      no_rm: e.no_rm || "",
      nama_pasien: e.nama_pasien || "",
      alamat_domisili: e.alamat_domisili || "",
      // hidden-data
      nik: e.nik || e.no_passport || "",
      tanggal_lahir: e.tanggal_lahir || "",
    };
  });
  return result;
};

const LabelToPrint = forwardRef(function LabelToPrint({ data }, ref) {
  return (
    <div ref={ref} className="printableContent">
      {/* 1cm = 37.8px */}
      {/* 1 mm: 3,78px  */}
      {/* def - w: 189px. h: 75.6px */}
      <div className="flex">
        <div
          className="font-10 flex p-4"
          style={{
            width: "189px",
            height: "75.6px",
            flexDirection: "column",
          }}
        >
          <div className="font-w-600">{data.no_rm || "-"}</div>
          <div className="font-w-600">{data.nik || "-"}</div>
          <div>{data.nama_pasien || "-"}</div>
          <div className="mt-auto">
            <span className="font-w-600">TGL LAHIR: </span>
            {formatLabelDate(data.tanggal_lahir) || "-"}
          </div>
        </div>
        <div
          className="font-10 flex p-4"
          style={{
            width: "189px",
            height: "75.6px",
            flexDirection: "column",
            marginLeft: "7.56px",
          }}
        >
          <div className="font-w-600">{data.no_rm || "-"}</div>
          <div className="font-w-600">{data.nik || "-"}</div>
          <div>{data.nama_pasien || "-"}</div>
          <div className="mt-auto">
            <span className="font-w-600">TGL LAHIR: </span>
            {formatLabelDate(data.tanggal_lahir) || "-"}
          </div>
        </div>
      </div>
    </div>
  );
});

const FormRawatJalan = ({
  isEditType = false,
  prePopulatedDataForm = {},
  detailPrePopulatedData = {},
  updatePrePopulatedData = () => "update data",
}) => {
  const router = useRouter();
  const [isPhoneChecked, setIsPhoneChecked] = useState(false);
  const [snackbar, setSnackbar] = useState({
    state: false,
    type: null,
    message: "",
  });
  const [dataPasien, setDataPasien] = useState([]);
  const [dataMetaPasien, setDataMetaPasien] = useState({});
  const [dataPasienPerPage, setDataPasienPerPage] = useState(8);
  const [isLoadingDataPasien, setIsLoadingDataPasien] = useState(false);
  const [isUpdatingDataPasien, setIsUpdatingDataPasien] = useState(false);
  const [isLoadingFurtherDetail, setIsLoadingFurtherDetail] = useState(false);
  const labelPrintRef = useRef();
  const [dialogLabelState, setDialogLabelState] = useState(false);
  const [labelData, setLabelData] = useState({
    nama_pasien: "",
    no_rm: "",
    nik: "",
    tanggal_lahir: "",
  });

  // table --data-pasien handler
  const initDataPasien = async () => {
    try {
      setIsLoadingDataPasien(true);
      const params = {
        per_page: dataPasienPerPage,
      };
      const response = await getListPasien(params);
      const result = dataPasienFormatHandler(response.data.data);
      setDataPasien(result);
      setDataMetaPasien(response.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataPasien(false);
    }
  };
  const updateDataPasienHandler = async (payload) => {
    try {
      setIsUpdatingDataPasien(true);
      const response = await getListPasien(payload);
      const result = dataPasienFormatHandler(response.data.data);
      setDataPasien(result);
      setDataMetaPasien(response.data.meta);
    } catch (error) {
      console.log(error);
      setSnackbar({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataPasien(false);
    }
  };
  const searchDataPasienHandler = async (payload) => {
    try {
      setIsUpdatingDataPasien(true);
      const response = await searchPasien({
        search: payload,
        per_page: dataPasienPerPage,
      });
      if (response.data.data.length !== 0) {
        const result = dataPasienFormatHandler(response.data.data);
        setDataPasien(result);
        setDataMetaPasien(response.data.meta);
      } else {
        setSnackbar({
          state: true,
          type: "warning",
          message: `${payload} tidak ditemukan`,
        });
        const response = await getListPasien({
          per_page: dataPasienPerPage,
        });
        const result = dataPasienFormatHandler(response.data.data);
        setDataPasien(result);
        setDataMetaPasien(response.data.meta);
      }
    } catch (error) {
      setSnackbar({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataPasien(false);
    }
  };

  // form --stuff
  const rawatJalanInitialValues = !isEditType
    ? {
        no_rm: "",
        name: "",
        telepon: "",
        no_wa: "",
        alamat: "",
        poli: { id: "", name: "" },
        asuransi: { id: "", name: "" },
        DR_ID: { DR_ID: "", NAME: "" },
        datetime_medis: null,
      }
    : prePopulatedDataForm;

  const createRawatJalanSchema = Yup.object({
    no_rm: Yup.string().required(
      "No RM akan terisi otomatis setelah memilih dari table"
    ),
    name: Yup.string().required(
      "Nama akan terisi otomatis setelah memilih dari table"
    ),
    telepon: phoneNumberSchema(true),
    no_wa: phoneNumberSchema(),
    alamat: stringSchema("Alamat", true),
    poli: Yup.object({
      id: stringSchema("Poliklinik", true),
    }),
    asuransi: Yup.object({
      id: stringSchema("Asuransi"),
    }),
    DR_ID: Yup.object({
      DR_ID: Yup.string().required(
        "Pilih poliklinik lebih dulu kemudian pilih dokter"
      ),
    }),
    datetime_medis: Yup.date()
      .transform(function (value, originalValue) {
        if (this.isType(value)) {
          return value;
        }
        const result = parse(originalValue, "dd/MM/yyyy", new Date());
        return result;
      })
      .typeError("Waktu periksa tidak valid")
      .min("1900-01-01", "Waktu periksa tidak valid")
      .required("Waktu periksa wajib diisi"),
  });

  const createRawatJalanValidation = useFormik({
    initialValues: rawatJalanInitialValues,
    validationSchema: createRawatJalanSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      let data = { ...values };
      if (data.no_wa !== "") {
        data.no_wa = data.no_wa.substring(1);
      }
      if (data.telepon !== "") {
        data.telepon = data.telepon.substring(1);
      }
      data = {
        ...data,
        datetime_medis: formatIsoToGenTime(values.datetime_medis),
        poli: data.poli.id,
        asuransi: data.asuransi.id,
        dr_id: data.DR_ID.DR_ID,
      };
      delete data.name;
      delete data.DR_ID;
      try {
        if (!isEditType) {
          await createRawatJalan(data);
          resetForm();
          setSnackbar({
            state: true,
            type: "success",
            message: `Berhasil menambahkan data!`,
          });
          setDialogLabelState(true);
        } else {
        }
      } catch (error) {
        console.log(error);
        setSnackbar({
          state: true,
          type: "error",
          message: `Terjadi kesalahan!`,
        });
      }
    },
  });

  const handlePhoneCheckbox = (value) => {
    setIsPhoneChecked(value);
    if (value) {
      createRawatJalanValidation.setFieldValue(
        "no_wa",
        createRawatJalanValidation.values.telepon
      );
    }
  };

  const onSelectedFromTable = (payload) => {
    setLabelData({
      nama_pasien: payload.nama_pasien || "-",
      no_rm: payload.no_rm || "-",
      nik: payload.nik || "-",
      tanggal_lahir: payload.tanggal_lahir || "-",
    });
    createRawatJalanValidation.setFieldValue("no_rm", payload.no_rm);
  };

  const getDetailPasienByNoRm = async (payload) => {
    try {
      setIsLoadingFurtherDetail(true);
      const response = await getPasienByNoRm({
        no_rm: payload,
      });
      if (response.data.data) {
        createRawatJalanValidation.setFieldValue(
          "name",
          response.data.data.NAME || ""
        );
        createRawatJalanValidation.setFieldValue(
          "telepon",
          response.data.data.TELEPHONE || ""
        );
        createRawatJalanValidation.setFieldValue(
          "no_wa",
          response.data.data.MOBILE || ""
        );
        createRawatJalanValidation.setFieldValue(
          "alamat",
          response.data.data.ADDRESS || ""
        );
      } else {
        throw new Error("no data found");
      }
    } catch (error) {
      console.log(error);
      setSnackbar({
        state: true,
        type: "warning",
        message: `Gagal mendapatkan detail lanjutan (alamat, no. telepon dan no. WA)`,
      });
    } finally {
      setIsLoadingFurtherDetail(false);
    }
  };

  useEffect(() => {
    if (createRawatJalanValidation.values.no_rm) {
      getDetailPasienByNoRm(createRawatJalanValidation.values.no_rm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createRawatJalanValidation.values.no_rm]);

  useEffect(() => {
    initDataPasien();
    console.log(router.query);
    if (router.query.initial_no_rm) {
      createRawatJalanValidation.setFieldValue(
        "no_rm",
        router.query.initial_no_rm
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          {isLoadingDataPasien ? (
            <div className="full-width flex justify-center">
              <SpinnerMui />
            </div>
          ) : (
            <FormRawatJalanTable
              tableHead={pasienTableHead}
              title="Pasien"
              data={dataPasien}
              meta={dataMetaPasien}
              dataPerPage={dataPasienPerPage}
              isUpdatingData={isUpdatingDataPasien}
              updateDataPerPage={(e) => {
                setDataPasienPerPage(e.target.value);
                updateDataPasienHandler({ per_page: e.target.value });
              }}
              updateDataNavigate={(payload) =>
                updateDataPasienHandler({
                  per_page: dataPasienPerPage,
                  cursor: payload,
                })
              }
              refreshData={() =>
                updateDataPasienHandler({ per_page: dataPasienPerPage })
              }
              deleteData={() => {}}
              selectData={(payload) => onSelectedFromTable(payload)}
              searchData={searchDataPasienHandler}
            />
          )}
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper sx={{ width: "100%", padding: 2, paddingTop: 3 }}>
            <form onSubmit={createRawatJalanValidation.handleSubmit}>
              <FocusError formik={createRawatJalanValidation} />
              <div className="mb-16">
                <TextField
                  disabled
                  fullWidth
                  id="no_rm"
                  name="no_rm"
                  label="No. Rekam medis"
                  value={createRawatJalanValidation.values.no_rm}
                  onChange={createRawatJalanValidation.handleChange}
                  error={
                    createRawatJalanValidation.touched.no_rm &&
                    Boolean(createRawatJalanValidation.errors.no_rm)
                  }
                  helperText={
                    createRawatJalanValidation.touched.no_rm &&
                    createRawatJalanValidation.errors.no_rm
                  }
                />
              </div>
              <div className="mb-16">
                <TextField
                  disabled
                  fullWidth
                  id="name"
                  name="name"
                  label="Nama pasien"
                  value={createRawatJalanValidation.values.name}
                  onChange={createRawatJalanValidation.handleChange}
                  error={
                    createRawatJalanValidation.touched.name &&
                    Boolean(createRawatJalanValidation.errors.name)
                  }
                  helperText={
                    createRawatJalanValidation.touched.name &&
                    createRawatJalanValidation.errors.name
                  }
                />
              </div>
              <div className="">
                <InputPhoneNumber
                  id="telepon"
                  labelField="No. telepon"
                  handlerRef={createRawatJalanValidation}
                  disabled={isLoadingFurtherDetail}
                />
              </div>
              <div className="flex items-center mb-14">
                <div className="font-14">Samakan dengan No. WA</div>
                <Checkbox
                  checked={isPhoneChecked}
                  onChange={(e) => handlePhoneCheckbox(e.target.checked)}
                  inputProps={{ "aria-label": "controlled" }}
                  disabled={isLoadingFurtherDetail}
                />
              </div>
              <div className="mb-16">
                <InputPhoneNumber
                  id="no_wa"
                  labelField="No WA"
                  handlerRef={createRawatJalanValidation}
                  disabled={isLoadingFurtherDetail}
                />
              </div>
              <div className="mb-16">
                <TextField
                  disabled={isLoadingFurtherDetail}
                  fullWidth
                  id="alamat"
                  name="alamat"
                  label="Alamat"
                  multiline
                  rows={4}
                  value={createRawatJalanValidation.values.alamat}
                  onChange={createRawatJalanValidation.handleChange}
                  error={
                    createRawatJalanValidation.touched.alamat &&
                    Boolean(createRawatJalanValidation.errors.alamat)
                  }
                  helperText={
                    createRawatJalanValidation.touched.alamat &&
                    createRawatJalanValidation.errors.alamat
                  }
                />
              </div>
              <div className="mb-16">
                <SelectAsync
                  id="asuransi"
                  labelField="Asuransi"
                  labelOptionRef="name"
                  valueOptionRef="id"
                  handlerRef={createRawatJalanValidation}
                  handlerFetchData={getInsurance}
                  handlerOnChange={(value) => {
                    if (value) {
                      createRawatJalanValidation.setFieldValue(
                        "asuransi",
                        value
                      );
                    } else {
                      createRawatJalanValidation.setFieldValue("asuransi", {
                        id: "",
                        name: "",
                      });
                    }
                  }}
                />
              </div>
              <div className="mb-16">
                <SelectAsync
                  id="poli"
                  labelField="Poliklinik"
                  labelOptionRef="name"
                  valueOptionRef="id"
                  handlerRef={createRawatJalanValidation}
                  handlerFetchData={getListOptionPoliklinik}
                  handlerOnChange={(value) => {
                    if (value) {
                      createRawatJalanValidation.setFieldValue("poli", value);
                    } else {
                      createRawatJalanValidation.setFieldValue("poli", {
                        id: "",
                        name: "",
                      });
                      createRawatJalanValidation.setFieldValue("DR_ID", {
                        DR_ID: "",
                        NAME: "",
                      });
                    }
                  }}
                />
              </div>
              <div className="mb-16">
                <SelectAsync
                  id="DR_ID"
                  labelField="Dokter"
                  labelOptionRef="NAME"
                  valueOptionRef="DR_ID"
                  isDisabled={!createRawatJalanValidation.values.poli?.id}
                  handlerRef={createRawatJalanValidation}
                  handlerFetchData={() =>
                    getListOptionDoctor({
                      poli_id: createRawatJalanValidation.values.poli.id,
                    })
                  }
                  handlerOnChange={(value) => {
                    if (value) {
                      createRawatJalanValidation.setFieldValue("DR_ID", value);
                    } else {
                      createRawatJalanValidation.setFieldValue("DR_ID", {
                        DR_ID: "",
                        NAME: "",
                      });
                    }
                  }}
                />
              </div>
              <div className="mb-16">
                <DateTimePicker
                  id="datetime_medis"
                  label="Waktu periksa"
                  handlerRef={createRawatJalanValidation}
                />
              </div>
              <div className="flex justify-end items-center mt-16">
                {isEditType && (
                  <div className="mr-auto text-grey-text">
                    <p className="font-14 font-w-600 m-0 p-0">
                      {detailPrePopulatedData?.nama_pasien},{" "}
                      {detailPrePopulatedData?.umur} tahun
                    </p>
                    <p className="font-12 font-w-600 m-0 p-0">
                      Nomor rekam medis:{" "}
                      {detailPrePopulatedData?.no_rm || "Tidak tersedia"}
                    </p>
                    <p className="font-12 font-w-600 m-0 p-0">
                      Dibuat pada:
                      {formatReadable(detailPrePopulatedData?.updated_at)}
                    </p>
                    <p className="font-12 font-w-600 m-0 p-0">
                      Perubahan terakhir:
                      {formatReadable(detailPrePopulatedData?.updated_at)}
                    </p>
                  </div>
                )}
                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<BackIcon />}
                  sx={{ marginRight: 2 }}
                  onClick={() =>
                    router.push(
                      {
                        pathname: "/pasien",
                        query: { active_content: 2 },
                      },
                      "/pasien"
                    )
                  }
                >
                  Kembali
                </Button>
                {isEditType ? (
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    disabled={
                      JSON.stringify(
                        createRawatJalanValidation.initialValues
                      ) === JSON.stringify(createRawatJalanValidation.values)
                    }
                    startIcon={<SaveIcon />}
                    loadingPosition="start"
                    loading={createRawatJalanValidation.isSubmitting}
                  >
                    Simpan perubahan
                  </LoadingButton>
                ) : (
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    startIcon={<PlusIcon />}
                    loadingPosition="start"
                    loading={createRawatJalanValidation.isSubmitting}
                  >
                    Simpan
                  </LoadingButton>
                )}
              </div>
            </form>
          </Paper>
        </Grid>
      </Grid>
      <Dialog
        open={dialogLabelState}
        onClose={(_, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") return;
          setDialogLabelState(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="px-8 py-16">
          <DialogContentText>Cetak label?</DialogContentText>
        </div>
        <DialogActions>
          <Button
            color="error"
            variant="outlined"
            onClick={() => setDialogLabelState(false)}
          >
            Batal
          </Button>
          <ReactToPrint
            trigger={() => (
              <Button
                color="success"
                variant="outlined"
                startIcon={<PrintIcon />}
              >
                Cetak Label
              </Button>
            )}
            content={() => labelPrintRef.current}
          />
          <LabelToPrint data={labelData} ref={labelPrintRef} />
        </DialogActions>
      </Dialog>
      <Snackbar
        state={snackbar.state}
        setState={setSnackbar}
        message={snackbar.message}
        isSuccessType={snackbar.type === "success"}
        isWarningType={snackbar.type === "warning"}
        isErrorType={snackbar.type === "error"}
      />
    </>
  );
};

export default FormRawatJalan;
