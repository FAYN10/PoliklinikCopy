import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getDetailPasien } from "api/pasien";
import { getListPermintaanPemeriksaanRadiologi } from "api/radiologi";
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
import FormExpertise from "components/modules/radiologi/formExpertise";
import RiwayatPemeriksaanTable from "components/modules/radiologi/riwayatPemeriksaanTable";
import Assessment from "components/modules/radiologi/assessment";

const DetailRadiologi = () => {
  const [isEditingMode, setIsEditingMode] = useState(false);
  const router = useRouter();
  const { slug } = router.query;
  const [dataPermintaanRadiologi, setDataPermintaanRadiologi] = useState([]);
  const [isLoadingDataPermintaanRadiologi, setIsLoadingDataPermintaanRadiologi] = useState(true);  
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

  const permintaanTableHead = [
    {
      id: "no_pemeriksaan",
      label: "No. Pemeriksaan"
    },
    {
      id: "waktu_permintaan_pemeriksaan",
      label: "Waktu Permintaan"
    },
    {
      id: "nama_pemeriksaan",
      label: "Nama Pemeriksaan"
    },
    {
      id: "jenis_pemeriksaan",
      label: "Jenis Pemeriksaan"
    },
    {
      id: "dokter_pengirim",
      label: "Dokter Pengirim"
    },
    {
      id: "unit_pengirim",
      label: "Unit Pengirim"
    },
    {
      id: "diagnosis_kerja",
      label: "Diagnosis Kerja",
    },
    {
      id: "catatan_permintaan",
      label: "Catatan Permintaan"
    }
  ]

  const riwayatPemeriksaanTableHead = [
    {
      id: "tanggal_pemeriksaan",
      label: "Tanggal Pemeriksaan"
    },
    {
      id: "no_pemeriksaan",
      label: "No. Pemeriksaan"
    },
    {
      id: "nama_pemeriksaan",
      label: "Nama Pemeriksaan"
    },
    {
      id: "jenis_pemeriksaan",
      label: "Jenis Pemeriksaan"
    },
    {
      id: "dokter_pengirim",
      label: "Dokter Pengirim"
    },
    {
      id: "diagnosis_kerja",
      label: "Diagnosis Kerja"
    }

  ]
  const fetchPermintaanRadiologi = async () => {
    try {
      const response = await getListPermintaanPemeriksaanRadiologi(detailDataRadiologi.id);
      const permintaanData = response.data;
      setDataPermintaanRadiologi(permintaanData);
    } catch (error) {
      console.error("Error fetching permintaan radiologi:", error);
    } finally {
      setIsLoadingDataPermintaanRadiologi(false);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      (async () => {
        try {
          const response = await getDetailRadiologi({ id: slug[0] });
          const data = response.data.data;
          setDetailDataRadiologi(data);
  
          setIsLoadingDataRadiologi(false); 
          setIsLoadingDataPermintaanRadiologi(true); 
          fetchPermintaanRadiologi(); 
        } catch (error) {
          console.log(error);
          setIsLoadingDataRadiologi(false);
          setIsLoadingDataPermintaanRadiologi(false); 
        }
      })();
    }
  }, [router.isReady, slug]);
  const dataPermintaanRadiologiFormatHandler = (payload) => {const result = payload.map((e) => {
    return {
      no_pemeriksaan: e.no_pemeriksaan || "null",
      waktu_permintaan_pemeriksaan: e.waktu_permintaan_pemeriksaan || "null",
      nama_pemeriksaan: e.nama_pemeriksaan || "null",
      jenis_pemeriksaan: e.jenis_pemeriksaan || "null",
      dokter_pengirim: e.dokter_pengirim || "null",
      unit_pengirim: e.unit_pengirim || "null",
      diagnosis_kerja: e.diagnosis_kerja || "null",
      catatan_permintaan: e.catatan_permintaan || "null",
    };
    });
    return result;
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
      permintaan: [],
      riwayat: [],
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

  
  

  const menuItems = [
    {
      label: "Permintaan Radiologi",
      content: isLoadingDataPermintaanRadiologi ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h2>Permintaan Radiologi</h2>
          <table>
            <thead>
              <tr>
                {permintaanTableHead.map((column) => (
                  <th key={column.id}>{column.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataPermintaanRadiologi.map((item, index) => (
                <tr key={index}>
                  <td>{item.no_pemeriksaan}</td>
                  <td>{item.waktu_permintaan_pemeriksaan}</td>
                  <td>{item.nama_pemeriksaan}</td>
                  <td>{item.jenis_pemeriksaan}</td>
                  <td>{item.diagnosis_kerja}</td>
                  <td>{item.catatan_permintaan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
    { 
      label: "Assessment Pemeriksaan", 
      component: <Assessment 
                    namaPemeriksaan={detailDataRadiologi.permintaan?.[0]?.nama_pemeriksaan}
                    jenisPemeriksaan={detailDataRadiologi.permintaan?.[0]?.jenis_pemeriksaan} 
                  /> 
    },
    { label: "Hasil Pemeriksaan", component: <FormExpertise /> },
    { label: "Riwayat Pemeriksaan", component: <RiwayatPemeriksaanTable /> },
  ];

  const [selectedTab, setSelectedTab] = useState(0);

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
          <Tabs
            value={selectedTab}
            onChange={(event, newValue) => setSelectedTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Sub-menu"
            sx={{ marginBottom: "16px" }} // Add spacing below the tabs
          >
            {menuItems.map((item, index) => (
              <Tab
                key={index}
                label={item.label}
                sx={{
                  borderBottom: selectedTab === index ? "2px solid #3f51b5" : "none",
                  marginRight: "16px", // Add spacing between tabs
                }}
              />
            ))}
          </Tabs>
          <Card
            sx={{
              border: "1px solid #e0e0e0",
              borderTop: "none",
              borderRadius: "0px",
              marginBottom: "16px", // Add spacing below the card
            }}
          >
            {menuItems[selectedTab].component}
          </Card>
        </>
      )}
    </>
  );
};

export default DetailRadiologi;