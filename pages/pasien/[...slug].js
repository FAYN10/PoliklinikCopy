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
import { formatLabelDate } from "utils/formatTime";
import { Grid, Card, IconButton, Tooltip, Avatar, Dialog } from "@mui/material";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import RefreshIcon from "@mui/icons-material/Refresh";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupIcon from "@mui/icons-material/Group";

const rawatJalanTableHead = [
  // {
  //   id: "no_rm",
  //   label: "Nomor RM",
  // },
  // {
  //   id: "nama",
  //   label: "Nama",
  // },
  // {
  //   id: "alamat",
  //   label: "Alamat",
  // },
  {
    id: "asuransi",
    label: "Asuransi",
  },
  {
    id: "DATETIME_MEDIS",
    label: "Tgl Masuk",
  },
  {
    id: "poliklinik",
    label: "Poliklinik",
  },
  {
    id: "dokter",
    label: "Dokter",
  },
  {
    id: "antrian",
    label: "No. Antri",
  },
  {
    id: "rujukan",
    label: "Rujukan",
  },
];
const dataRawatJalanFormatHandler = (payload) => {
  const result = payload.map((e) => {
    return {
      // no_rm: e.no_rm || "-",
      // nama: e.nama || "-",
      // alamat: e.alamat || "-",
      asuransi: e.asuransi || "-",
      DATETIME_MEDIS: e.DATETIME_MEDIS || "-",
      poliklinik: e.poliklinik || "-",
      dokter: e.dokter || "-",
      antrian: e.antrian || "-",
      rujukan: e.rujukan || "-",
      // id: e.id,
    };
  });
  return result;
};
const rawatInapTableHead = [
  // {
  //   id: "no_rm",
  //   label: "Nomor RM",
  // },
  // {
  //   id: "nik",
  //   label: "NIK",
  // },
  // {
  //   id: "nama",
  //   label: "Nama",
  // },
  // {
  //   id: "alamat",
  //   label: "Alamat",
  // },
  {
    id: "tgl_masuk",
    label: "Tgl Masuk",
  },
  {
    id: "kamar",
    label: "Kamar/Bangsal",
  },
  {
    id: "diet",
    label: "Diet",
  },
  {
    id: "dpjp",
    label: "DPJP",
  },
];
const dataRawatInapFormatHandler = (payload) => {
  const result = payload.map((e) => {
    return {
      // no_rm: e.no_rm || "-",
      // nik: e.nik || "-",
      // nama: e.nama || "-",
      // alamat: e.alamat || "-",
      tgl_masuk: e.tgl_masuk || "-",
      kamar: e.kamar || "-",
      diet: e.diet || "-",
      dpjp: e.dpjp || "-",
      // id: e.id,
    };
  });
  return result;
};

