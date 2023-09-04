import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {getGudang} from 'api/gudang/gudang';
import TableLayoutGudang from 'components/TableLayoutGudang';
import LoaderOnLayout from 'components/LoaderOnLayout';
import Snackbar from 'components/SnackbarMui';
import {formatReadable} from 'utils/formatTime';
import * as XLSX from 'xlsx';
import {saveAs} from 'file-saver';
import {Button} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

const LaporanStokOpnameTableHead = [
  {
    id: 'no',
    label: 'No',
  },
  {
    id: 'po_type',
    label: 'Kategori',
  },
  {
    id: 'total_stok',
    label: 'Total Stok',
  },
  {
    id: 'total_pembelian',
    label: 'Total Pembelian',
  },
];

const dataLaporanStokOpnameFormatHandler = (payload) => {
  let index = 0;
  const result = payload.map((e) => {
    return {
      no: (index += 1),
      po_type: e.kategori || 'null',
      total_stok: e.total_stok || 'null',
      total_pembelian: e.total_pembelian || 'null',
    };
  });
  return result;
};

const LaporanPembelianTableHead = [
  {
    id: 'no',
    label: 'No',
  },
  {
    id: 'supplier',
    label: 'Supplier',
  },
  {
    id: 'nomor_faktur',
    label: 'Nomor Faktur',
  },
  {
    id: 'tanggal_pembelian',
    label: 'Tanggal Pembelian',
  },
  {
    id: 'tanggal_jatuh_tempo',
    label: 'Jatuh Tempo Pembayaran',
  },
  {
    id: 'harga_beli_satuan',
    label: 'Harga Beli',
  },
  {
    id: 'diskon',
    label: 'Diskon',
  },
  {
    id: 'ppn',
    label: 'PPN',
  },
  {
    id: 'total_pembelian',
    label: 'Total Pembelian',
  },
];

const dataLaporanPembelianFormatHandler = (payload) => {
  let index = 0;
  const result = payload.map((e) => {
    return {
      no: (index += 1),
      supplier: e.supplier || 'null',
      nomor_faktur: e.nomor_faktur || 'null',
      tanggal_pembelian: formatReadable(e.tanggal_pembelian) || 'null',
      tanggal_jatuh_tempo: formatReadable(e.tanggal_jatuh_tempo) || 'null',
      harga_beli_satuan: e.harga_beli_satuan || 'null',
      diskon: e.diskon || 'null',
      ppn: e.ppn || 'null',
      total_pembelian: e.total_pembelian || 'null',
    };
  });
  return result;
};

const LaporanPembelianKategoriTableHead = [
  {
    id: 'no',
    label: 'No',
  },
  {
    id: 'kategori',
    label: 'Kategori',
  },
  {
    id: 'total_stok',
    label: 'Total Stok',
  },
  {
    id: 'total_pembelian',
    label: 'Total Pembelian',
  },
];

const dataLaporanPembelianKategoriFormatHandler = (payload) => {
  let index = 0;
  const result = payload.map((e) => {
    return {
      no: (index += 1),
      kategori: e.kategori || 'null',
      total_stok: e.total_stok || 'null',
      total_pembelian: e.total_pembelian || 'null',
    };
  });
  return result;
};

const LaporanStokEdTableHead = [
  {
    id: 'no',
    label: 'No',
  },
  {
    id: 'nama_item',
    label: 'Nama Item',
  },
  {
    id: 'harga_beli',
    label: 'Harga Beli',
  },
  {
    id: 'jumlah',
    label: 'Jumlah',
  },
  {
    id: 'total',
    label: 'Total',
  },
  {
    id: 'tanggal_ed',
    label: 'Expired Date',
  },
];

const dataLaporanStokEdFormatHandler = (payload) => {
  let index = 0;
  const result = payload.map((e) => {
    return {
      no: (index += 1),
      nama_item: e.item || 'null',
      harga_beli: e.harga_beli || 'null',
      jumlah: e.jumlah || 'null',
      total: e.total || 'null',
      tanggal_ed: formatReadable(e.tanggal_ed) || 'null',
    };
  });
  return result;
};

const LaporanStokMatiTableHead = [
  {
    id: 'no',
    label: 'No',
  },
  {
    id: 'nama_item',
    label: 'Nama Item',
  },
  {
    id: 'stok',
    label: 'Jumlah',
  },
  {
    id: 'tanggal_ed',
    label: 'Expired Date',
  },
];

