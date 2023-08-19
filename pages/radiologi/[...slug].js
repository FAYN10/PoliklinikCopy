import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getDetailPasien } from "api/pasien";
import LoaderOnLayout from "components/LoaderOnLayout";
import FormPasien from "components/modules/pasien/form";
import { formatGenToIso } from "utils/formatTime";
import getStaticData from "utils/getStaticData";
import { getListRawatJalan } from "api/rawat-jalan";
import { getListRawatInap } from "api/rawat-inap";
import Popover from "@mui/material/Popover";
import TableLayout from "pages/pasien/TableLayout";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import useClientPermission from "custom-hooks/useClientPermission";
import { formatLabelDate } from "utils/formatTime";
import { Grid, Card, IconButton, Tooltip, Avatar, Dialog } from "@mui/material";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import RefreshIcon from "@mui/icons-material/Refresh";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupIcon from "@mui/icons-material/Group";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FormAssessmentPasien from "components/modules/radiologi/formAssessmentPasien";
import PermintaanRadiologi from "components/modules/radiologi/permintaanRadiologi";
import FormAssessmentPetugas from "components/modules/radiologi/formAssessmentPetugas";
import FormExpertise from "components/modules/radiologi/formExpertise";
import RiwayatPemeriksaanTable from "components/modules/radiologi/riwayatPemeriksaanTable";
import { dummyRadiologiData } from "pages/radiologi/index.js";

