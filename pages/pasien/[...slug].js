import { useState, useEffect, useRef, forwardRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
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
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ReactToPrint from "react-to-print";

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
  const generalConsentPrintRef = useRef();

  // not used
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

  const GeneralConsentToPrint = forwardRef(function GeneralConsentToPrint(
    { data },
    ref
  ) {
    return (
      <div ref={ref} className="printableContent">
        <div className="m-8" style={{ color: "blue" }}>
          <div className="border-gs full-width">
            <div className="flex">
              <div
                className="p-12 flex justify-center items-center border-gs--right"
                style={{ width: "20%" }}
              >
                <Image
                  src="/icons/logo.png"
                  width={120}
                  height={120}
                  alt="rsmp"
                />
              </div>
              <div className="p-12 border-gs--right" style={{ width: "35%" }}>
                <div className="font-w-600">
                  <div className="font-18">RSU MITRA PARAMEDIKA</div>
                  <div>
                    Jln. Raya Ngemplak, Kemasan Widodomartani, Ngemplak Sleman
                    55584 Telp. (0274) 4461098
                  </div>
                </div>
              </div>
              <div
                className="flex"
                style={{ width: "45%", flexDirection: "column" }}
              >
                <div className="flex border-gs--bottom" style={{ flex: 1 }}>
                  <div className="border-gs--right ml-8" style={{ flex: 1 }}>
                    Nama
                  </div>
                  <div style={{ flex: 1.5 }}></div>
                </div>
                <div className="flex border-gs--bottom" style={{ flex: 1 }}>
                  <div className="border-gs--right ml-8" style={{ flex: 1 }}>
                    Tanggal lahir
                  </div>
                  <div style={{ flex: 1.5 }}></div>
                </div>
                <div className="flex" style={{ flex: 1 }}>
                  <div className="border-gs--right ml-8" style={{ flex: 1 }}>
                    No RM
                  </div>
                  <div style={{ flex: 1.5 }}></div>
                </div>
              </div>
            </div>
            <div
              className="py-12 font-w-700 font-22 border-gs--top border-gs--bottom"
              style={{ textAlign: "center" }}
            >
              GENERAL CONSENT
            </div>
            <div className="py-8 pl-8 border-gs--bottom">IDENTITAS PASIEN</div>
            <div className="flex mb-12" style={{ flexDirection: "column" }}>
              <div className="flex">
                <div className="ml-16" style={{ flex: 0.8 }}>
                  Nama Pasien
                </div>
                <div style={{ flex: 2.2 }}>: {data?.nama_pasien}</div>
              </div>
              <div className="flex">
                <div className="ml-16" style={{ flex: 0.8 }}>
                  Nomor Rekam Medis
                </div>
                <div style={{ flex: 2.2 }}>: {data?.no_rm}</div>
              </div>
              <div className="flex">
                <div className="ml-16" style={{ flex: 0.8 }}>
                  Tanggal Lahir
                </div>
                <div style={{ flex: 2.2 }}>: {data?.tanggal_lahir}</div>
              </div>
              <div className="flex">
                <div className="ml-16" style={{ flex: 0.8 }}>
                  Jenis Kelamin
                </div>
                <div style={{ flex: 2.2 }}>
                  : {data?.tanggal_lahir ? "L" : "P"}
                </div>
              </div>
            </div>
            <div className="py-4 pl-8 border-gs--top border-gs--bottom">
              Yang bertanda tangan di bawah ini :
            </div>
            <div className="flex mb-12" style={{ flexDirection: "column" }}>
              <div className="flex">
                <div className="ml-16" style={{ flex: 0.8 }}>
                  Nama
                </div>
                <div style={{ flex: 2.2 }}>:</div>
              </div>
              <div className="flex">
                <div className="ml-16" style={{ flex: 0.8 }}>
                  Alamat
                </div>
                <div style={{ flex: 2.2 }}>:</div>
              </div>
              <div className="flex">
                <div className="ml-16" style={{ flex: 0.8 }}>
                  No. Telepon
                </div>
                <div style={{ flex: 2.2 }}>:</div>
              </div>
              <div className="flex">
                <div className="ml-16" style={{ flex: 0.8 }}>
                  Hubungan dengan pasien
                </div>
                <div className="flex" style={{ flex: 2.2 }}>
                  <div className="mr-20">:</div>
                  <div className="flex font-14">
                    <div className="flex items-center mr-20">
                      <div
                        className="border-gs"
                        style={{ height: "10px", width: "10px" }}
                      ></div>
                      <div className="ml-4">Diri sendiri</div>
                    </div>
                    <div className="flex items-center mr-20">
                      <div
                        className="border-gs"
                        style={{ height: "10px", width: "10px" }}
                      ></div>
                      <div className="ml-4">Suami</div>
                    </div>
                    <div className="flex items-center mr-20">
                      <div
                        className="border-gs"
                        style={{ height: "10px", width: "10px" }}
                      ></div>
                      <div className="ml-4">Istri</div>
                    </div>
                    <div className="flex items-center mr-20">
                      <div
                        className="border-gs"
                        style={{ height: "10px", width: "10px" }}
                      ></div>
                      <div className="ml-4">Anak</div>
                    </div>
                    <div className="flex items-center mr-20">
                      <div
                        className="border-gs"
                        style={{ height: "10px", width: "10px" }}
                      ></div>
                      <div className="ml-4">Orang Tua</div>
                    </div>
                    <div className="flex items-center mr-20">
                      <div
                        className="border-gs"
                        style={{ height: "10px", width: "10px" }}
                      ></div>
                      <div className="ml-4">
                        Keluarga ......................
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="py-4 pl-8 border-gs--top border-gs--bottom">
              Dengan ini saya menyatakan telah mendapatkan informasi secara
              jelas, telah memahami dan menyatakan persetujuan atas hal-hal
              sebagai berikut :
            </div>
            <div className="flex border-gs--bottom">
              <div className="pl-8 py-8 font-w-600" style={{ flex: 0.1 }}>
                1.
              </div>
              <div
                className="py-8 border-gs--left border-gs--right px-8"
                style={{ flex: 2.2 }}
              >
                <span className="font-w-700">
                  Informasi Ketentuan Pembayaran
                </span>{" "}
                <br /> Saya memahami tentang ketentuan pembayaran biaya pengobat
              </div>
              <div className="py-8 pl-8" style={{ flex: 0.7 }}>
                Setuju/Tidak Setuju *)
              </div>
            </div>
            <div className="flex border-gs--bottom">
              <div className="pl-8 py-8 font-w-600" style={{ flex: 0.1 }}>
                2.
              </div>
              <div
                className="py-8 border-gs--left border-gs--right px-8"
                style={{ flex: 2.2 }}
              >
                <span className="font-w-700">
                  Informasi tentang Hak dan Kewajiban Pasien
                </span>
                <ol type="a" style={{ margin: 0, paddingLeft: "20px" }}>
                  <li>
                    Saya memiliki hak untuk mengambil bagian dalam keputusan
                    mengenai penyakit saya dan dalam hal perawatan medis dan
                    rencana pengobatan
                  </li>
                  <li>
                    Saya telah mendapat informasi tentang hak dan kewajiban
                    pasien di RSU Mitra Paramedika melalui leaflet dan banner
                    yang diedukasi oleh petugas
                  </li>
                </ol>
              </div>
              <div className="py-8 pl-8" style={{ flex: 0.7 }}>
                Setuju/Tidak Setuju *)
              </div>
            </div>
            <div className="flex border-gs--bottom">
              <div className="pl-8 py-8 font-w-600" style={{ flex: 0.1 }}>
                3.
              </div>
              <div
                className="py-8 border-gs--left border-gs--right px-8"
                style={{ flex: 2.2 }}
              >
                <span className="font-w-700">
                  Informasi tentang Tata Tertib RS
                </span>
                <ol type="a" style={{ margin: 0, paddingLeft: "20px" }}>
                  <li>
                    Saya telah diinformasikan tata tertib yang berlaku di rumah
                    sakit, termasuk tidak membawa barang berharga untuk
                    menghindari terjadinya kehilangan selama perawatan di rumah
                    sakit
                  </li>
                  <li>
                    Saya telah diinformasikan rumah sakit tidak mengijinkan
                    keluarga berkunjung di luar jam kunjung
                  </li>
                  <li>
                    Saya telah diinformasikan bahwa pasien yang tidak dapat
                    menjaga barang miliknya, misal pasien gawat darurat, tidak
                    sadar dan pasien yang menyatakan tidak mampu menjaga barang
                    miliknya maka akan dititipkan di rumah sakit sesuai
                    ketentuan yang ada
                  </li>
                  <li>
                    Saya telah diinformasikan bahwa pasien dan keluarga wajib
                    menjaga barang miliknya dan tidak meninggalkan barang tanpa
                    ada yang menjaganya, kehilangan barang yang tidak dititipkan
                    merupakan tanggung jawab pribadi
                  </li>
                </ol>
              </div>
              <div className="py-8 pl-8" style={{ flex: 0.7 }}>
                Setuju/Tidak Setuju *)
              </div>
            </div>
            <div className="flex border-gs--bottom">
              <div className="pl-8 py-8 font-w-600" style={{ flex: 0.1 }}>
                4.
              </div>
              <div
                className="py-8 border-gs--left border-gs--right px-8"
                style={{ flex: 2.2 }}
              >
                <span className="font-w-700">Kebutuhan Penterjemah Bahasa</span>
              </div>
              <div className="py-8 pl-8" style={{ flex: 0.7 }}>
                Ya/Tidak *)
              </div>
            </div>
            <div className="flex border-gs--bottom">
              <div className="pl-8 py-8 font-w-600" style={{ flex: 0.1 }}>
                5.
              </div>
              <div
                className="py-8 border-gs--left border-gs--right px-8"
                style={{ flex: 2.2 }}
              >
                <span className="font-w-700">Kebutuhan Rohaniawan</span> <br />{" "}
                Saya telah diinformasikan tentang pelayanan kerohanian yang
                berada dir rumah sakit sesuai dengna agama/kepercayaan pasien
                dan cara pemberian bimbingan kerohanian disesuaikan dengan
                fasilitas di rumah sakit dan kebutuhan pasien
              </div>
              <div className="py-8 pl-8" style={{ flex: 0.7 }}>
                Ya/Tidak *)
              </div>
            </div>
            <div className="flex border-gs--bottom">
              <div className="pl-8 py-8 font-w-600" style={{ flex: 0.1 }}>
                6.
              </div>
              <div
                className="py-8 border-gs--left border-gs--right px-8"
                style={{ flex: 2.2 }}
              >
                <div className="font-w-700 mb-8">
                  Pelepasan Informasi / Kerahasiaan Informasi
                </div>
                <ol type="a" style={{ margin: 0, paddingLeft: "20px" }}>
                  <li className="border-gs--bottom mb-12">
                    Hasil Pemeriksaan Penunjang dapat Diberikan kepada Pihak
                    Penjamin
                  </li>
                  <li className="border-gs--bottom mb-12">
                    Hasil Pemeriksaan Penunjang dapat Diakses oleh Peserta Didik
                  </li>
                  <li className="border-gs--bottom mb-36">
                    Anggota Keluarga Lain yang dapat Diberikan Informasi Data
                    Pasien
                  </li>
                  <li className="">Fasyankes tertentu dalam rangka rujukan</li>
                </ol>
              </div>
              <div className="py-8 pl-8" style={{ flex: 0.7 }}>
                <div className="mb-8">Setuju/Tidak Setuju *)</div>
                <div className="border-gs--bottom mb-12">
                  Setuju/Tidak Setuju *)
                </div>
                <div className="border-gs--bottom mb-12">
                  Setuju/Tidak Setuju *)
                </div>
                <div className="mb-12 pr-8">
                  <div className="full-width">
                    <span>1</span>
                    <div style={{ borderBottom: "2px dotted blue" }}></div>
                  </div>
                  <div className="full-width">
                    <span>2</span>
                    <div style={{ borderBottom: "2px dotted blue" }}></div>
                  </div>
                </div>
                <div className="">Setuju/Tidak Setuju *)</div>
              </div>
            </div>
            <div className="py-4 font-w-700 pl-8 border-gs--bottom">
              Demikian surat persetujuan umum ini saya buat dengan sesungguhnya
              dan tanpa paksaan dari pihak manapun
            </div>
            <div className="flex border-gs--bottom" style={{}}>
              <div className="py-8 border-gs--right" style={{ flex: 1 }}></div>
              <div className="py-8 pl-8 flex" style={{ flex: 1 }}>
                <div style={{ flex: 1.6 }}>Sleman,</div>
                <div style={{ flex: 0.4 }}>Pukul</div>
              </div>
            </div>
            <div className="flex border-gs--bottom" style={{}}>
              <div className="py-8 border-gs--right" style={{ flex: 1 }}>
                <div style={{ textAlign: "center" }}>
                  Yang memberikan penjelasan
                </div>
                <div style={{ height: "120px" }}></div>
                <div className="px-8">
                  <div style={{ borderBottom: "2px dotted blue" }}></div>
                </div>
              </div>
              <div className="pl-8 py-8" style={{ flex: 1 }}>
                <div style={{ textAlign: "center" }}>
                  Yang memberikan penjelasan
                </div>
                <div style={{ height: "120px" }}></div>
                <div className="px-8">
                  <div style={{ borderBottom: "2px dotted blue" }}></div>
                </div>
              </div>
            </div>
            <div className="py-8 pl-8 font-w-700">
              Keterangan *) : coret salah satu
            </div>
          </div>
        </div>
      </div>
    );
  });

  const GeneralConsent = (
    <div>
      <ReactToPrint
        trigger={() => (
          <Tooltip title="Cetak General Consent" arrow>
            <IconButton>
              <AssignmentTurnedInIcon fontSize="small" color="primary" />
            </IconButton>
          </Tooltip>
        )}
        content={() => generalConsentPrintRef.current}
      />
      <GeneralConsentToPrint
        data={detailDataPasien}
        ref={generalConsentPrintRef}
      />
    </div>
  );

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
            <Grid item md={5} sm={12}>
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
                    {GeneralConsent}
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
            </Grid>
            <Grid item md={7} sm={12}>
              <Card className="px-14 py-12 mb-16">
                <div className="flex justify-between items-center mb-16">
                  <div className="flex items-center">
                    <GroupIcon
                      fontSize="small"
                      style={{ color: "rgb(99, 115, 129)" }}
                    />
                    <p className="m-0 ml-8 font-14">Riwayat Rawat Jalan</p>
                  </div>
                  <div className="flex items-center">
                    <Tooltip title="Tambah Rawat Jalan" arrow>
                      <IconButton
                        onClick={() =>
                          // router.push("/pasien/create/rawat-jalan")
                          router.push(
                            {
                              pathname: "/pasien/create/rawat-jalan",
                              query: {
                                no_rm: detailDataPasien?.no_rm,
                                id: slug[0],
                              },
                            },
                            "/pasien/create/rawat-jalan"
                          )
                        }
                      >
                        <PersonAddIcon fontSize="small" color="primary" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
                <div>
                  {dataRawatJalan.length ? (
                    <>
                      <TableLayout
                        isCustomHeader
                        customHeader={<></>}
                        customCreatePath="/pasien/create/rawat-jalan"
                        baseRoutePath={`${router.asPath}`}
                        title="Pasien Rawat Jalan"
                        customBtnAddTitle="pendaftaran rawat jalan"
                        tableHead={rawatJalanTableHead}
                        data={dataRawatJalan}
                      />
                    </>
                  ) : (
                    <>Tidak ada riwayat</>
                  )}
                </div>
              </Card>
              <Card className="px-14 py-12 mb-16">
                <div className="flex justify-between items-center mb-16">
                  <div className="flex items-center">
                    <GroupIcon
                      fontSize="small"
                      style={{ color: "rgb(99, 115, 129)" }}
                    />
                    <p className="m-0 ml-8 font-14">Riwayat Rawat Inap</p>
                  </div>
                  <div className="flex items-center">
                    <Tooltip title="Tambah Rawat Inap" arrow>
                      <IconButton
                        onClick={() =>
                          // router.push("/pasien/create/rawat-inap")
                          router.push(
                            {
                              pathname: "/pasien/create/rawat-inap",
                              query: {
                                no_rm: detailDataPasien?.no_rm,
                                id: slug[0],
                              },
                            },
                            "/pasien/create/rawat-inap"
                          )
                        }
                      >
                        <PersonAddIcon fontSize="small" color="primary" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
                <div>
                  {dataRawatInap.length ? (
                    <>
                      <TableLayout
                        isCustomHeader
                        customHeader={<></>}
                        customCreatePath="/pasien/create/rawat-inap"
                        baseRoutePath={`${router.asPath}`}
                        title="Pasien Rawat Inap"
                        customBtnAddTitle="pendaftaran rawat inap"
                        tableHead={rawatInapTableHead}
                        data={dataRawatInap}
                      />
                    </>
                  ) : (
                    <>Tidak ada riwayat</>
                  )}
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
              handleClose={() => setDialogProfileState(false)}
            />
          </Dialog>
        </>
      )}
    </>
  );
};

export default Detail;
