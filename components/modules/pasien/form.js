import { useState, forwardRef, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { FocusError } from "focus-formik-error";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import PlusIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";
import BackIcon from "@material-ui/icons/ArrowBack";
import { parse } from "date-fns";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import {
  formatIsoToGen,
  formatGenToIso,
  formatReadable,
  formatLabelDate,
} from "utils/formatTime";
import { useFormik } from "formik";
import * as Yup from "yup";
import SelectCountry from "components/SelectCountry";
import SelectRegion from "components/SelectRegion";
import Snackbar from "components/SnackbarMui";
import { createPasien, updatePasien, getDetailPasien } from "api/pasien";
import { getProvince, getCity, getDistrict, getVillage } from "api/wilayah";
import { getListBahasa } from "api/bahasa";
import { getListSuku } from "api/suku";
import { stringSchema, phoneNumberSchema } from "utils/yupSchema";
import InputPhoneNumber from "components/InputPhoneNumber";
import SelectStatic from "components/SelectStatic";
import SelectAsync from "components/SelectAsync";
import { maritalStatusDeep } from "public/static/data";
import {
  getReligion,
  getEducation,
  getProfession,
  getInsurance,
  getVclaim,
} from "api/general";
import PrintIcon from "@mui/icons-material/Print";
import ReactToPrint from "react-to-print";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import useClientPermission from "custom-hooks/useClientPermission";
import { filterFalsyValue } from "utils/helper";
import Checkbox from "@mui/material/Checkbox";
import DialogConfirmPasien from "components/modules/pasien/DialogConfirmFormPasien";

const LabelToPrint = forwardRef(function LabelToPrint({ data }, ref) {
  return (
    <div ref={ref} className="printableContent">
      {/* 1cm = 37.8px */}
      {/* 1 mm: 3,78px  */}
      {/* def - w: 189px. h: 75.6px */}
      <div className="flex">
        <div
          className="flex px-4 pb-6"
          style={{
            width: "189px",
            height: "75.2px",
            flexDirection: "column",
            fontSize: '9px'
          }}
        >
          <div className="font-w-600">{data.no_rm || "-"}</div>
          <div className="font-w-600">{data.nik || "-"}</div>
          <div>{data.nama_pasien.length > 28 ? data.nama_pasien.substring(0, 28) + '...' : data.nama_pasien}</div>
          <div className="mt-auto">
            <span className="font-w-600">TGL LAHIR: </span>
            {formatLabelDate(data.tanggal_lahir) || "-"}
          </div>
        </div>
        <div
          className="font-10 flex px-4 pb-6"
          style={{
            width: "189px",
            height: "75.2px",
            flexDirection: "column",
            fontSize: '9px',
            marginLeft: "7.56px",
          }}
        >
          <div className="font-w-600">{data.no_rm || "-"}</div>
          <div className="font-w-600">{data.nik || "-"}</div>
          <div>{data.nama_pasien.length > 28 ? data.nama_pasien.substring(0, 28) + '...' : data.nama_pasien}</div>
          <div className="mt-auto">
            <span className="font-w-600">TGL LAHIR: </span>
            {formatLabelDate(data.tanggal_lahir) || "-"}
          </div>
        </div>
      </div>
    </div>
  );
});

const CheckupToPrint = forwardRef(function CheckupToPrint({ data }, ref) {
  return (
    <div ref={ref} className="printableContent">
      <div className="m-8">
        <div className="font-w-600">
          <div className="font-18">RSU MITRA PARAMEDIKA</div>
          <div style={{ maxWidth: "250px" }}>
            Jl. Raya Ngemplak, Kemasan, Widodomartani, Ngemplak, Sleman
          </div>
        </div>
        <div className="font-w-600 mt-24">{data.no_rm || "-"}</div>
      </div>
    </div>
  );
});

const FormPasien = ({
  isEditType = false,
  prePopulatedDataForm = {},
  detailPrePopulatedData = {},
  updatePrePopulatedData = () => "update data",
  handleClose = () => {},
}) => {
  const router = useRouter();
  const { isActionPermitted } = useClientPermission();
  const labelPrintRef = useRef();
  const checkupPrintRef = useRef();
  const [snackbar, setSnackbar] = useState({
    state: false,
    type: null,
    message: "",
  });
  const [isSetSameAddressChecked, setIsSetSameAddressChecked] = useState(false);
  const [isPhoneChecked, setIsPhoneChecked] = useState(false);
  const [dialogConfirmToRawatJalan, setConfrimToRawatJalan] = useState({
    state: false,
    noRm: null,
  });
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [isLoadingVclaim, setIsLoadingVclaim] = useState(false);

  const handleIsEditingMode = (e) => {
    setIsEditingMode(e.target.checked);
  };

  const handleSetSameAddressChange = (e) => {
    setIsSetSameAddressChecked(e.target.checked);
    if (e.target.checked) {
      createPasienValidation.values.alamat_domisili =
        createPasienValidation.values.alamat_ktp;
      createPasienValidation.values.provinsi_domisili =
        createPasienValidation.values.provinsi_ktp;
      createPasienValidation.values.kabupaten_domisili =
        createPasienValidation.values.kabupaten_ktp;
      createPasienValidation.values.kecamatan_domisili =
        createPasienValidation.values.kecamatan_ktp;
      createPasienValidation.values.kelurahan_domisili =
        createPasienValidation.values.kelurahan_ktp;
      createPasienValidation.values.rt_domisili =
        createPasienValidation.values.rt_ktp;
      createPasienValidation.values.rw_domisili =
        createPasienValidation.values.rw_ktp;
      createPasienValidation.values.kode_pos_domisili =
        createPasienValidation.values.kode_pos_ktp;
    }
  };

  const handlePhoneCheckbox = (value) => {
    setIsPhoneChecked(value);
    if (value) {
      createPasienValidation.setFieldValue(
        "nowa",
        createPasienValidation.values.telepon
      );
    }
  };

  const pasienInitialValues = !isEditType
    ? {
        nama_pasien: "",
        jenis_kelamin: "",
        tempat_lahir: "",
        tanggal_lahir: null,
        kewarganegaraan: { code: "", label: "" },
        showNik: false,
        no_passport: "",
        nik: "",
        alamat_domisili: "",
        provinsi_domisili: { kode: "", nama: "" },
        kabupaten_domisili: { kode: "", nama: "" },
        kecamatan_domisili: { kode: "", nama: "" },
        kelurahan_domisili: { kode: "", nama: "" },
        rt_domisili: "",
        rw_domisili: "",
        kode_pos_domisili: "",
        alamat_ktp: "",
        provinsi_ktp: { kode: "", nama: "" },
        kabupaten_ktp: { kode: "", nama: "" },
        kecamatan_ktp: { kode: "", nama: "" },
        kelurahan_ktp: { kode: "", nama: "" },
        rt_ktp: "",
        rw_ktp: "",
        kode_pos_ktp: "",
        telepon: "",
        nowa: "",
        status: { id: "", value: "" },
        agama: { id: "", name: "" },
        pendidikan: { id: "", name: "" },
        pekerjaan: { id: "", name: "" },
        nama_ibu: "",
        asuransi: { id: "", name: "" },
        suku: { id: "", name: "" },
        bahasa: { id: "", name: "" },
      }
    : prePopulatedDataForm;

  const createPasienSchema = Yup.object({
    nama_pasien: Yup.string().required("Nama pasien wajib diisi"),
    jenis_kelamin: Yup.boolean().required("Jenis kelamin wajib diisi"),
    tempat_lahir: Yup.string().required("Tempat lahir wajib diisi"),
    tanggal_lahir: Yup.date()
      .transform(function (value, originalValue) {
        if (this.isType(value)) {
          return value;
        }
        const result = parse(originalValue, "dd/MM/yyyy", new Date());
        return result;
      })
      .typeError("Tanggal lahir tidak valid")
      .min("1900-01-01", "Tanggal lahir tidak valid")
      .required("Tanggal lahir wajib diisi"),
    kewarganegaraan: Yup.object({
      code: Yup.string().required("Kewarganegaraan wajib dipilih"),
    }),
    showNik: Yup.boolean(),
    no_passport: Yup.string()
      .matches(/^[0-9]+$/, "Wajib angka")
      .min(7, "Minimal 7 digit")
      .when("showNik", {
        is: false,
        then: Yup.string().required("Passport wajib diisi"),
      }),
    nik: Yup.string()
      .matches(/^[0-9]+$/, "Wajib angka")
      .min(16, "Wajib 16 digit")
      .max(16, "Wajib 16 digit")
      .when("showNik", {
        is: true,
        then: Yup.string().required("NIK Wajib diisi"),
      }),
    alamat_domisili: stringSchema("Alamat domisili"),
    provinsi_domisili: Yup.object({
      kode: Yup.string(),
    }),
    kabupaten_domisili: Yup.object({
      kode: Yup.string(),
    }),
    kecamatan_domisili: Yup.object({
      kode: Yup.string(),
    }),
    kelurahan_domisili: Yup.object({
      kode: Yup.string(),
    }),
    rt_domisili: stringSchema("RT domisili"),
    rw_domisili: stringSchema("RW domisili"),
    kode_pos_domisili: stringSchema("Kode pos domisili"),
    alamat_ktp: stringSchema("Alamat ktp", true),
    provinsi_ktp: Yup.object({
      kode: Yup.string().required("Provinsi ktp wajib dipilih"),
    }),
    kabupaten_ktp: Yup.object({
      kode: Yup.string().required(
        "Kabupaten ktp wajib dipilih, setelah memeilih Provinsi"
      ),
    }),
    kecamatan_ktp: Yup.object({
      kode: Yup.string().required(
        "Kecamatan ktp wajib dipilih, setelah memilih Kota/kab"
      ),
    }),
    kelurahan_ktp: Yup.object({
      kode: Yup.string().required(
        "Kelurahan/Desa ktp wajib dipilih, setelah memilih Kecamatan"
      ),
    }),
    rt_ktp: stringSchema("RT ktp"),
    rw_ktp: stringSchema("RW ktp"),
    kode_pos_ktp: stringSchema("Kode pos ktp"),
    telepon: phoneNumberSchema(true),
    nowa: phoneNumberSchema(),
    status: Yup.object({
      value: stringSchema("Status", true),
    }),
    agama: Yup.object({
      id: stringSchema("Agama", true),
    }),
    pendidikan: Yup.object({
      id: stringSchema("Pendidikan", true),
    }),
    pekerjaan: Yup.object({
      id: stringSchema("Pekerjaan", true),
    }),
    nama_ibu: stringSchema("Nama ibu"),
    asuransi: Yup.object({
      id: stringSchema("Asuransi"),
    }),
    suku: Yup.object({
      id: stringSchema("Suku"),
    }),
    bahasa: Yup.object({
      id: stringSchema("Bahasa"),
    }),
  });

  const createPasienValidation = useFormik({
    initialValues: pasienInitialValues,
    validationSchema: createPasienSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm, setFieldError }) => {
      let messageContext = isEditType ? "diperbarui" : "ditambahkan";
      let data = { ...values };
      if (data.nowa !== "") {
        data.nowa = data.nowa.substring(1);
      }
      if (data.telepon !== "") {
        data.telepon = data.telepon.substring(1);
      }
      if (values.showNik) {
        delete data.no_passport;
      } else {
        delete data.nik;
      }
      delete data.showNik;
      data = {
        ...data,
        kewarganegaraan: data.kewarganegaraan.label,
        provinsi_domisili: data.provinsi_domisili.kode,
        kabupaten_domisili: data.kabupaten_domisili.kode,
        kecamatan_domisili: data.kecamatan_domisili.kode,
        kelurahan_domisili: data.kelurahan_domisili.kode,
        provinsi_ktp: data.provinsi_ktp.kode,
        kabupaten_ktp: data.kabupaten_ktp.kode,
        kecamatan_ktp: data.kecamatan_ktp.kode,
        kelurahan_ktp: data.kelurahan_ktp.kode,
        tanggal_lahir: formatIsoToGen(data.tanggal_lahir),
        status: data.status.value,
        agama: data.agama.id,
        pendidikan: data.pendidikan.id,
        pekerjaan: data.pekerjaan.id,
        asuransi: data.asuransi.id,
        suku: data.suku.id,
        bahasa: data.bahasa.id,
      };
      const formattedData = filterFalsyValue({ ...data });
      let quickFixGender =
        data.jenis_kelamin !== "" ? data.jenis_kelamin : null;
      if (quickFixGender !== null) {
        formattedData.jenis_kelamin = quickFixGender;
      }
      try {
        let response;
        if (!isEditType) {
          response = await createPasien(formattedData);
          resetForm();
        } else {
          await updatePasien({
            ...formattedData,
            id: detailPrePopulatedData.id,
          });
          response = await getDetailPasien({
            id: detailPrePopulatedData.id,
          });
          updatePrePopulatedData({ ...response.data.data });
        }
        setSnackbar({
          state: true,
          type: "success",
          message: `"${data.nama_pasien}" berhasil ${messageContext}!`,
        });
        setIsSetSameAddressChecked(false);
        setIsPhoneChecked(false);
        if (!isEditType) {
          setConfrimToRawatJalan({
            state: true,
            noRm: response.data.data.no_rm,
          });
        }
      } catch (error) {
        if (Object.keys(error.errorValidationObj).length >= 1) {
          for (let key in error.errorValidationObj) {
            setFieldError(key, error.errorValidationObj[key][0]);
          }
        }
        setSnackbar({
          state: true,
          type: "error",
          message: `Terjadi kesalahan, "${data.nama_pasien}" gagal ${messageContext}!`,
        });
      }
    },
  });

  useEffect(() => {
    let tempPasienName = createPasienValidation.values.nama_pasien;
    tempPasienName = tempPasienName.toLowerCase();
    function autoFillRules() {
      if (
        tempPasienName.includes("mr. x") ||
        tempPasienName.includes("ms. x") ||
        tempPasienName.includes("mrs. x")
      ) {
        return true;
      }
      return false;
    }
    if (autoFillRules()) {
      if (
        tempPasienName.includes("ms. x") ||
        tempPasienName.includes("mrs. x")
      ) {
        createPasienValidation.setFieldValue("jenis_kelamin", false);
      } else if (tempPasienName.includes("mr. x")) {
        createPasienValidation.setFieldValue("jenis_kelamin", true);
      }
      createPasienValidation.setFieldValue("tempat_lahir", "Yogyakarta");
      createPasienValidation.setFieldValue("tanggal_lahir", new Date());
      createPasienValidation.setFieldValue("kewarganegaraan", {
        code: "ID",
        label: "Indonesia",
      });
      createPasienValidation.setFieldValue("showNik", true);
      createPasienValidation.setFieldValue("nik", "1111111111111111");
      createPasienValidation.setFieldValue("telepon", "082211111111");
      createPasienValidation.setFieldValue("nowa", "082211111111");
      createPasienValidation.setFieldValue("alamat_ktp", "Yogyakarta");
      createPasienValidation.setFieldValue("provinsi_ktp", {
        kode: "PV14",
        nama: "DI YOGYA",
      });
      createPasienValidation.setFieldValue("kabupaten_ktp", {
        kode: "PV1402",
        nama: "SLEMAN",
      });
      createPasienValidation.setFieldValue("kecamatan_ktp", {
        kode: "PV140211",
        nama: "NGEMPLAK",
      });
      createPasienValidation.setFieldValue("kelurahan_ktp", {
        kode: "PV14021103",
        nama: "Widodomartani",
      });
      createPasienValidation.setFieldValue("status", {
        name: "Single",
        value: "Single",
      });
      createPasienValidation.setFieldValue("pekerjaan", {
        id: "142cae7d-800e-4d23-a922-5d8d30924c31",
        name: "Lain-lain",
      });
      createPasienValidation.setFieldValue("agama", {
        id: "a269f390-48f6-4953-b8b2-7a3774fe4dd1",
        name: "None",
      });
      createPasienValidation.setFieldValue("pendidikan", {
        id: "e179ecfb-76a9-43b9-93b9-4a98f876e744",
        name: "None",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createPasienValidation.values.nama_pasien]);

  useEffect(() => {
    if (
      createPasienValidation.values.showNik &&
      createPasienValidation.values.nik &&
      createPasienValidation.values.nik.length === 16
    ) {
      (async () => {
        try {
          if (isLoadingVclaim || isEditType) return;
          setIsLoadingVclaim(true);
          const response = await getVclaim({
            nik: createPasienValidation.values.nik,
          });
          const { data } = response.data;
          createPasienValidation.setFieldValue("nama_pasien", data.nama);
          if (data.sex === "L") {
            createPasienValidation.setFieldValue("jenis_kelamin", true);
          } else {
            createPasienValidation.setFieldValue("jenis_kelamin", false);
          }
          createPasienValidation.setFieldValue(
            "tanggal_lahir",
            data.tglLahir ? formatGenToIso(data.tglLahir) : null
          );
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoadingVclaim(false);
        }
      })();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createPasienValidation.values.nik]);

  return (
    <>
      <Paper sx={{ width: "100%", padding: 2, paddingTop: 3 }}>
        {isEditType ? (
          <div className="flex justify-end mb-40">
            <FormControlLabel
              control={
                <Switch
                  checked={isEditingMode}
                  onChange={handleIsEditingMode}
                  inputProps={{ "aria-label": "controlled" }}
                  disabled={!isActionPermitted("pasien:update")}
                />
              }
              label="Ubah data"
            />
          </div>
        ) : null}
        <form onSubmit={createPasienValidation.handleSubmit}>
          <FocusError formik={createPasienValidation} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <div className="mb-16">
                <SelectCountry
                  id="kewarganegaraan"
                  name="kewarganegaraan"
                  labelField="Kewarganegaraan"
                  handlerRef={createPasienValidation}
                  handlerOnChange={(payload) => {
                    if (payload) {
                      if (payload.label === "Indonesia") {
                        createPasienValidation.setFieldValue("showNik", true);
                      } else {
                        createPasienValidation.setFieldValue("showNik", false);
                      }
                      createPasienValidation.setFieldValue(
                        "kewarganegaraan",
                        payload
                      );
                      return;
                    }
                    createPasienValidation.setFieldValue("showNik", false);
                    createPasienValidation.setFieldValue("kewarganegaraan", {
                      code: "",
                      label: "",
                    });
                  }}
                  disabled={isEditType && !isEditingMode}
                />
              </div>
              {createPasienValidation.values.showNik ? (
                <div className="mb-16">
                  <TextField
                    fullWidth
                    id="nik"
                    name="nik"
                    label="NIK"
                    value={createPasienValidation.values.nik}
                    onChange={createPasienValidation.handleChange}
                    error={
                      createPasienValidation.touched.nik &&
                      Boolean(createPasienValidation.errors.nik)
                    }
                    helperText={
                      createPasienValidation.touched.nik &&
                      createPasienValidation.errors.nik
                    }
                    disabled={Boolean(
                      (isEditType && !isEditingMode) || isLoadingVclaim
                    )}
                  />
                </div>
              ) : (
                <div className="mb-16">
                  <TextField
                    fullWidth
                    id="no_passport"
                    name="no_passport"
                    label="Passport"
                    value={createPasienValidation.values.no_passport}
                    onChange={createPasienValidation.handleChange}
                    error={
                      createPasienValidation.touched.no_passport &&
                      Boolean(createPasienValidation.errors.no_passport)
                    }
                    helperText={
                      createPasienValidation.touched.no_passport &&
                      createPasienValidation.errors.no_passport
                    }
                    disabled={isEditType && !isEditingMode}
                  />
                </div>
              )}
              <div className="mb-16">
                <TextField
                  fullWidth
                  id="nama_pasien"
                  name="nama_pasien"
                  label="Nama pasien"
                  value={createPasienValidation.values.nama_pasien}
                  onChange={createPasienValidation.handleChange}
                  error={
                    createPasienValidation.touched.nama_pasien &&
                    Boolean(createPasienValidation.errors.nama_pasien)
                  }
                  helperText={
                    createPasienValidation.touched.nama_pasien &&
                    createPasienValidation.errors.nama_pasien
                  }
                  disabled={isEditType && !isEditingMode}
                />
              </div>
              <div className="mb-16">
                <FormControl
                  fullWidth
                  error={
                    createPasienValidation.touched.jenis_kelamin &&
                    Boolean(createPasienValidation.errors.jenis_kelamin)
                  }
                  disabled={isEditType && !isEditingMode}
                >
                  <InputLabel id="jenis_kelamin">Jenis kelamin</InputLabel>
                  <Select
                    id="jenis_kelamin"
                    name="jenis_kelamin"
                    labelId="jenis_kelamin"
                    label="Jenis kelamin"
                    value={createPasienValidation.values.jenis_kelamin}
                    onChange={createPasienValidation.handleChange}
                  >
                    <MenuItem value={true}>Laki-laki</MenuItem>
                    <MenuItem value={false}>Perempuan</MenuItem>
                  </Select>
                  {createPasienValidation.touched.jenis_kelamin &&
                    createPasienValidation.errors.jenis_kelamin && (
                      <FormHelperText>
                        {createPasienValidation.errors.jenis_kelamin}
                      </FormHelperText>
                    )}
                </FormControl>
              </div>
              <div className="mb-16">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      id="tanggal_lahir"
                      name="tanggal_lahir"
                      label="Tanggal lahir"
                      inputFormat="dd-MM-yyyy"
                      mask="__-__-____"
                      value={
                        createPasienValidation.values.tanggal_lahir
                          ? formatGenToIso(
                              createPasienValidation.values.tanggal_lahir
                            )
                          : null
                      }
                      onChange={(newValue) => {
                        createPasienValidation.setFieldValue(
                          "tanggal_lahir",
                          newValue
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={
                            createPasienValidation.touched.tanggal_lahir &&
                            Boolean(createPasienValidation.errors.tanggal_lahir)
                          }
                          helperText={
                            createPasienValidation.touched.tanggal_lahir &&
                            createPasienValidation.errors.tanggal_lahir
                          }
                        />
                      )}
                      disabled={isEditType && !isEditingMode}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="mb-16">
                <TextField
                  fullWidth
                  id="tempat_lahir"
                  name="tempat_lahir"
                  label="Tempat lahir"
                  value={createPasienValidation.values.tempat_lahir}
                  onChange={createPasienValidation.handleChange}
                  error={
                    createPasienValidation.touched.tempat_lahir &&
                    Boolean(createPasienValidation.errors.tempat_lahir)
                  }
                  helperText={
                    createPasienValidation.touched.tempat_lahir &&
                    createPasienValidation.errors.tempat_lahir
                  }
                  disabled={isEditType && !isEditingMode}
                />
              </div>
              <div>
                <InputPhoneNumber
                  id="telepon"
                  labelField="No telepon"
                  handlerRef={createPasienValidation}
                  disabled={isEditType && !isEditingMode}
                />
              </div>
              <div className="flex items-center mb-14">
                <div className="font-14">Samakan dengan No. WA</div>
                <Checkbox
                  checked={isPhoneChecked}
                  onChange={(e) => handlePhoneCheckbox(e.target.checked)}
                  inputProps={{ "aria-label": "controlled" }}
                  disabled={isEditType && !isEditingMode}
                />
              </div>
              <div className="mb-16">
                <InputPhoneNumber
                  id="nowa"
                  labelField="No WA"
                  handlerRef={createPasienValidation}
                  disabled={isEditType && !isEditingMode}
                />
              </div>
              <div className="mb-16">
                <TextField
                  fullWidth
                  id="nama_ibu"
                  name="nama_ibu"
                  label="Nama ibu"
                  value={createPasienValidation.values.nama_ibu}
                  onChange={createPasienValidation.handleChange}
                  error={
                    createPasienValidation.touched.nama_ibu &&
                    Boolean(createPasienValidation.errors.nama_ibu)
                  }
                  helperText={
                    createPasienValidation.touched.nama_ibu &&
                    createPasienValidation.errors.nama_ibu
                  }
                  disabled={isEditType && !isEditingMode}
                />
              </div>
              <div className="mb-16">
                <SelectAsync
                  id="pekerjaan"
                  labelField="Pekerjaan"
                  labelOptionRef="name"
                  valueOptionRef="id"
                  handlerRef={createPasienValidation}
                  handlerFetchData={getProfession}
                  handlerOnChange={(value) => {
                    if (value) {
                      createPasienValidation.setFieldValue("pekerjaan", value);
                    } else {
                      createPasienValidation.setFieldValue("pekerjaan", {
                        id: "",
                        name: "",
                      });
                    }
                  }}
                  isDisabled={isEditType && !isEditingMode}
                />
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className="mb-16">
                <SelectAsync
                  id="agama"
                  labelField="Agama"
                  labelOptionRef="name"
                  valueOptionRef="id"
                  handlerRef={createPasienValidation}
                  handlerFetchData={getReligion}
                  handlerOnChange={(value) => {
                    if (value) {
                      createPasienValidation.setFieldValue("agama", value);
                    } else {
                      createPasienValidation.setFieldValue("agama", {
                        id: "",
                        name: "",
                      });
                    }
                  }}
                  isDisabled={isEditType && !isEditingMode}
                />
              </div>
              <div className="mb-16">
                <SelectAsync
                  id="pendidikan"
                  labelField="Pendidikan"
                  labelOptionRef="name"
                  valueOptionRef="id"
                  handlerRef={createPasienValidation}
                  handlerFetchData={getEducation}
                  handlerOnChange={(value) => {
                    if (value) {
                      createPasienValidation.setFieldValue("pendidikan", value);
                    } else {
                      createPasienValidation.setFieldValue("pendidikan", {
                        id: "",
                        name: "",
                      });
                    }
                  }}
                  isDisabled={isEditType && !isEditingMode}
                />
              </div>
              <div className="mb-16">
                <SelectStatic
                  id="status"
                  handlerRef={createPasienValidation}
                  label="Status"
                  options={maritalStatusDeep}
                  disabled={isEditType && !isEditingMode}
                />
              </div>
              <div className="mb-16">
                <TextField
                  fullWidth
                  id="alamat_ktp"
                  name="alamat_ktp"
                  label="Alamat KTP"
                  multiline
                  rows={4}
                  value={createPasienValidation.values.alamat_ktp}
                  onChange={createPasienValidation.handleChange}
                  error={
                    createPasienValidation.touched.alamat_ktp &&
                    Boolean(createPasienValidation.errors.alamat_ktp)
                  }
                  helperText={
                    createPasienValidation.touched.alamat_ktp &&
                    createPasienValidation.errors.alamat_ktp
                  }
                  disabled={isEditType && !isEditingMode}
                />
              </div>
              <div className="mb-16">
                <SelectRegion
                  id="provinsi_ktp"
                  labelField="Provinsi KTP"
                  handlerRef={createPasienValidation}
                  handlerFetchData={getProvince}
                  handlerCleanup={() => {
                    createPasienValidation.setFieldValue("kabupaten_ktp", {
                      kode: "",
                      nama: "",
                    });
                    createPasienValidation.setFieldValue("kecamatan_ktp", {
                      kode: "",
                      nama: "",
                    });
                    createPasienValidation.setFieldValue("kelurahan_ktp", {
                      kode: "",
                      nama: "",
                    });
                  }}
                  isDisabled={isEditType && !isEditingMode}
                />
              </div>
              <div className="mb-16">
                <SelectRegion
                  id="kabupaten_ktp"
                  labelField="Kota/Kab KTP"
                  handlerRef={createPasienValidation}
                  handlerFetchData={() =>
                    getCity({
                      kode_prov:
                        createPasienValidation.values.provinsi_ktp?.kode,
                    })
                  }
                  handlerCleanup={() => {
                    createPasienValidation.setFieldValue("kecamatan_ktp", {
                      kode: "",
                      nama: "",
                    });
                    createPasienValidation.setFieldValue("kelurahan_ktp", {
                      kode: "",
                      nama: "",
                    });
                  }}
                  isDisabled={
                    !createPasienValidation.values.provinsi_ktp?.kode ||
                    (isEditType && !isEditingMode)
                  }
                />
              </div>
              <div className="mb-16">
                <SelectRegion
                  id="kecamatan_ktp"
                  labelField="Kecamatan KTP"
                  handlerRef={createPasienValidation}
                  handlerFetchData={() =>
                    getDistrict({
                      kode_kabkot:
                        createPasienValidation.values.kabupaten_ktp?.kode,
                    })
                  }
                  handlerCleanup={() => {
                    createPasienValidation.setFieldValue("kelurahan_ktp", {
                      kode: "",
                      nama: "",
                    });
                  }}
                  isDisabled={
                    !createPasienValidation.values.kabupaten_ktp?.kode ||
                    (isEditType && !isEditingMode)
                  }
                />
              </div>
              <div className="mb-16">
                <SelectRegion
                  id="kelurahan_ktp"
                  labelField="Kelurahan/Desa KTP"
                  handlerRef={createPasienValidation}
                  handlerFetchData={() =>
                    getVillage({
                      kode_kecamatan:
                        createPasienValidation.values.kecamatan_ktp?.kode,
                    })
                  }
                  isDisabled={
                    !createPasienValidation.values.kecamatan_ktp?.kode ||
                    (isEditType && !isEditingMode)
                  }
                />
              </div>
              <div className="mb-16">
                <Grid container spacing={1}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="rt_ktp"
                      name="rt_ktp"
                      label="RT KTP"
                      value={createPasienValidation.values.rt_ktp}
                      onChange={createPasienValidation.handleChange}
                      error={
                        createPasienValidation.touched.rt_ktp &&
                        Boolean(createPasienValidation.errors.rt_ktp)
                      }
                      helperText={
                        createPasienValidation.touched.rt_ktp &&
                        createPasienValidation.errors.rt_ktp
                      }
                      disabled={isEditType && !isEditingMode}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="rw_ktp"
                      name="rw_ktp"
                      label="RW KTP"
                      value={createPasienValidation.values.rw_ktp}
                      onChange={createPasienValidation.handleChange}
                      error={
                        createPasienValidation.touched.rw_ktp &&
                        Boolean(createPasienValidation.errors.rw_ktp)
                      }
                      helperText={
                        createPasienValidation.touched.rw_ktp &&
                        createPasienValidation.errors.rw_ktp
                      }
                      disabled={isEditType && !isEditingMode}
                    />
                  </Grid>
                </Grid>
              </div>
              <div className="mb-16">
                <TextField
                  fullWidth
                  id="kode_pos_ktp"
                  name="kode_pos_ktp"
                  label="Kode pos KTP"
                  value={createPasienValidation.values.kode_pos_ktp}
                  onChange={createPasienValidation.handleChange}
                  error={
                    createPasienValidation.touched.kode_pos_ktp &&
                    Boolean(createPasienValidation.errors.kode_pos_ktp)
                  }
                  helperText={
                    createPasienValidation.touched.kode_pos_ktp &&
                    createPasienValidation.errors.kode_pos_ktp
                  }
                  disabled={isEditType && !isEditingMode}
                />
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className="mb-16">
                <SelectAsync
                  id="asuransi"
                  labelField="Asuransi"
                  labelOptionRef="name"
                  valueOptionRef="id"
                  handlerRef={createPasienValidation}
                  handlerFetchData={getInsurance}
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
                  isDisabled={isEditType && !isEditingMode}
                />
              </div>
              <div className="mb-16">
                <SelectAsync
                  id="suku"
                  labelField="Suku"
                  labelOptionRef="name"
                  valueOptionRef="id"
                  handlerRef={createPasienValidation}
                  handlerFetchData={getListSuku}
                  handlerOnChange={(value) => {
                    if (value) {
                      createPasienValidation.setFieldValue("suku", value);
                    } else {
                      createPasienValidation.setFieldValue("suku", {
                        id: "",
                        name: "",
                      });
                    }
                  }}
                  isDisabled={isEditType && !isEditingMode}
                />
              </div>
              <div className="mb-16">
                <SelectAsync
                  id="bahasa"
                  labelField="Bahasa"
                  labelOptionRef="name"
                  valueOptionRef="id"
                  handlerRef={createPasienValidation}
                  handlerFetchData={getListBahasa}
                  handlerOnChange={(value) => {
                    if (value) {
                      createPasienValidation.setFieldValue("bahasa", value);
                    } else {
                      createPasienValidation.setFieldValue("bahasa", {
                        id: "",
                        name: "",
                      });
                    }
                  }}
                  isDisabled={isEditType && !isEditingMode}
                />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isSetSameAddressChecked}
                      onChange={handleSetSameAddressChange}
                      inputProps={{ "aria-label": "controlled" }}
                      disabled={
                        createPasienValidation.values.alamat_ktp === "" ||
                        createPasienValidation.values.provinsi_ktp.kode ===
                          "" ||
                        createPasienValidation.values.kabupaten_ktp.kode ===
                          "" ||
                        createPasienValidation.values.kecamatan_ktp.kode ===
                          "" ||
                        createPasienValidation.values.kelurahan_ktp.kode ===
                          "" ||
                        (isEditType && !isEditingMode)
                      }
                    />
                  }
                  label="Sama dengan data KTP"
                />
              </div>
              <div className="mb-16">
                <TextField
                  fullWidth
                  id="alamat_domisili"
                  name="alamat_domisili"
                  label="Alamat domisili"
                  multiline
                  rows={4}
                  value={createPasienValidation.values.alamat_domisili}
                  onChange={createPasienValidation.handleChange}
                  error={
                    createPasienValidation.touched.alamat_domisili &&
                    Boolean(createPasienValidation.errors.alamat_domisili)
                  }
                  helperText={
                    createPasienValidation.touched.alamat_domisili &&
                    createPasienValidation.errors.alamat_domisili
                  }
                  disabled={isEditType && !isEditingMode}
                />
              </div>
              <div className="mb-16">
                <SelectRegion
                  id="provinsi_domisili"
                  labelField="Provinsi domisili"
                  handlerRef={createPasienValidation}
                  handlerFetchData={getProvince}
                  handlerCleanup={() => {
                    createPasienValidation.setFieldValue("kabupaten_domisili", {
                      kode: "",
                      nama: "",
                    });
                    createPasienValidation.setFieldValue("kecamatan_domisili", {
                      kode: "",
                      nama: "",
                    });
                    createPasienValidation.setFieldValue("kelurahan_domisili", {
                      kode: "",
                      nama: "",
                    });
                  }}
                  isDisabled={isEditType && !isEditingMode}
                />
              </div>
              <div className="mb-16">
                <SelectRegion
                  id="kabupaten_domisili"
                  labelField="Kota/Kab domisili"
                  handlerRef={createPasienValidation}
                  handlerFetchData={() =>
                    getCity({
                      kode_prov:
                        createPasienValidation.values.provinsi_domisili?.kode,
                    })
                  }
                  handlerCleanup={() => {
                    createPasienValidation.setFieldValue("kecamatan_domisili", {
                      kode: "",
                      nama: "",
                    });
                    createPasienValidation.setFieldValue("kelurahan_domisili", {
                      kode: "",
                      nama: "",
                    });
                  }}
                  isDisabled={
                    !createPasienValidation.values.provinsi_domisili?.kode ||
                    (isEditType && !isEditingMode)
                  }
                />
              </div>
              <div className="mb-16">
                <SelectRegion
                  id="kecamatan_domisili"
                  labelField="Kecamatan domisili"
                  handlerRef={createPasienValidation}
                  handlerFetchData={() =>
                    getDistrict({
                      kode_kabkot:
                        createPasienValidation.values.kabupaten_domisili?.kode,
                    })
                  }
                  handlerCleanup={() => {
                    createPasienValidation.setFieldValue("kelurahan_domisili", {
                      kode: "",
                      nama: "",
                    });
                  }}
                  isDisabled={
                    !createPasienValidation.values.kabupaten_domisili?.kode ||
                    (isEditType && !isEditingMode)
                  }
                />
              </div>
              <div className="mb-16">
                <SelectRegion
                  id="kelurahan_domisili"
                  labelField="Kelurahan/Desa domisili"
                  handlerRef={createPasienValidation}
                  handlerFetchData={() =>
                    getVillage({
                      kode_kecamatan:
                        createPasienValidation.values.kecamatan_domisili?.kode,
                    })
                  }
                  isDisabled={
                    !createPasienValidation.values.kecamatan_domisili?.kode ||
                    (isEditType && !isEditingMode)
                  }
                />
              </div>
              <div className="mb-16">
                <Grid container spacing={1}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="rt_domisili"
                      name="rt_domisili"
                      label="RT domisili"
                      value={createPasienValidation.values.rt_domisili}
                      onChange={createPasienValidation.handleChange}
                      error={
                        createPasienValidation.touched.rt_domisili &&
                        Boolean(createPasienValidation.errors.rt_domisili)
                      }
                      helperText={
                        createPasienValidation.touched.rt_domisili &&
                        createPasienValidation.errors.rt_domisili
                      }
                      disabled={isEditType && !isEditingMode}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="rw_domisili"
                      name="rw_domisili"
                      label="RW domisili"
                      value={createPasienValidation.values.rw_domisili}
                      onChange={createPasienValidation.handleChange}
                      error={
                        createPasienValidation.touched.rw_domisili &&
                        Boolean(createPasienValidation.errors.rw_domisili)
                      }
                      helperText={
                        createPasienValidation.touched.rw_domisili &&
                        createPasienValidation.errors.rw_domisili
                      }
                      disabled={isEditType && !isEditingMode}
                    />
                  </Grid>
                </Grid>
              </div>
              <div className="mb-16">
                <TextField
                  fullWidth
                  id="kode_pos_domisili"
                  name="kode_pos_domisili"
                  label="Kode pos domisili"
                  value={createPasienValidation.values.kode_pos_domisili}
                  onChange={createPasienValidation.handleChange}
                  error={
                    createPasienValidation.touched.kode_pos_domisili &&
                    Boolean(createPasienValidation.errors.kode_pos_domisili)
                  }
                  helperText={
                    createPasienValidation.touched.kode_pos_domisili &&
                    createPasienValidation.errors.kode_pos_domisili
                  }
                  disabled={isEditType && !isEditingMode}
                />
              </div>
            </Grid>
          </Grid>
          <div className="flex justify-end items-center mt-16">
            {isEditType && (
              <>
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
                <div className="mr-auto flex">
                  <div className="mr-8">
                    <ReactToPrint
                      trigger={() => (
                        <Button variant="outlined" startIcon={<PrintIcon />}>
                          Cetak Label
                        </Button>
                      )}
                      content={() => labelPrintRef.current}
                    />
                    <LabelToPrint
                      data={{
                        nama_pasien: detailPrePopulatedData.nama_pasien,
                        no_rm: detailPrePopulatedData.no_rm,
                        nik:
                          detailPrePopulatedData.nik ||
                          createPasienValidation.values.no_passport,
                        tanggal_lahir: detailPrePopulatedData.tanggal_lahir,
                      }}
                      ref={labelPrintRef}
                    />
                  </div>
                  <div>
                    <ReactToPrint
                      trigger={() => (
                        <Button variant="outlined" startIcon={<PrintIcon />}>
                          Cetak Kartu Periksa
                        </Button>
                      )}
                      content={() => checkupPrintRef.current}
                    />
                    <CheckupToPrint
                      data={{
                        no_rm: detailPrePopulatedData.no_rm,
                      }}
                      ref={checkupPrintRef}
                    />
                  </div>
                </div>
              </>
            )}
            <Button
              type="button"
              variant="outlined"
              startIcon={<BackIcon />}
              sx={{ marginRight: 2 }}
              // onClick={() => router.push("/pasien")}
              onClick={() => handleClose()}
            >
              Kembali
            </Button>
            {isEditType ? (
              <LoadingButton
                type="submit"
                variant="contained"
                disabled={
                  JSON.stringify(createPasienValidation.initialValues) ===
                    JSON.stringify(createPasienValidation.values) ||
                  !isActionPermitted("pasien:update") ||
                  (isEditType && !isEditingMode)
                }
                startIcon={<SaveIcon />}
                loadingPosition="start"
                loading={createPasienValidation.isSubmitting}
              >
                Simpan perubahan
              </LoadingButton>
            ) : (
              <LoadingButton
                type="submit"
                variant="contained"
                disabled={!isActionPermitted("pasien:store")}
                startIcon={<PlusIcon />}
                loadingPosition="start"
                loading={createPasienValidation.isSubmitting}
              >
                Tambah Pasien
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
      <DialogConfirmPasien
        state={dialogConfirmToRawatJalan.state}
        stateHandler={setConfrimToRawatJalan}
        noRm={dialogConfirmToRawatJalan.noRm}
      />
    </>
  );
};

export default FormPasien;