const DetailRadiologi = () => {
  const [isEditingMode, setIsEditingMode] = useState(false);
  const router = useRouter();
  const { slug } = router.query;
  const [dataRadiologi, setDataRadiologi] = useState({});
  const [detailDataRadiologi, setDetailDataRadiologi] = useState({});
  const [isLoadingDataRadiologi, setIsLoadingDataRadiologi] = useState(true);
  const [menuState, setMenuState] = useState(null);
  const { isActionPermitted } = useClientPermission();
  const openMenuPopover = Boolean(menuState);
  const menuPopover = menuState ? "menu-popover" : undefined;
  const [dialogProfileState, setDialogProfileState] = useState(false);
  const handleIsEditingMode = (e) => {
    setIsEditingMode(e.target.checked);
  };
  const dataFormatter = (data) => {
    let tempData = {
      nama_pasien: data.nama_pasien || "",
      jenis_kelamin:
        data.jenis_kelamin !== null && data.jenis_kelamin !== undefined
          ? data.jenis_kelamin
          : "",
      tempat_lahir: data.tempat_lahir || "",
      tanggal_lahir: formatGenToIso(data.tanggal_lahir) || null,
      kewarganegaraan: getStaticData("countries", data.kewarganegaraan || ""),
      showNik: false,
      no_passport: data.no_passport || "",
      nik: data.nik || "",
      alamat_domisili: data.alamat_domisili || "",
      provinsi_domisili: data.provinsi_domisili || { kode: "", nama: "" },
      kabupaten_domisili: data.kabupaten_domisili || { kode: "", nama: "" },
      kecamatan_domisili: data.kecamatan_domisili || { kode: "", nama: "" },
      kelurahan_domisili: data.kelurahan_domisili || { kode: "", nama: "" },
      rt_domisili: data.rt_domisili || "",
      rw_domisili: data.rw_domisili || "",
      kode_pos_domisili: (data.kode_pos_domisili || "") + "",
      alamat_ktp: data.alamat_ktp || { kode: "", nama: "" },
      provinsi_ktp: data.provinsi_ktp || { kode: "", nama: "" },
      kabupaten_ktp: data.kabupaten_ktp || { kode: "", nama: "" },
      kecamatan_ktp: data.kecamatan_ktp || { kode: "", nama: "" },
      kelurahan_ktp: data.kelurahan_ktp || { kode: "", nama: "" },
      rt_ktp: data.rt_ktp || "",
      rw_ktp: data.rw_ktp || "",
      kode_pos_ktp: (data.kode_pos_ktp || "") + "",
      telepon: data.telepon || "",
      nowa: data.nowa || "",
      status: getStaticData("maritalStatusDeep", data.status || ""),
      agama: data.agama || { id: "", name: "" },
      pendidikan: data.pendidikan || { id: "", name: "" },
      pekerjaan: data.pekerjaan || { id: "", name: "" },
      nama_ibu: data.nama_ibu || "",
      asuransi: data.asuransi || { id: "", name: "" },
      suku: data.suku || { id: "", name: "" },
      bahasa: data.bahasa || { id: "", name: "" },
    };
    if (tempData.kewarganegaraan.label === "Indonesia") {
      tempData.showNik = true;
    }
    return { ...tempData };
  };

  const updateData = (data) => {
    setDetailDataRadiologi(data);
    setDataRadiologi(() => dataFormatter(data));
  };

  useEffect(() => {
    if (router.isReady) {
      (async () => {
        try {
          const data = dummyRadiologiData;
          const response = await getDetailRadiologi({ id: slug[0] });
          // const data = response.data.data;
          const formattedData = dataFormatter(data);
          setDataRadiologi(formattedData);
          setDetailDataRadiologi(data);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoadingDataRadiologi(false);
        }
      })();
    }
  }, [router.isReady, slug]);

  return (
    <>
      {isLoadingDataRadiologi ? (
        <LoaderOnLayout />
      ) : (
        <>
          <Grid container spacing={2}>
            <Grid item md={6} sm={12}>
              <Card className="px-14 py-12 mb-16">
                <div className="flex justify-between items-center mb-16">
                  <div className="flex items-center">
                    <PermContactCalendarIcon
                      fontSize="small"
                      style={{ color: "rgb(99, 115, 129)" }}
                    />
                    <p className="m-0 ml-8 font-14">Pasien Info</p>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <Avatar
                      src={detailDataRadiologi?.picture}
                      variant="rounded"
                      sx={{ width: 130, height: 130 }}
                    />
                    <div className="ml-8 mt-8">
                      <div className="font-w-700">
                        {dataRadiologi?.nama_pasien}
                      </div>
                      <div className="font-w-700">
                        {dataRadiologi?.nik}
                      </div>
                      <div className="font-14">
                        {detailDataRadiologi?.tanggal_lahir
                          ? formatLabelDate(detailDataRadiologi.tanggal_lahir)
                          : ""}{" "}
                        / {detailDataRadiologi?.umur} tahun
                      </div>
                      {/* <div className="font-14">
                        {detailDataRadiologi?.agama.name}
                      </div> */}
                      <div className="font-14">
                        {detailDataRadiologi?.jenis_kelamin
                          ? "Laki-laki"
                          : "Perempuan"}{" "}
                        / {detailDataRadiologi?.status}
                      </div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <div>NO. RM</div>
                    <div
                      className="font-28 font-w-700"
                      style={{ textAlign: "right" }}
                    >
                      {detailDataRadiologi?.no_rm}
                    </div>
                  </div>
                </div>
              </Card>

            </Grid>

          </Grid>
          <div style={{ overflow: "auto", maxHeight: "calc(100vh - 340px)" }}>


            <Card className="px-14 py-12 mb-16">
              <div className="flex items-center">
                <p className="m-0 ml-8 font-14">Permintaan Radiologi</p>
              </div>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                <PermintaanRadiologi />
              </div>
            </Card>
            <Card className="px-14 py-12 mb-16">
              <div className="flex justify-between items-center mb-16">
                <div className="flex items-center">
                  <CheckCircleIcon
                    fontSize="small"
                    style={{ color: "rgb(99, 115, 129)" }}
                  />
                  <p className="m-0 ml-8 font-14">Assessment Pasien Radiologi</p>
                </div>
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
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <FormAssessmentPasien />
              </div>
            </Card>

            <Card className="px-14 py-12 mb-16">
              <div className="flex justify-between items-center mb-16">
                <div className="flex items-center">
                  <CheckCircleIcon
                    fontSize="small"
                    style={{ color: "rgb(99, 115, 129)" }}
                  />
                  <p className="m-0 ml-8 font-14">Assessment Petugas Radiologi</p>
                </div>
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
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <FormAssessmentPetugas />
              </div>
            </Card>

            <Card className="px-14 py-12 mb-16">
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                <FormExpertise />
              </div>

            </Card>

            <Card className="px-14 py-12 mb-16">
              <div className="flex items-center">
                <p className="m-0 ml-8 font-14">Riwayat Pemeriksaan</p>
              </div>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                <RiwayatPemeriksaanTable />
              </div>
            </Card>
          </div>
          <Dialog
            fullScreen
            open={dialogProfileState}
            onClose={() => setDialogProfileState(false)}
          >
            {/* <FormPasienRadiologi
              isEditType
              prePopulatedDataForm={dataPasien}
              detailPrePopulatedData={detailDataPasien}
              updatePrePopulatedData={updateData}
            /> */}
          </Dialog>
        </>
      )}
    </>
  );
};

export default DetailRadiologi;