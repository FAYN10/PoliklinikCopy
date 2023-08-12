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
import SelectCountry from "components/SelectCountry";
import SelectRegion from "components/SelectRegion";
import SelectStatic from "components/SelectStatic";
import SelectAsync from "components/SelectAsync";
import InputPhoneNumber from "components/InputPhoneNumber";
import Snackbar from "components/SnackbarMui";
import { formatIsoToGen } from "utils/formatTime";
import { dateSchema, stringSchema, phoneNumberSchema } from "utils/yupSchema";
import {
  createEmployee,
  updateEmployee,
  getDetailEmployee,
} from "api/employee";
import { getProvince, getCity, getDistrict, getVillage } from "api/wilayah";
import { getReligion } from "api/general";
import { gender, bank, maritalStatus, bloodType } from "public/static/data";
import useClientPermission from "custom-hooks/useClientPermission";

const FormEmployee = ({
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

  const employeeInitialValue = !isEditType
    ? {
        nip: "",
        name: "",
        callname: "",
        birth_place: "",
        birth_date: null,
        gender: { name: "", value: "" },
        religion: { id: "", name: "" },
        telp: "",
        email: "",
        marital_status: { name: "", value: "" },
        blood: { name: "", value: "" },
        citizen: { code: "", label: "" },
        no_identity: "",
        npwp: "",
        bank: { name: "", value: "" },
        bank_account_number: "",
        address_identity: "",
        province_identity: { kode: "", nama: "" },
        city_identity: { kode: "", nama: "" },
        subdistrict_identity: { kode: "", nama: "" },
        ward_identity: { kode: "", nama: "" },
        rt_identity: "",
        rw_identity: "",
        address_now: "",
        province_now: { kode: "", nama: "" },
        city_now: { kode: "", nama: "" },
        subdistrict_now: { kode: "", nama: "" },
        ward_now: { kode: "", nama: "" },
        rt_now: "",
        rw_now: "",
        distance: "",
      }
    : prePopulatedDataForm;

  const employeeSchema = Yup.object({
    nip: stringSchema("NIP", true),
    name: stringSchema("Nama", true),
    callname: stringSchema("Nama panggilan", true),
    birth_place: stringSchema("Tempat lahir", true),
    birth_date: dateSchema("Tanggal lahir"),
    gender: Yup.object({
      value: Yup.number().required("Jenis kelamin wajib diisi"),
    }),
    religion: Yup.object({
      id: stringSchema("Agama"),
    }),
    telp: phoneNumberSchema(),
    email: Yup.string().email("Email tidak valid"),
    marital_status: Yup.object({
      value: stringSchema("Status perkawinan"),
    }),
    blood: Yup.object({
      value: stringSchema("Golongan darah"),
    }),
    citizen: Yup.object({
      code: stringSchema("Kewarganegaraan"),
    }),
    no_identity: stringSchema("No identitas"),
    npwp: stringSchema("NPWP"),
    bank: Yup.object({
      value: stringSchema("Status perkawinan"),
    }),
    bank_account_number: stringSchema("No REK"),
    address_identity: stringSchema("Alamat"),
    province_identity: Yup.object({
      kode: stringSchema("Provinsi"),
    }),
    city_identity: Yup.object({
      kode: stringSchema("Kota/Kab"),
    }),
    subdistrict_identity: Yup.object({
      kode: stringSchema("Kecamatan"),
    }),
    ward_identity: Yup.object({
      kode: stringSchema("Kelurahan/Desa"),
    }),
    rt_identity: stringSchema("RT"),
    rw_identity: stringSchema("RW"),
    address_now: stringSchema("Alamat domisili"),
    province_now: Yup.object({
      kode: stringSchema("Provinsi domisili"),
    }),
    city_now: Yup.object({
      kode: stringSchema("Kota/Kab domisili"),
    }),
    subdistrict_now: Yup.object({
      kode: stringSchema("Kecamatan domisili"),
    }),
    ward_now: Yup.object({
      kode: stringSchema("Kelurahan/Desa domisili"),
    }),
    rt_now: stringSchema("RT domisili"),
    rw_now: stringSchema("RW domisili"),
    distance: stringSchema("Jarak"),
  });

  const employeeValidation = useFormik({
    initialValues: employeeInitialValue,
    validationSchema: employeeSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm, setFieldError }) => {
      let messageContext = isEditType ? "diperbarui" : "ditambahkan";
      let formattedData = {
        ...values,
        birth_date: formatIsoToGen(values.birth_date),
        gender: values.gender.value,
        religion: values.religion.id,
        marital_status: values.marital_status.value,
        blood: values.blood.value,
        citizen: values.citizen.label,
        bank: values.bank.value,
        province_identity: values.province_identity.kode,
        city_identity: values.city_identity.kode,
        subdistrict_identity: values.subdistrict_identity.kode,
        ward_identity: values.ward_identity.kode,
        province_now: values.province_now.kode,
        city_now: values.city_now.kode,
        subdistrict_now: values.subdistrict_now.kode,
        ward_now: values.ward_now.kode,
      };
      let validData = {};
      for (let key in formattedData) {
        if (formattedData[key]) {
          validData[`${key}`] = formattedData[key];
        }
      }
      try {
        if (!isEditType) {
          await createEmployee(validData);
          resetForm();
        } else {
          await updateEmployee({ ...validData, id: detailPrePopulatedData.id });
          const response = await getDetailEmployee({
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

  return (
    <>
      <Paper sx={{ width: "100%", padding: 2, paddingTop: 3 }}>
        <div className="font-14 mb-14">
          <i>
            Catatan: Field bertanda{" "}
            <span className="font-w-700 font-16">*</span> wajib terisi
          </i>
        </div>
        <form onSubmit={employeeValidation.handleSubmit}>
          <FocusError formik={employeeValidation} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <div className="mb-16">
                <TextField
                  fullWidth
                  id="nip"
                  name="nip"
                  label="NIP *"
                  value={employeeValidation.values.nip}
                  onChange={employeeValidation.handleChange}
                  error={
                    employeeValidation.touched.nip &&
                    Boolean(employeeValidation.errors.nip)
                  }
                  helperText={
                    employeeValidation.touched.nip &&
                    employeeValidation.errors.nip
                  }
                />
              </div>
              <div className="mb-16">
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Nama *"
                  value={employeeValidation.values.name}
                  onChange={employeeValidation.handleChange}
                  error={
                    employeeValidation.touched.name &&
                    Boolean(employeeValidation.errors.name)
                  }
                  helperText={
                    employeeValidation.touched.name &&
                    employeeValidation.errors.name
                  }
                />
              </div>
              <div className="mb-16">
                <TextField
                  fullWidth
                  id="callname"
                  name="callname"
                  label="Nama panggilan *"
                  value={employeeValidation.values.callname}
                  onChange={employeeValidation.handleChange}
                  error={
                    employeeValidation.touched.callname &&
                    Boolean(employeeValidation.errors.callname)
                  }
                  helperText={
                    employeeValidation.touched.callname &&
                    employeeValidation.errors.callname
                  }
                />
              </div>
              <div className="mb-16">
                <TextField
                  fullWidth
                  id="birth_place"
                  name="birth_place"
                  label="Tempat lahir *"
                  value={employeeValidation.values.birth_place}
                  onChange={employeeValidation.handleChange}
                  error={
                    employeeValidation.touched.birth_place &&
                    Boolean(employeeValidation.errors.birth_place)
                  }
                  helperText={
                    employeeValidation.touched.birth_place &&
                    employeeValidation.errors.birth_place
                  }
                />
              </div>
              <div className="mb-16">
                <DatePicker
                  id="birth_date"
                  label="Tanggal lahir *"
                  handlerRef={employeeValidation}
                />
              </div>
              <div className="mb-16">
                <SelectStatic
                  id="gender"
                  label="Jenis kelamin *"
                  handlerRef={employeeValidation}
                  options={gender}
                />
              </div>
              <div className="mb-16">
                <SelectAsync
                  id="religion"
                  labelField="Agama"
                  labelOptionRef="name"
                  valueOptionRef="id"
                  handlerFetchData={getReligion}
                  handlerRef={employeeValidation}
                  handlerOnChange={(payload) => {
                    if (payload) {
                      employeeValidation.setFieldValue("religion", {
                        id: payload.id,
                        name: payload.name,
                      });
                    } else {
                      employeeValidation.setFieldValue("religion", {
                        id: "",
                        name: "",
                      });
                    }
                  }}
                />
              </div>
              <div className="mb-16">
                <InputPhoneNumber
                  id="telp"
                  labelField="No telepon"
                  handlerRef={employeeValidation}
                />
              </div>
              <div className="mb-16">
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  value={employeeValidation.values.email}
                  onChange={employeeValidation.handleChange}
                  error={
                    employeeValidation.touched.email &&
                    Boolean(employeeValidation.errors.email)
                  }
                  helperText={
                    employeeValidation.touched.email &&
                    employeeValidation.errors.email
                  }
                />
              </div>
              <div className="mb-16">
                <SelectStatic
                  id="marital_status"
                  label="Status pernikahan"
                  handlerRef={employeeValidation}
                  options={maritalStatus}
                />
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className="mb-16">
                <TextField
                  fullWidth
                  id="address_identity"
                  name="address_identity"
                  label="Alamat"
                  value={employeeValidation.values.address_identity}
                  onChange={employeeValidation.handleChange}
                  error={
                    employeeValidation.touched.address_identity &&
                    Boolean(employeeValidation.errors.address_identity)
                  }
                  helperText={
                    employeeValidation.touched.address_identity &&
                    employeeValidation.errors.address_identity
                  }
                />
              </div>
              <div className="mb-16">
                <SelectRegion
                  id="province_identity"
                  labelField="Provinsi"
                  handlerRef={employeeValidation}
                  handlerFetchData={getProvince}
                  handlerCleanup={() => {
                    employeeValidation.setFieldValue("city_identity", {
                      kode: "",
                      nama: "",
                    });
                    employeeValidation.setFieldValue("subdistrict_identity", {
                      kode: "",
                      nama: "",
                    });
                    employeeValidation.setFieldValue("ward_identity", {
                      kode: "",
                      nama: "",
                    });
                  }}
                />
              </div>
              <div className="mb-16">
                <SelectRegion
                  id="city_identity"
                  labelField="Kota/Kab"
                  isDisabled={
                    !employeeValidation.values.province_identity?.kode
                  }
                  handlerRef={employeeValidation}
                  handlerFetchData={() =>
                    getCity({
                      kode_prov:
                        employeeValidation.values.province_identity?.kode,
                    })
                  }
                  handlerCleanup={() => {
                    employeeValidation.setFieldValue("subdistrict_identity", {
                      kode: "",
                      nama: "",
                    });
                    employeeValidation.setFieldValue("ward_identity", {
                      kode: "",
                      nama: "",
                    });
                  }}
                />
              </div>
              <div className="mb-16">
                <SelectRegion
                  id="subdistrict_identity"
                  labelField="Kecamatan"
                  isDisabled={!employeeValidation.values.city_identity?.kode}
                  handlerRef={employeeValidation}
                  handlerFetchData={() =>
                    getDistrict({
                      kode_kabkot:
                        employeeValidation.values.city_identity?.kode,
                    })
                  }
                  handlerCleanup={() => {
                    employeeValidation.setFieldValue("ward_identity", {
                      kode: "",
                      nama: "",
                    });
                  }}
                />
              </div>
              <div className="mb-16">
                <SelectRegion
                  id="ward_identity"
                  labelField="Kelurahan/Desa"
                  isDisabled={
                    !employeeValidation.values.subdistrict_identity?.kode
                  }
                  handlerRef={employeeValidation}
                  handlerFetchData={() =>
                    getVillage({
                      kode_kecamatan:
                        employeeValidation.values.subdistrict_identity?.kode,
                    })
                  }
                />
              </div>
              <div className="mb-16">
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="rt_identity"
                      name="rt_identity"
                      label="RT"
                      value={employeeValidation.values.rt_identity}
                      onChange={employeeValidation.handleChange}
                      error={
                        employeeValidation.touched.rt_identity &&
                        Boolean(employeeValidation.errors.rt_identity)
                      }
                      helperText={
                        employeeValidation.touched.rt_identity &&
                        employeeValidation.errors.rt_identity
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="rw_identity"
                      name="rw_identity"
                      label="RW"
                      value={employeeValidation.values.rw_identity}
                      onChange={employeeValidation.handleChange}
                      error={
                        employeeValidation.touched.rw_identity &&
                        Boolean(employeeValidation.errors.rw_identity)
                      }
                      helperText={
                        employeeValidation.touched.rw_identity &&
                        employeeValidation.errors.rw_identity
                      }
                    />
                  </Grid>
                </Grid>
              </div>
              <div className="mb-16">
                <SelectCountry
                  id="citizen"
                  name="citizen"
                  labelField="Kewarganegaraan"
                  handlerRef={employeeValidation}
                  handlerOnChange={(payload) => {
                    if (payload) {
                      employeeValidation.setFieldValue("citizen", payload);
                      return;
                    }
                    employeeValidation.setFieldValue("citizen", {
                      code: "",
                      label: "",
                    });
                  }}
                />
              </div>
              <div className="mb-16">
                <TextField
                  fullWidth
                  id="no_identity"
                  name="no_identity"
                  label="No identitas"
                  value={employeeValidation.values.no_identity}
                  onChange={employeeValidation.handleChange}
                  error={
                    employeeValidation.touched.no_identity &&
                    Boolean(employeeValidation.errors.no_identity)
                  }
                  helperText={
                    employeeValidation.touched.no_identity &&
                    employeeValidation.errors.no_identity
                  }
                />
              </div>
              <div className="mb-16">
                <TextField
                  fullWidth
                  id="npwp"
                  name="npwp"
                  label="NPWP"
                  value={employeeValidation.values.npwp}
                  onChange={employeeValidation.handleChange}
                  error={
                    employeeValidation.touched.npwp &&
                    Boolean(employeeValidation.errors.npwp)
                  }
                  helperText={
                    employeeValidation.touched.npwp &&
                    employeeValidation.errors.npwp
                  }
                />
              </div>
              <div className="mb-16">
                <SelectStatic
                  id="blood"
                  label="Golongan darah"
                  handlerRef={employeeValidation}
                  options={bloodType}
                />
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className="mb-16">
                <TextField
                  fullWidth
                  id="address_now"
                  name="address_now"
                  label="Alamat domisili"
                  value={employeeValidation.values.address_now}
                  onChange={employeeValidation.handleChange}
                  error={
                    employeeValidation.touched.address_now &&
                    Boolean(employeeValidation.errors.address_now)
                  }
                  helperText={
                    employeeValidation.touched.address_now &&
                    employeeValidation.errors.address_now
                  }
                />
              </div>
              <div className="mb-16">
                <SelectRegion
                  id="province_now"
                  labelField="Provinsi domisili"
                  handlerRef={employeeValidation}
                  handlerFetchData={getProvince}
                  handlerCleanup={() => {
                    employeeValidation.setFieldValue("city_now", {
                      kode: "",
                      nama: "",
                    });
                    employeeValidation.setFieldValue("subdistrict_now", {
                      kode: "",
                      nama: "",
                    });
                    employeeValidation.setFieldValue("ward_now", {
                      kode: "",
                      nama: "",
                    });
                  }}
                />
              </div>
              <div className="mb-16">
                <SelectRegion
                  id="city_now"
                  labelField="Kota/Kab domisili"
                  isDisabled={!employeeValidation.values.province_now?.kode}
                  handlerRef={employeeValidation}
                  handlerFetchData={() =>
                    getCity({
                      kode_prov: employeeValidation.values.province_now?.kode,
                    })
                  }
                  handlerCleanup={() => {
                    employeeValidation.setFieldValue("subdistrict_now", {
                      kode: "",
                      nama: "",
                    });
                    employeeValidation.setFieldValue("ward_now", {
                      kode: "",
                      nama: "",
                    });
                  }}
                />
              </div>
              <div className="mb-16">
                <SelectRegion
                  id="subdistrict_now"
                  labelField="Kecamatan domisili"
                  isDisabled={!employeeValidation.values.city_now?.kode}
                  handlerRef={employeeValidation}
                  handlerFetchData={() =>
                    getDistrict({
                      kode_kabkot: employeeValidation.values.city_now?.kode,
                    })
                  }
                  handlerCleanup={() => {
                    employeeValidation.setFieldValue("ward_now", {
                      kode: "",
                      nama: "",
                    });
                  }}
                />
              </div>
              <div className="mb-16">
                <SelectRegion
                  id="ward_now"
                  labelField="Kelurahan/Desa domisili"
                  isDisabled={!employeeValidation.values.subdistrict_now?.kode}
                  handlerRef={employeeValidation}
                  handlerFetchData={() =>
                    getVillage({
                      kode_kecamatan:
                        employeeValidation.values.subdistrict_now?.kode,
                    })
                  }
                />
              </div>
              <div className="mb-16">
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="rt_now"
                      name="rt_now"
                      label="RT domisili"
                      value={employeeValidation.values.rt_now}
                      onChange={employeeValidation.handleChange}
                      error={
                        employeeValidation.touched.rt_now &&
                        Boolean(employeeValidation.errors.rt_now)
                      }
                      helperText={
                        employeeValidation.touched.rt_now &&
                        employeeValidation.errors.rt_now
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="rw_now"
                      name="rw_now"
                      label="RW domisili"
                      value={employeeValidation.values.rw_now}
                      onChange={employeeValidation.handleChange}
                      error={
                        employeeValidation.touched.rw_now &&
                        Boolean(employeeValidation.errors.rw_now)
                      }
                      helperText={
                        employeeValidation.touched.rw_now &&
                        employeeValidation.errors.rw_now
                      }
                    />
                  </Grid>
                </Grid>
              </div>
              <div className="mb-16">
                <SelectStatic
                  id="bank"
                  label="BANK"
                  handlerRef={employeeValidation}
                  options={bank}
                />
              </div>
              <div className="mb-16">
                <TextField
                  fullWidth
                  id="bank_account_number"
                  name="bank_account_number"
                  label="No REK"
                  value={employeeValidation.values.bank_account_number}
                  onChange={employeeValidation.handleChange}
                  error={
                    employeeValidation.touched.bank_account_number &&
                    Boolean(employeeValidation.errors.bank_account_number)
                  }
                  helperText={
                    employeeValidation.touched.bank_account_number &&
                    employeeValidation.errors.bank_account_number
                  }
                />
              </div>
              <TextField
                fullWidth
                id="distance"
                name="distance"
                label="Jarak"
                value={employeeValidation.values.distance}
                onChange={employeeValidation.handleChange}
                error={
                  employeeValidation.touched.distance &&
                  Boolean(employeeValidation.errors.distance)
                }
                helperText={
                  employeeValidation.touched.distance &&
                  employeeValidation.errors.distance
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
              onClick={() => router.push("/employee")}
            >
              Kembali
            </Button>
            {isEditType ? (
              <LoadingButton
                type="submit"
                variant="contained"
                disabled={
                  JSON.stringify(employeeValidation.initialValues) ===
                    JSON.stringify(employeeValidation.values) ||
                  !isActionPermitted("employee:update")
                }
                startIcon={<SaveIcon />}
                loadingPosition="start"
                loading={employeeValidation.isSubmitting}
              >
                Simpan perubahan
              </LoadingButton>
            ) : (
              <LoadingButton
                type="submit"
                variant="contained"
                disabled={!isActionPermitted("employee:store")}
                startIcon={<PlusIcon />}
                loadingPosition="start"
                loading={employeeValidation.isSubmitting}
              >
                Tambah Karyawan
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

export default FormEmployee;