const Detail = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [dataPasien, setDataPasien] = useState({});
  const [detailDataPasien, setDetailDataPasien] = useState({});
  const [isLoadingDataPasien, setIsLoadingDataPasien] = useState(true);
  const [menuState, setMenuState] = useState(null);
  const openMenuPopover = Boolean(menuState);
  const menuPopover = menuState ? "menu-popover" : undefined;
  const [activeContent, setActiveContent] = useState(1);
  const [dataRawatJalan, setDataRawatJalan] = useState([]);
  const [dataRawatInap, setDataRawatInap] = useState([]);
  const [dialogProfileState, setDialogProfileState] = useState(false);

  const OldLayout = (
    <>
      <div className="mb-8">
        <h2 className="m-0 mb-0 color-grey-text">
          {detailDataPasien?.nama_pasien}
        </h2>
        <p className="m-0 font-12 color-grey-text">{detailDataPasien?.no_rm}</p>
      </div>
      <div style={{ color: "#128a43" }}>
        <Tabs
          value={activeContent}
          onChange={(_, newVal) => setActiveContent(newVal)}
          aria-label="wrapped label tabs example"
          // textColor="inherit"
          // TabIndicatorProps={{ style: { background: "#128a43" } }}
        >
          <Tab value={1} label="Detail Pasien" />
          <Tab value={2} label="Riwayat Rawat Jalan" />
          <Tab value={3} label="Riwayat Rawat Inap" />
        </Tabs>
      </div>
      {activeContent === 1 ? (
        <FormPasien
          isEditType
          prePopulatedDataForm={dataPasien}
          detailPrePopulatedData={detailDataPasien}
          updatePrePopulatedData={updateData}
        />
      ) : null}
      {activeContent === 2 ? (
        <>
          <TableLayout
            isCustomHeader
            customHeader={
              <>
                {/* <RawatJalanTableHeader
              refreshData={(payload) =>
                updateDataRawatJalanHandler({
                  ...payload,
                  per_page: dataRawatJalanPerPage,
                })
              }
            /> */}
              </>
            }
            customCreatePath="/pasien/create/rawat-jalan"
            baseRoutePath={`${router.asPath}`}
            title="Pasien Rawat Jalan"
            customBtnAddTitle="pendaftaran rawat jalan"
            tableHead={rawatJalanTableHead}
            data={dataRawatJalan}
            // meta={dataMetaRawatJalan}
            // dataPerPage={dataRawatJalanPerPage}
            // isUpdatingData={isUpdatingDataRawatJalan}
            // updateDataPerPage={(e) => {
            //   setDataRawatJalanPerPage(e.target.value);
            //   updateDataRawatJalanHandler({ per_page: e.target.value });
            // }}
            // updateDataNavigate={(payload) =>
            //   updateDataRawatJalanHandler({
            //     per_page: dataRawatJalanPerPage,
            //     cursor: payload,
            //   })
            // }
            // deleteData={deletaDataRawatJalanHandler}
          />
        </>
      ) : null}
      {activeContent === 3 ? (
        <>
          <TableLayout
            isCustomHeader
            customHeader={
              <>
                {/* <RawatJalanTableHeader
              refreshData={(payload) =>
                updateDataRawatJalanHandler({
                  ...payload,
                  per_page: dataRawatJalanPerPage,
                })
              }
            /> */}
              </>
            }
            customCreatePath="/pasien/create/rawat-jalan"
            baseRoutePath={`${router.asPath}`}
            title="Pasien Rawat Jalan"
            customBtnAddTitle="pendaftaran rawat jalan"
            tableHead={rawatInapTableHead}
            data={dataRawatInap}
            // meta={dataMetaRawatJalan}
            // dataPerPage={dataRawatJalanPerPage}
            // isUpdatingData={isUpdatingDataRawatJalan}
            // updateDataPerPage={(e) => {
            //   setDataRawatJalanPerPage(e.target.value);
            //   updateDataRawatJalanHandler({ per_page: e.target.value });
            // }}
            // updateDataNavigate={(payload) =>
            //   updateDataRawatJalanHandler({
            //     per_page: dataRawatJalanPerPage,
            //     cursor: payload,
            //   })
            // }
            // deleteData={deletaDataRawatJalanHandler}
          />
        </>
      ) : null}
    </>
  );

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
    setDetailDataPasien(data);
    setDataPasien(() => dataFormatter(data));
  };

  useEffect(() => {
    if (router.isReady) {
      (async () => {
        try {
          const response = await getDetailPasien({ id: slug[0] });
          const data = response.data.data;
          const formattedData = dataFormatter(data);
          setDataPasien(formattedData);
          setDetailDataPasien(data);
          if (data?.no_rm) {
            const [responseRawatJalan, responseRawatInap] =
              await Promise.allSettled([
                getListRawatJalan({
                  filter: "no_rm",
                  filter_value: data.no_rm + "",
                }),
                getListRawatInap({
                  filter: "no_rm",
                  filter_value: data.no_rm + "",
                }),
              ]);
            if (responseRawatJalan.status === "fulfilled") {
              setDataRawatJalan(
                dataRawatJalanFormatHandler(responseRawatJalan.value.data.data)
              );
            } else {
              setDataRawatJalan([]);
            }
            if (responseRawatInap.status === "fulfilled") {
              setDataRawatInap(
                dataRawatInapFormatHandler(responseRawatInap.value.data.data)
              );
            } else {
              setDataRawatJalan([]);
            }
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoadingDataPasien(false);
        }
      })();
    }
  }, [router.isReady, slug]);

  return (
    <>
      {isLoadingDataPasien ? (
        <LoaderOnLayout />
      ) : (
        <>
          {/* {OldLayout} */}
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
                  <div className="flex items-center">
                    <Tooltip title="Edit Profile" arrow>
                      <IconButton
                        onClick={() =>
                          setDialogProfileState(!dialogProfileState)
                        }
                      >
                        <BorderColorIcon fontSize="small" color="warning" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <Avatar
                      src={detailDataPasien?.picture}
                      variant="rounded"
                      sx={{ width: 120, height: 120 }}
                    />
                    <div className="ml-8 mt-8">
                      <div className="font-w-700">
                        {dataPasien?.nama_pasien}
                      </div>
                      <div>
                        {detailDataPasien?.tanggal_lahir
                          ? formatLabelDate(detailDataPasien.tanggal_lahir)
                          : ""}{" "}
                        / {detailDataPasien?.umur} tahun
                      </div>
                      <div>
                        {detailDataPasien?.jenis_kelamin
                          ? "Laki-laki"
                          : "Perempuan"}{" "}
                        / {detailDataPasien?.status}
                      </div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <div>NO REKAM MEDIS</div>
                    <div
                      className="font-28 font-w-700"
                      style={{ textAlign: "right" }}
                    >
                      {detailDataPasien?.no_rm}
                    </div>
                  </div>
                </div>
              </Card>
              <Card className="px-14 py-12 mb-16">
                <div className="flex justify-between items-center mb-16">
                  <div className="flex items-center">
                    <CreditCardIcon
                      fontSize="small"
                      style={{ color: "rgb(99, 115, 129)" }}
                    />
                    <p className="m-0 ml-8 font-14">Tagihan / Pembayaran</p>
                  </div>
                  <div className="flex items-center">
                    <Tooltip title="Refresh" arrow>
                      <IconButton>
                        <RefreshIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              </Card>
            </Grid>
            <Grid item md={6} sm={12}>
              <Card className="px-14 py-12 mb-16">
                <div className="flex justify-between items-center mb-16">
                  <div className="flex items-center">
                    <PersonAddIcon
                      fontSize="small"
                      style={{ color: "rgb(99, 115, 129)" }}
                    />
                    <p className="m-0 ml-8 font-14">Pendaftaran Kunjungan</p>
                  </div>
                  <div className="flex items-center">
                    <Tooltip title="Refresh" arrow>
                      <IconButton>
                        <RefreshIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              </Card>
              <Card className="px-14 py-12 mb-16">
                <div className="flex justify-between items-center mb-16">
                  <div className="flex items-center">
                    <GroupIcon
                      fontSize="small"
                      style={{ color: "rgb(99, 115, 129)" }}
                    />
                    <p className="m-0 ml-8 font-14">Kunjungan</p>
                  </div>
                  <div className="flex items-center">
                    <Tooltip title="Refresh" arrow>
                      <IconButton>
                        <RefreshIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              </Card>
            </Grid>
          </Grid>
          <Dialog
            fullScreen
            open={dialogProfileState}
            onClose={() => setDialogProfileState(false)}
          >
            <FormPasien
              isEditType
              prePopulatedDataForm={dataPasien}
              detailPrePopulatedData={detailDataPasien}
              updatePrePopulatedData={updateData}
            />
          </Dialog>
        </>
      )}
    </>
  );
};

export default Detail;
