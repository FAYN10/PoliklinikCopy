import { useRouter } from "next/router";
import FormRawatInapTable from "components/modules/pasien/formRawatInapTable";
import Spinner from "components/SpinnerMui";
import { getListRawatJalanDataForm } from "api/rawat-jalan";
import { useEffect, useState } from "react";
import { Grid, Paper, TextField, Button } from "@mui/material";
import Snackbar from "components/SnackbarMui";
import { FocusError } from "focus-formik-error";
import { useFormik } from "formik";
import * as Yup from "yup";
import SelectAsync from "components/SelectAsync";
import { createRawatInap } from "api/rawat-inap";
import { getListKelasRawatInapForm } from "api/kelas";
import { getListKamarRawatInapForm } from "api/kamar";
import { getListOptionDoctor } from "api/doctor";
import { getInsurance } from "api/general";
import DateTimePickerComp from "components/DateTimePicker";
import LoadingButton from "@mui/lab/LoadingButton";
import PlusIcon from "@material-ui/icons/Add";
import BackIcon from "@material-ui/icons/ArrowBack";
import { stringSchema } from "utils/yupSchema";
import { parse } from "date-fns";
import { formatIsoToGenTime } from "utils/formatTime";
import FormRawatInapTableHeader from "components/modules/pasien/formRawatInapTableHeader";

const rawatJalanTableHead = [
  {
    id: "no_rm",
    label: "Nomor RM",
  },
  {
    id: "nama",
    label: "Nama",
  },
  {
    id: "poliklinik",
    label: "Poliklinik",
  },
  {
    id: "dokter",
    label: "Dokter",
  },
];

const dataRawatJalanFormatHandler = (payload) => {
  const result = payload.map((e) => {
    return {
      no_rm: e.no_rm || "",
      nama: e.nama || "",
      poliklinik: e.poliklinik || "",
      dokter: e.dokter || "",
      medis_id: e.medis_id || "",
      alamat: e.alamat || "",
    };
  });
  return result;
};