const dataLaporanStokMatiFormatHandler = (payload) => {
  let index = 0;
  const result = payload.map((e) => {
    return {
      no: (index += 1),
      nama_item: e.item || 'null',
      stok: e.stok || 'null',
      tanggal_ed: formatReadable(e.tanggal_ed) || 'null',
    };
  });
  return result;
};

const Laporan = () => {
  const router = useRouter();
  const [snackbarState, setSnackbarState] = useState({
    state: false,
    type: null,
    message: '',
  });
  const [activeContent, setActiveContent] = useState(1);

  // Laporan Stok Opname --general state
  const [dataLaporanStokOpname, setDataLaporanStokOpname] = useState([]);
  const [dataMetaLaporanStokOpname, setDataMetaLaporanStokOpname] = useState(
    {}
  );
  const [dataLaporanStokOpnamePerPage, setDataLaporanStokOpnamePerPage] =
    useState(8);
  const [isLoadingDataLaporanStokOpname, setIsLoadingDataLaporanStokOpname] =
    useState(false);
  const [isUpdatingDataLaporanStokOpname, setIsUpdatingDataLaporanStokOpname] =
    useState(false);

  // Laporan Pembelian --general state
  const [dataLaporanPembelian, setDataLaporanPembelian] = useState([]);
  const [dataMetaLaporanPembelian, setDataMetaLaporanPembelian] = useState({});
  const [dataLaporanPembelianPerPage, setDataLaporanPembelianPerPage] =
    useState(8);
  const [isLoadingDataLaporanPembelian, setIsLoadingDataLaporanPembelian] =
    useState(false);
  const [isUpdatingDataLaporanPembelian, setIsUpdatingDataLaporanPembelian] =
    useState(false);

  // Laporan Pembelian --general state
  const [dataLaporanPembelianKategori, setDataLaporanPembelianKategori] =
    useState([]);
  const [
    dataMetaLaporanPembelianKategori,
    setDataMetaLaporanPembelianKategori,
  ] = useState({});
  const [
    dataLaporanPembelianKategoriPerPage,
    setDataLaporanPembelianKategoriPerPage,
  ] = useState(8);
  const [
    isLoadingDataLaporanPembelianKategori,
    setIsLoadingDataLaporanPembelianKategori,
  ] = useState(false);
  const [
    isUpdatingDataLaporanPembelianKategori,
    setIsUpdatingDataLaporanPembelianKategori,
  ] = useState(false);

  // Laporan Stok ED --general state
  const [dataLaporanStokEd, setDataLaporanStokEd] = useState([]);
  const [dataMetaLaporanStokEd, setDataMetaLaporanStokEd] = useState({});
  const [dataLaporanStokEdPerPage, setDataLaporanStokEdPerPage] = useState(8);
  const [isLoadingDataLaporanStokEd, setIsLoadingDataLaporanStokEd] =
    useState(false);
  const [isUpdatingDataLaporanStokEd, setIsUpdatingDataLaporanStokEd] =
    useState(false);

  // Laporan Stok Mati --general state
  const [dataLaporanStokMati, setDataLaporanStokMati] = useState([]);
  const [dataMetaLaporanStokMati, setDataMetaLaporanStokMati] = useState({});
  const [dataLaporanStokMatiPerPage, setDataLaporanStokMatiPerPage] =
    useState(8);
  const [isLoadingDataLaporanStokMati, setIsLoadingDataLaporanStokMati] =
    useState(false);
  const [isUpdatingDataLaporanStokMati, setIsUpdatingDataLaporanStokMati] =
    useState(false);

  // Laporan Stok Opname --general handler
  const initDataLaporanStokOpname = async () => {
    try {
      setIsLoadingDataLaporanStokOpname(true);
      const params = {
        laporan: 'opname',
        per_page: dataLaporanStokOpnamePerPage,
      };
      const response = await getGudang(params);
      const result = dataLaporanStokOpnameFormatHandler(response.data.data);
      setDataLaporanStokOpname(result);
      setDataMetaLaporanStokOpname(response.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataLaporanStokOpname(false);
    }
  };

  const updateDataLaporanStokOpnameHandler = async (payload) => {
    try {
      setIsUpdatingDataLaporanStokOpname(true);
      const response = await getGudang(payload);
      const result = dataLaporanStokOpnameFormatHandler(response.data.data);
      setDataLaporanStokOpname(result);
      setDataMetaLaporanStokOpname(response.data.meta);
    } catch (error) {
      console.log(error);
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataLaporanStokOpname(false);
    }
  };

  const searchDataLaporanStokOpnameHandler = async (payload) => {
    const searchParams = payload.reduce((obj, e) => {
      obj[e.type] = e.value;
      return obj;
    }, {});

    try {
      setIsUpdatingDataLaporanStokOpname(true);
      const response = await getGudang({
        search: searchParams,
        laporan: 'opname',
        per_page: dataLaporanStokOpnamePerPage,
      });
      if (response.data.data.length !== 0) {
        const result = dataLaporanStokOpnameFormatHandler(response.data.data);
        setDataLaporanStokOpname(result);
        setDataMetaLaporanStokOpname(response.data.meta);
      } else {
        setSnackbarState({
          state: true,
          type: 'warning',
          message: `${payload} tidak ditemukan`,
        });
        const response = await getGudang({
          per_page: dataLaporanStokOpnamePerPage,
        });
        const result = dataLaporanStokOpnameFormatHandler(response.data.data);
        setDataLaporanStokOpname(result);
        setDataMetaLaporanStokOpname(response.data.meta);
      }
    } catch (error) {
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataLaporanStokOpname(false);
    }
  };

  // Laporan Pembelian --general handler
  const initDataLaporanPembelian = async () => {
    try {
      setIsLoadingDataLaporanPembelian(true);
      const params = {
        laporan: 'pembelian',
        per_page: dataLaporanPembelianPerPage,
      };
      const response = await getGudang(params);
      const result = dataLaporanPembelianFormatHandler(response.data.data);
      setDataLaporanPembelian(result);
      setDataMetaLaporanPembelian(response.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataLaporanPembelian(false);
    }
  };

  const updateDataLaporanPembelianHandler = async (payload) => {
    try {
      setIsUpdatingDataLaporanPembelian(true);
      const response = await getGudang(payload);
      const result = dataLaporanPembelianFormatHandler(response.data.data);
      setDataLaporanPembelian(result);
      setDataMetaLaporanPembelian(response.data.meta);
    } catch (error) {
      console.log(error);
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataLaporanPembelian(false);
    }
  };

  const searchDataLaporanPembelianHandler = async (payload) => {
    const searchParams = payload.reduce((obj, e) => {
      obj[e.type] = e.value;
      return obj;
    }, {});

    try {
      setIsUpdatingDataLaporanPembelian(true);
      const response = await getGudang({
        search: searchParams,
        laporan: 'pembelian',
        per_page: dataLaporanPembelianPerPage,
      });
      if (response.data.data.length !== 0) {
        const result = dataLaporanPembelianFormatHandler(response.data.data);
        setDataLaporanPembelian(result);
        setDataMetaLaporanPembelian(response.data.meta);
      } else {
        setSnackbarState({
          state: true,
          type: 'warning',
          message: `${payload} tidak ditemukan`,
        });
        const response = await getGudang({
          per_page: dataLaporanPembelianPerPage,
        });
        const result = dataLaporanPembelianFormatHandler(response.data.data);
        setDataLaporanPembelian(result);
        setDataMetaLaporanPembelian(response.data.meta);
      }
    } catch (error) {
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataLaporanPembelian(false);
    }
  };

  // Laporan Pembelian Kategori --general handler
  const initDataLaporanPembelianKategori = async () => {
    try {
      setIsLoadingDataLaporanPembelianKategori(true);
      const params = {
        laporan: 'pembelian_kategori',
        per_page: dataLaporanPembelianPerPage,
      };
      const response = await getGudang(params);
      const result = dataLaporanPembelianKategoriFormatHandler(
        response.data.data
      );
      setDataLaporanPembelianKategori(result);
      setDataMetaLaporanPembelianKategori(response.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataLaporanPembelianKategori(false);
    }
  };

  const updateDataLaporanPembelianKategoriHandler = async (payload) => {
    try {
      setIsUpdatingDataLaporanPembelianKategori(true);
      const response = await getGudang(payload);
      const result = dataLaporanPembelianKategoriFormatHandler(
        response.data.data
      );
      setDataLaporanPembelianKategori(result);
      setDataMetaLaporanPembelianKategori(response.data.meta);
    } catch (error) {
      console.log(error);
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataLaporanPembelianKategori(false);
    }
  };

  const searchDataLaporanPembelianKategoriHandler = async (payload) => {
    const searchParams = payload.reduce((obj, e) => {
      obj[e.type] = e.value;
      return obj;
    }, {});

    try {
      setIsUpdatingDataLaporanPembelian(true);
      const response = await getGudang({
        search: searchParams,
        laporan: 'pembelian_kategori',
        per_page: dataLaporanPembelianPerPage,
      });
      if (response.data.data.length !== 0) {
        const result = dataLaporanPembelianKategoriFormatHandler(
          response.data.data
        );
        setDataLaporanPembelianKategori(result);
        setDataMetaLaporanPembelianKategori(response.data.meta);
      } else {
        setSnackbarState({
          state: true,
          type: 'warning',
          message: `${payload} tidak ditemukan`,
        });
        const response = await getGudang({
          per_page: dataLaporanPembelianPerPage,
        });
        const result = dataLaporanPembelianKategoriFormatHandler(
          response.data.data
        );
        setDataLaporanPembelianKategori(result);
        setDataMetaLaporanPembelianKategori(response.data.meta);
      }
    } catch (error) {
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataLaporanPembelianKategori(false);
    }
  };

  // Laporan Stok ED --general handler
  const initDataLaporanStokEd = async () => {
    try {
      setIsLoadingDataLaporanStokEd(true);
      const params = {
        laporan: 'expired',
        per_page: dataLaporanStokEdPerPage,
      };
      const response = await getGudang(params);
      const result = dataLaporanStokEdFormatHandler(response.data.data);
      setDataLaporanStokEd(result);
      setDataMetaLaporanStokEd(response.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataLaporanStokEd(false);
    }
  };

  const updateDataLaporanStokEdHandler = async (payload) => {
    try {
      setIsUpdatingDataLaporanStokEd(true);
      const response = await getGudang(payload);
      const result = dataLaporanStokEdFormatHandler(response.data.data);
      setDataLaporanStokEd(result);
      setDataMetaLaporanStokEd(response.data.meta);
    } catch (error) {
      console.log(error);
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataLaporanStokEd(false);
    }
  };

  const searchDataLaporanStokEdHandler = async (payload) => {
    const searchParams = payload.reduce((obj, e) => {
      obj[e.type] = e.value;
      return obj;
    }, {});

    try {
      setIsUpdatingDataLaporanStokEd(true);
      const response = await getGudang({
        search: searchParams,
        laporan: 'expired',
        per_page: dataLaporanStokEdPerPage,
      });
      if (response.data.data.length !== 0) {
        const result = dataLaporanStokEdFormatHandler(response.data.data);
        setDataLaporanStokEd(result);
        setDataMetaLaporanStokEd(response.data.meta);
      } else {
        setSnackbarState({
          state: true,
          type: 'warning',
          message: `${payload} tidak ditemukan`,
        });
        const response = await getGudang({
          per_page: dataLaporanStokEdPerPage,
        });
        const result = dataLaporanStokEdFormatHandler(response.data.data);
        setDataLaporanStokEd(result);
        setDataMetaLaporanStokEd(response.data.meta);
      }
    } catch (error) {
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataLaporanStokEd(false);
    }
  };

  // Laporan Stok Mati --general handler
  const initDataLaporanStokMati = async () => {
    try {
      setIsLoadingDataLaporanStokMati(true);
      const params = {
        laporan: 'mati',
        per_page: dataLaporanStokMatiPerPage,
      };
      const response = await getGudang(params);
      const result = dataLaporanStokMatiFormatHandler(response.data.data);
      setDataLaporanStokMati(result);
      setDataMetaLaporanStokMati(response.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataLaporanStokMati(false);
    }
  };

  const updateDataLaporanStokMatiHandler = async (payload) => {
    try {
      setIsUpdatingDataLaporanStokMati(true);
      const response = await getGudang(payload);
      const result = dataLaporanStokMatiFormatHandler(response.data.data);
      setDataLaporanStokMati(result);
      setDataMetaLaporanStokMati(response.data.meta);
    } catch (error) {
      console.log(error);
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataLaporanStokMati(false);
    }
  };

  const searchDataLaporanStokMatiHandler = async (payload) => {
    const searchParams = payload.reduce((obj, e) => {
      obj[e.type] = e.value;
      return obj;
    }, {});

    try {
      setIsUpdatingDataLaporanStokMati(true);
      const response = await getGudang({
        search: searchParams,
        laporan: 'mati',
        per_page: dataLaporanStokMatiPerPage,
      });
      if (response.data.data.length !== 0) {
        const result = dataLaporanStokMatiFormatHandler(response.data.data);
        setDataLaporanStokMati(result);
        setDataMetaLaporanStokMati(response.data.meta);
      } else {
        setSnackbarState({
          state: true,
          type: 'warning',
          message: `${payload} tidak ditemukan`,
        });
        const response = await getGudang({
          per_page: dataLaporanStokMatiPerPage,
        });
        const result = dataLaporanStokMatiFormatHandler(response.data.data);
        setDataLaporanStokMati(result);
        setDataMetaLaporanStokMati(response.data.meta);
      }
    } catch (error) {
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataLaporanStokMati(false);
    }
  };

  const generateExcelData = (data) => {
    const sheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, 'Laporan');
    const excelBlob = new Blob(
      [XLSX.write(workbook, {bookType: 'xlsx', type: 'array'})],
      {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }
    );
    return excelBlob;
  };

  const handleDownloadExcelOpname = () => {
    const excelBlob = generateExcelData(dataLaporanStokOpname);
    saveAs(excelBlob, 'Laporan Stok Opname.xlsx');
  };
  const handleDownloadExcelPembelian = () => {
    const excelBlob = generateExcelData(dataLaporanPembelian);
    saveAs(excelBlob, 'Laporan Pembelian.xlsx');
  };
  const handleDownloadExcelKategori = () => {
    const excelBlob = generateExcelData(dataLaporanPembelianKategori);
    saveAs(excelBlob, 'Laporan Pembelian Kategori.xlsx');
  };
  const handleDownloadExcelEd = () => {
    const excelBlob = generateExcelData(dataLaporanStokEd);
    saveAs(excelBlob, 'Laporan Stok ED.xlsx');
  };
  const handleDownloadExcelMati = () => {
    const excelBlob = generateExcelData(dataLaporanStokMati);
    saveAs(excelBlob, 'Laporan Stok Mati.xlsx');
  };

  useEffect(() => {
    if (Object.keys(router.query).length !== 0) {
      setActiveContent(parseInt(router.query.active_content));
    }
  }, [router]);

  useEffect(() => {
    switch (activeContent) {
      case 1: {
        initDataLaporanStokOpname();
        break;
      }
      case 2: {
        initDataLaporanPembelian();
        break;
      }
      case 3: {
        initDataLaporanPembelianKategori();
        break;
      }
      case 4: {
        initDataLaporanStokEd();
        break;
      }
      case 5: {
        initDataLaporanStokMati();
        break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeContent]);

  return (
    <>
      {isLoadingDataLaporanStokOpname ||
      isLoadingDataLaporanPembelian ||
      isLoadingDataLaporanPembelianKategori ||
      isLoadingDataLaporanStokEd ||
      isLoadingDataLaporanStokMati ? (
        <LoaderOnLayout />
      ) : (
        <>
          <div className='tab-list flex mb-24'>
            <div
              className={activeContent === 1 ? 'pointer active' : 'pointer'}
              onClick={() => setActiveContent(1)}
            >
              Laporan Stok Opname
            </div>
            <div
              className={activeContent === 2 ? 'pointer active' : 'pointer'}
              onClick={() => setActiveContent(2)}
            >
              Laporan Pembelian
            </div>
            <div
              className={activeContent === 3 ? 'pointer active' : 'pointer'}
              onClick={() => setActiveContent(3)}
            >
              Laporan Pembelian Kategori
            </div>
            <div
              className={activeContent === 4 ? 'pointer active' : 'pointer'}
              onClick={() => setActiveContent(4)}
            >
              Laporan Stok ED
            </div>
            <div
              className={activeContent === 5 ? 'pointer active' : 'pointer'}
              onClick={() => setActiveContent(5)}
            >
              Laporan Stok Mati
            </div>
          </div>
          {activeContent === 1 && (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '20px',
                }}
              >
                <Button
                  variant='contained'
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadExcelOpname}
                >
                  Download Laporan
                </Button>
              </div>
              <TableLayoutGudang
                baseRoutePath={`${router.asPath}`}
                title=''
                isBtnAdd={false}
                tableHead={LaporanStokOpnameTableHead}
                data={dataLaporanStokOpname}
                meta={dataMetaLaporanStokOpname}
                dataPerPage={dataLaporanStokOpnamePerPage}
                isUpdatingData={isUpdatingDataLaporanStokOpname}
                filterOptions={[{label: 'Jenis Surat', value: 'potype'}]}
                updateDataPerPage={(e, filter) => {
                  const searchParams = filter.reduce((obj, e) => {
                    obj[e.type] = e.value;
                    return obj;
                  }, {});

                  setDataPerPage(e.target.value);
                  updateDataLaporanStokOpnameHandler({
                    laporan: 'opname',
                    per_page: e.target.value,
                    search: searchParams,
                  });
                }}
                updateDataNavigate={(payload) =>
                  updateDataLaporanStokOpnameHandler({
                    laporan: 'opname',
                    per_page: dataLaporanStokOpnamePerPage,
                    cursor: payload,
                  })
                }
                refreshData={() =>
                  updateDataLaporanStokOpnameHandler({
                    laporan: 'opname',
                    per_page: dataLaporanStokOpnamePerPage,
                  })
                }
                searchData={searchDataLaporanStokOpnameHandler}
              />
            </>
          )}
          {activeContent === 2 && (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '20px',
                }}
              >
                <Button
                  variant='contained'
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadExcelPembelian}
                >
                  Download Laporan
                </Button>
              </div>
              <TableLayoutGudang
                baseRoutePath={`${router.asPath}`}
                title=''
                isBtnAdd={false}
                tableHead={LaporanPembelianTableHead}
                data={dataLaporanPembelian}
                meta={dataMetaLaporanPembelian}
                dataPerPage={dataLaporanPembelianPerPage}
                isUpdatingData={isUpdatingDataLaporanPembelian}
                filterOptions={[
                  {label: 'Supplier', value: 'supplier'},
                  {label: 'Nomor Faktur', value: 'nomor_faktur'},
                  {label: 'Tanggal Pembelian', value: 'date'},
                ]}
                updateDataPerPage={(e, filter) => {
                  const searchParams = filter.reduce((obj, e) => {
                    obj[e.type] = e.value;
                    return obj;
                  }, {});

                  setDataPerPage(e.target.value);
                  updateDataLaporanPembelianHandler({
                    laporan: 'pembelian',
                    per_page: e.target.value,
                    search: searchParams,
                  });
                }}
                updateDataNavigate={(payload) =>
                  updateDataLaporanPembelianHandler({
                    laporan: 'pembelian',
                    per_page: dataLaporanPembelianPerPage,
                    cursor: payload,
                  })
                }
                refreshData={() =>
                  updateDataLaporanPembelianHandler({
                    laporan: 'pembelian',
                    per_page: dataLaporanPembelianPerPage,
                  })
                }
                searchData={searchDataLaporanPembelianHandler}
              />
            </>
          )}
          {activeContent === 3 && (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '20px',
                }}
              >
                <Button
                  variant='contained'
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadExcelKategori}
                >
                  Download Laporan
                </Button>
              </div>
              <TableLayoutGudang
                baseRoutePath={`${router.asPath}`}
                title=''
                isBtnAdd={false}
                tableHead={LaporanPembelianKategoriTableHead}
                data={dataLaporanPembelianKategori}
                meta={dataMetaLaporanPembelianKategori}
                dataPerPage={dataLaporanPembelianKategoriPerPage}
                isUpdatingData={isUpdatingDataLaporanPembelianKategori}
                filterOptions={[{label: 'Tahun', value: 'date'}]}
                updateDataPerPage={(e, filter) => {
                  const searchParams = filter.reduce((obj, e) => {
                    obj[e.type] = e.value;
                    return obj;
                  }, {});

                  setDataPerPage(e.target.value);
                  updateDataLaporanPembelianKategoriHandler({
                    laporan: 'pembelian_kategori',
                    per_page: e.target.value,
                    search: searchParams,
                  });
                }}
                updateDataNavigate={(payload) =>
                  updateDataLaporanPembelianKategoriHandler({
                    laporan: 'pembelian_kategori',
                    per_page: dataLaporanPembelianKategoriPerPage,
                    cursor: payload,
                  })
                }
                refreshData={() =>
                  updateDataLaporanPembelianKategoriHandler({
                    laporan: 'pembelian_kategori',
                    per_page: dataLaporanPembelianKategoriPerPage,
                  })
                }
                searchData={searchDataLaporanPembelianKategoriHandler}
              />
            </>
          )}
          {activeContent === 4 && (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '20px',
                }}
              >
                <Button
                  variant='contained'
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadExcelEd}
                >
                  Download Laporan
                </Button>
              </div>
              <TableLayoutGudang
                baseRoutePath={`${router.asPath}`}
                title=''
                isBtnAdd={false}
                tableHead={LaporanStokEdTableHead}
                data={dataLaporanStokEd}
                meta={dataMetaLaporanStokEd}
                dataPerPage={dataLaporanStokEdPerPage}
                isUpdatingData={isUpdatingDataLaporanStokEd}
                filterOptions={[
                  {label: 'Nama Item', value: 'item'},
                  {label: 'Tanggal ED', value: 'date'},
                  // {label: 'Gudang', value: 'gudang'},
                ]}
                updateDataPerPage={(e, filter) => {
                  const searchParams = filter.reduce((obj, e) => {
                    obj[e.type] = e.value;
                    return obj;
                  }, {});

                  setDataPerPage(e.target.value);
                  updateDataLaporanStokEdHandler({
                    laporan: 'expired',
                    per_page: e.target.value,
                    search: searchParams,
                  });
                }}
                updateDataNavigate={(payload) =>
                  updateDataLaporanStokEdHandler({
                    laporan: 'expired',
                    per_page: dataLaporanStokEdPerPage,
                    cursor: payload,
                  })
                }
                refreshData={() =>
                  updateDataLaporanStokEdHandler({
                    laporan: 'expired',
                    per_page: dataLaporanStokEdPerPage,
                  })
                }
                searchData={searchDataLaporanStokEdHandler}
              />
            </>
          )}
          {activeContent === 5 && (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '20px',
                }}
              >
                <Button
                  variant='contained'
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadExcelMati}
                >
                  Download Laporan
                </Button>
              </div>
              <TableLayoutGudang
                baseRoutePath={`${router.asPath}`}
                title=''
                isBtnAdd={false}
                tableHead={LaporanStokMatiTableHead}
                data={dataLaporanStokMati}
                meta={dataMetaLaporanStokMati}
                dataPerPage={dataLaporanStokMatiPerPage}
                isUpdatingData={isUpdatingDataLaporanStokMati}
                filterOptions={[
                  {label: 'Nama Item', value: 'item'},
                  // {label: 'Gudang', value: 'gudang'},
                ]}
                updateDataPerPage={(e, filter) => {
                  const searchParams = filter.reduce((obj, e) => {
                    obj[e.type] = e.value;
                    return obj;
                  }, {});

                  setDataPerPage(e.target.value);
                  updateDataLaporanStokMatiHandler({
                    laporan: 'mati',
                    per_page: e.target.value,
                    search: searchParams,
                  });
                }}
                updateDataNavigate={(payload) =>
                  updateDataLaporanStokMatiHandler({
                    laporan: 'mati',
                    per_page: dataLaporanStokMatiPerPage,
                    cursor: payload,
                  })
                }
                refreshData={() =>
                  updateDataLaporanStokMatiHandler({
                    laporan: 'mati',
                    per_page: dataLaporanStokMatiPerPage,
                  })
                }
                searchData={searchDataLaporanStokMatiHandler}
              />
            </>
          )}
        </>
      )}
      <Snackbar
        state={snackbarState.state}
        setState={(payload) =>
          setSnackbarState({
            state: payload,
            type: null,
            message: '',
          })
        }
        message={snackbarState.message}
        isSuccessType={snackbarState.type === 'success'}
        isErrorType={snackbarState.type === 'error'}
        isWarningType={snackbarState.type === 'warning'}
      />
    </>
  );
};

export default Laporan;
