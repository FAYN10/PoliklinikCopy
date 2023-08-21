import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {getGudang} from 'api/gudang/gudang';
import TableLayoutGudang from 'components/TableLayoutGudang';
import LoaderOnLayout from 'components/LoaderOnLayout';
import Snackbar from 'components/SnackbarMui';
import {formatReadable} from 'utils/formatTime';

const LaporanTableHead = [
  {
    id: 'kode_item',
    label: 'Kode Item',
  },
  {
    id: 'nama_item',
    label: 'Nama Item',
  },
  {
    id: 'nomor_batch',
    label: 'Nomor Batch',
  },
  {
    id: 'gudang',
    label: 'Gudang',
  },
  {
    id: 'stok',
    label: 'Stok',
  },
  {
    id: 'sediaan',
    label: 'Sediaan',
  },
  {
    id: 'harga_beli_satuan',
    label: 'Harga Beli',
  },
  {
    id: 'harga_jual_satuan',
    label: 'Harga Jual',
  },
  {
    id: 'diskon',
    label: 'Diskon',
  },
  {
    id: 'margin',
    label: 'Margin',
  },
  {
    id: 'total_pembelian',
    label: 'Total Pembelian',
  },
  {
    id: 'tanggal_ed',
    label: 'Expired Date',
  },
];

const dataLaporanFormatHandler = (payload) => {
  const result = payload.map((e) => {
    return {
      kode_item: e.item.kode || 'null',
      nama_item: e.item.name || 'null',
      nomor_batch: e.nomor_batch || 'null',
      gudang: e.gudang || 'null',
      stok: e.stok || 'null',
      sediaan: e.sediaan.name || 'null',
      harga_beli_satuan: e.harga_beli_satuan || 'null',
      harga_jual_satuan: e.harga_jual_satuan || 'null',
      diskon: e.diskon || 'null',
      margin: e.margin || 'null',
      total_pembelian: e.total_pembelian || 'null',
      tanggal_ed: formatReadable(e.tanggal_ed) || 'null',
      id: e.id,
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

  // Laporan --general state
  const [dataLaporan, setDataLaporan] = useState([]);
  const [dataMetaLaporan, setDataMetaLaporan] = useState({});
  const [dataLaporanPerPage, setDataPerPage] = useState(8);
  const [isLoadingDataLaporan, setIsLoadingDataLaporan] = useState(false);
  const [isUpdatingDataLaporan, setIsUpdatingDataLaporan] = useState(false);

  // Laporan --general handler
  const initDataLaporan = async () => {
    try {
      setIsLoadingDataLaporan(true);
      const params = {
        per_page: dataLaporanPerPage,
      };
      const response = await getGudang(params);
      const result = dataLaporanFormatHandler(response.data.data);
      setDataLaporan(result);
      setDataMetaLaporan(response.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataLaporan(false);
    }
  };

  const updateDataLaporanHandler = async (payload) => {
    try {
      setIsUpdatingDataLaporan(true);
      const response = await getGudang(payload);
      const result = dataLaporanFormatHandler(response.data.data);
      setDataLaporan(result);
      setDataMetaLaporan(response.data.meta);
    } catch (error) {
      console.log(error);
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataLaporan(false);
    }
  };

  const deleteDataLaporanHandler = async (payload) => {
    try {
      setIsUpdatingDataLaporan(true);
      const response = await deleteLaporan({id: payload});
      setSnackbarState({
        state: true,
        type: 'success',
        message: response.data.message,
      });
      updateDataLaporanHandler({per_page: dataLaporanPerPage});
    } catch (error) {
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataLaporan(false);
    }
  };

  const searchDataLaporanHandler = async (payload) => {
    try {
      setIsUpdatingDataLaporan(true);
      const response = await searchLaporan({
        search_text: payload.map((e) => e.value),
        search_column: payload.map((e) => e.type),
        per_page: dataLaporanPerPage,
      });
      if (response.data.data.length !== 0) {
        const result = dataLaporanFormatHandler(response.data.data);
        setDataLaporan(result);
        setDataMetaLaporan(response.data.meta);
      } else {
        setSnackbarState({
          state: true,
          type: 'warning',
          message: `${payload} tidak ditemukan`,
        });
        const response = await getLaporan({
          per_page: dataLaporanPerPage,
        });
        const result = dataLaporanFormatHandler(response.data.data);
        setDataLaporan(result);
        setDataMetaLaporan(response.data.meta);
      }
    } catch (error) {
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataLaporan(false);
    }
  };

  useEffect(() => {
    initDataLaporan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoadingDataLaporan ? (
        <LoaderOnLayout />
      ) : (
        <>
          <TableLayoutGudang
            baseRoutePath={`${router.asPath}`}
            title='Laporan'
            isBtnAdd={false}
            tableHead={LaporanTableHead}
            data={dataLaporan}
            meta={dataMetaLaporan}
            dataPerPage={dataLaporanPerPage}
            isUpdatingData={isUpdatingDataLaporan}
            filterOptions={[
              {label: 'Kode Item', value: 'kode_item'},
              {label: 'Nama Item', value: 'nama_item'},
              {label: 'Gudang', value: 'gudang'},
              {label: 'Nomor Batch', value: 'nomor_batch'},
              {label: 'Tanggal ED', value: 'date'},
            ]}
            updateDataPerPage={(e, filter) => {
              setDataPerPage(e.target.value);
              updateDataLaporanHandler({
                per_page: e.target.value,
                search_text: filter.map((e) => e.value),
                search_column: filter.map((e) => e.type),
              });
            }}
            updateDataNavigate={(payload) =>
              updateDataLaporanHandler({
                per_page: dataLaporanPerPage,
                cursor: payload,
              })
            }
            refreshData={() =>
              updateDataLaporanHandler({per_page: dataLaporanPerPage})
            }
            deleteData={deleteDataLaporanHandler}
            searchData={searchDataLaporanHandler}
          />
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