const FormRawatInap = () => {
  const router = useRouter();
  // form pasien --rawat-jalan state
  const [dataRawatJalan, setDataRawatJalan] = useState([]);
  const [dataMetaRawatJalan, setDataMetaRawatJalan] = useState({});
  const [dataRawatJalanPerPage, setDataRawatJalanPerPage] = useState(8);
  const [isLoadingDataRawatJalan, setIsLoadingDataRawatJalan] = useState(false);
  const [isUpdatingDataRawatJalan, setIsUpdatingDataRawatJalan] =
    useState(false);

  // table --rawat-jalan handler
  const initDataRawatJalan = async () => {
    try {
      setIsLoadingDataRawatJalan(true);
      const params = {
        per_page: dataRawatJalanPerPage,
      };
      const response = await getListRawatJalanDataForm(params);
      const result = dataRawatJalanFormatHandler(response.data.data);
      setDataRawatJalan(result);
      setDataMetaRawatJalan(response.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataRawatJalan(false);
    }
  };
  const updateDataRawatJalanHandler = async (payload) => {
    try {
      setIsUpdatingDataRawatJalan(true);
      const response = await getListRawatJalanDataForm(payload);
      const result = dataRawatJalanFormatHandler(response.data.data);
      setDataRawatJalan(result);
      setDataMetaRawatJalan(response.data.meta);
    } catch (error) {
      console.log(error);
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataRawatJalan(false);
    }
  };

  const onSelectedFromTable = (payload) => {
    createPasienValidation.setFieldValue("no_rm", payload.no_rm);
    createPasienValidation.setFieldValue("nama", payload.nama);
    createPasienValidation.setFieldValue("alamat", payload.alamat);
    createPasienValidation.setFieldValue("DPJP", payload.dokter);
    createPasienValidation.setFieldValue("medis_id", payload.medis_id);
  };

  // form --stuff
  const pasienInitialValues = {
    no_rm: "",
    nama: "",
    alamat: "",
    diagnosa: "",
    kelas: { KELAS_ID: "", NAME: "" },
    kamar_id: { KAMAR_ID: "", KELAS_ID: "", NAME: "" },
    asuransi: { id: "", name: "" },
    datetime_in: null,
    DPJP: "",
    alasan_dirawat: "",
    medis_id: "",
    dr_in: { DR_ID: "", NAME: "" },
  };

  const createPasienSchema = Yup.object({
    no_rm: Yup.string().required("No. RM wajib terisi"),
    nama: Yup.string().required("Nama wajib terisi"),
    alamat: Yup.string().required("Alamat wajib terisi"),
    diagnosa: Yup.string().required("Diagnosa wajib terisi"),
    kelas: Yup.object({
      KELAS_ID: stringSchema("Kelas", true),
    }),
    kamar_id: Yup.object({
      KAMAR_ID: stringSchema("Kamar", true),
    }),
    asuransi: Yup.object({
      id: stringSchema("Asuransi", true),
    }),
    datetime_in: Yup.date()
      .transform(function (value, originalValue) {
        if (this.isType(value)) {
          return value;
        }
        const result = parse(originalValue, "dd/MM/yyyy", new Date());
        return result;
      })
      .typeError("Waktu masuk tidak valid")
      .min("1900-01-01", "Waktu masuk tidak valid")
      .required("Waktu masuk wajib diisi"),
    DPJP: Yup.string().required("Dokter pengirim wajib terisi"),
    alasan_dirawat: Yup.string().required("Alasan wajib terisi"),
    medis_id: Yup.string().required("medis_id wajib terisi"),
    dr_in: Yup.object({
      DR_ID: stringSchema("DPJP", true),
    }),
  });

  const createPasienValidation = useFormik({
    initialValues: pasienInitialValues,
    validationSchema: createPasienSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        let data = {
          ...values,
          kamar_id: values.kamar_id.KAMAR_ID,
          asuransi: values.asuransi.id,
          datetime_in: formatIsoToGenTime(values.datetime_in),
          dr_in: values.dr_in.DR_ID,
        };
        // temp --like-postman
        delete data.alamat;
        delete data.kelas;
        delete data.rujukan;
        delete data.nama;
        console.log("send this", data);
        //
        await createRawatInap(data);
        resetForm();
        setSnackbarState({
          state: true,
          type: "success",
          message: `berhasil`,
        });
      } catch (error) {
        console.log(error);
        setSnackbarState({
          state: true,
          type: "error",
          message: `Terjadi kesalahan!`,
        });
      }
    },
  });

  const [snackbarState, setSnackbarState] = useState({
    state: false,
    type: null,
    message: "",
  });

  useEffect(() => {
    initDataRawatJalan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          {isLoadingDataRawatJalan ? (
            <div className="full-width flex justify-center">
              <Spinner />
            </div>
          ) : (
            <FormRawatInapTable
              isCustomHeader
              customHeader={
                <>
                  {/* note -> what is been managed here is data rawat jalan! */}
                  <FormRawatInapTableHeader
                    refreshData={(payload) =>
                      updateDataRawatJalanHandler({
                        ...payload,
                        per_page: dataRawatJalanPerPage,
                      })
                    }
                  />
                </>
              }
              title="Pasien rawat jalan"
              tableHead={rawatJalanTableHead}
              data={dataRawatJalan}
              meta={dataMetaRawatJalan}
              dataPerPage={dataRawatJalanPerPage}
              isUpdatingData={isUpdatingDataRawatJalan}
              updateDataPerPage={(e) => {
                setDataRawatJalanPerPage(e.target.value);
                updateDataRawatJalanHandler({ per_page: e.target.value });
              }}
              updateDataNavigate={(payload) =>
                updateDataRawatJalanHandler({
                  per_page: dataRawatJalanPerPage,
                  cursor: payload,
                })
              }
              refreshData={() =>
                updateDataRawatJalanHandler({ per_page: dataRawatJalanPerPage })
              }
              deleteData={() => {}}
              selectData={(payload) => onSelectedFromTable(payload)}
            />
          )}
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper sx={{ width: "100%", padding: 2, paddingTop: 3 }}>
            <form onSubmit={createPasienValidation.handleSubmit}>
              <FocusError formik={createPasienValidation} />
              <div className="mb-16">
                <TextField
                  disabled
                  fullWidth
                  id="no_rm"
                  name="no_rm"
                  label="No. Rekam medis"
                  value={createPasienValidation.values.no_rm}
                  onChange={createPasienValidation.handleChange}
                  error={
                    createPasienValidation.touched.no_rm &&
                    Boolean(createPasienValidation.errors.no_rm)
                  }
                  helperText={
                    createPasienValidation.touched.no_rm &&
                    createPasienValidation.errors.no_rm
                  }
                />
              </div>
              <div className="mb-16">
                <TextField
                  disabled
                  fullWidth
                  id="nama"
                  name="nama"
                  label="Nama"
                  value={createPasienValidation.values.nama}
                  onChange={createPasienValidation.handleChange}
                  error={
                    createPasienValidation.touched.nama &&
                    Boolean(createPasienValidation.errors.nama)
                  }
                  helperText={
                    createPasienValidation.touched.nama &&
                    createPasienValidation.errors.nama
                  }
                />
              </div>
              <div className="mb-16">
                <TextField
                  disabled
                  fullWidth
                  id="alamat"
                  name="alamat"
                  label="Alamat"
                  value={createPasienValidation.values.alamat}
                  onChange={createPasienValidation.handleChange}
                  error={
                    createPasienValidation.touched.alamat &&
                    Boolean(createPasienValidation.errors.alamat)
                  }
                  helperText={
                    createPasienValidation.touched.alamat &&
                    createPasienValidation.errors.alamat
                  }
                />
              </div>
              <div className="mb-16">
                <TextField
                  disabled
                  fullWidth
                  id="DPJP"
                  name="DPJP"
                  label="Dokter pengirim"
                  value={createPasienValidation.values.DPJP}
                  onChange={createPasienValidation.handleChange}
                  error={
                    createPasienValidation.touched.DPJP &&
                    Boolean(createPasienValidation.errors.DPJP)
                  }
                  helperText={
                    createPasienValidation.touched.DPJP &&
                    createPasienValidation.errors.DPJP
                  }
                />
              </div>
              <div className="mb-16">
                <TextField
                  fullWidth
                  id="diagnosa"
                  name="diagnosa"
                  label="Diagnosa masuk"
                  value={createPasienValidation.values.diagnosa}
                  onChange={createPasienValidation.handleChange}
                  error={
                    createPasienValidation.touched.diagnosa &&
                    Boolean(createPasienValidation.errors.diagnosa)
                  }
                  helperText={
                    createPasienValidation.touched.diagnosa &&
                    createPasienValidation.errors.diagnosa
                  }
                />
              </div>
              <div className="mb-16">
                <SelectAsync
                  id="kelas"
                  labelField="Kelas"
                  labelOptionRef="NAME"
                  valueOptionRef="KELAS_ID"
                  handlerRef={createPasienValidation}
                  handlerFetchData={getListKelasRawatInapForm}
                  handlerOnChange={(value) => {
                    if (value) {
                      createPasienValidation.setFieldValue("kelas", value);
                    } else {
                      createPasienValidation.setFieldValue("kelas", {
                        KELAS_ID: "",
                        NAME: "",
                      });
                      createPasienValidation.setFieldValue("kamar_id", {
                        KAMAR_ID: "",
                        KELAS_ID: "",
                        NAME: "",
                      });
                    }
                  }}
                />
              </div>
              <div className="mb-16">
                <SelectAsync
                  id="kamar_id"
                  labelField="No. Kamar"
                  labelOptionRef="NAME"
                  valueOptionRef="KAMAR_ID"
                  handlerRef={createPasienValidation}
                  handlerFetchData={() =>
                    getListKamarRawatInapForm({
                      kelas_id: createPasienValidation.values.kelas.KELAS_ID,
                    })
                  }
                  handlerOnChange={(value) => {
                    if (value) {
                      createPasienValidation.setFieldValue("kamar_id", value);
                    } else {
                      createPasienValidation.setFieldValue("kamar_id", {
                        KAMAR_ID: "",
                        KELAS_ID: "",
                        NAME: "",
                      });
                    }
                  }}
                  isDisabled={
                    createPasienValidation.values.kelas.KELAS_ID === ""
                  }
                />
              </div>
              <div className="mb-16">
                <SelectAsync
                  id="asuransi"
                  labelField="Asuransi"
                  labelOptionRef="name"
                  valueOptionRef="id"
                  handlerRef={createPasienValidation}
                  handlerFetchData={() => getInsurance()}
                  handlerOnChange={(value) => {
                    if (value) {
                      createPasienValidation.setFieldValue("asuransi", value);
                    } else {
                      createPasienValidation.setFieldValue("asuransi", {
                        id: "",
                        name: "",
                      });
                    }
                  }}
                />
              </div>
              <div className="mb-16">
                <DateTimePickerComp
                  id="datetime_in"
                  label="Jam masuk"
                  handlerRef={createPasienValidation}
                />
              </div>
              <div className="mb-16">
                <SelectAsync
                  id="dr_in"
                  labelField="DPJP"
                  labelOptionRef="NAME"
                  valueOptionRef="DR_ID"
                  handlerRef={createPasienValidation}
                  handlerFetchData={getListOptionDoctor}
                  handlerOnChange={(value) => {
                    if (value) {
                      createPasienValidation.setFieldValue("dr_in", value);
                    } else {
                      createPasienValidation.setFieldValue("dr_in", {
                        DR_ID: "",
                        NAME: "",
                      });
                    }
                  }}
                />
              </div>
              <div className="mb-16">
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  id="alasan_dirawat"
                  name="alasan_dirawat"
                  label="Alasan dirawat"
                  value={createPasienValidation.values.alasan_dirawat}
                  onChange={createPasienValidation.handleChange}
                  error={
                    createPasienValidation.touched.alasan_dirawat &&
                    Boolean(createPasienValidation.errors.alasan_dirawat)
                  }
                  helperText={
                    createPasienValidation.touched.alasan_dirawat &&
                    createPasienValidation.errors.alasan_dirawat
                  }
                />
              </div>
              <div className="flex justify-end items-center mt-16">
                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<BackIcon />}
                  sx={{ marginRight: 2 }}
                  onClick={() =>
                    router.push(
                      {
                        pathname: "/pasien",
                        query: { active_content: 3 },
                      },
                      "/pasien"
                    )
                  }
                >
                  Kembali
                </Button>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  startIcon={<PlusIcon />}
                  loadingPosition="start"
                  loading={createPasienValidation.isSubmitting}
                >
                  Simpan
                </LoadingButton>
              </div>
            </form>
          </Paper>
        </Grid>
      </Grid>
      <Snackbar
        state={snackbarState.state}
        setState={(payload) =>
          setSnackbarState({
            state: payload,
            type: null,
            message: "",
          })
        }
        message={snackbarState.message}
        isSuccessType={snackbarState.type === "success"}
        isErrorType={snackbarState.type === "error"}
        isWarningType={snackbarState.type === "warning"}
      />
    </>
  );
};

export default FormRawatInap;
