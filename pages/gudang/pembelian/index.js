import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {getPembelian} from 'api/gudang/pembelian';
import TableLayoutGudang from 'components/TableLayoutGudang';
import LoaderOnLayout from 'components/LoaderOnLayout';
import Snackbar from 'components/SnackbarMui';
import {formatReadable} from 'utils/formatTime';

const PembelianTableHead = [
  {
    id: 'nomor_faktur',
    label: 'Nomor Faktur',
  },
  {
    id: 'nomor_po',
    label: 'Nomor PO',
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
    id: 'supplier',
    label: 'Supplier',
  },
];

const dataPembelianFormatHandler = (payload) => {
  const result = payload.map((e) => {
    return {
      nomor_faktur: e.nomor_faktur || 'null',
      nomor_po: e.nomor_po || 'null',
      tanggal_pembelian: formatReadable(e.tanggal_pembelian) || 'null',
      tanggal_jatuh_tempo: formatReadable(e.tanggal_jatuh_tempo) || 'null',
      supplier: e.supplier || 'null',
      id: e.id,
    };
  });
  return result;
};

const Pembelian = () => {
  const router = useRouter();
  const [snackbarState, setSnackbarState] = useState({
    state: false,
    type: null,
    message: '',
  });

  // Pembelian --general state
  const [dataPembelian, setDataPembelian] = useState([]);
  const [dataMetaPembelian, setDataMetaPembelian] = useState({});
  const [dataPembelianPerPage, setDataPerPage] = useState(8);
  const [isLoadingDataPembelian, setIsLoadingDataPembelian] = useState(false);
  const [isUpdatingDataPembelian, setIsUpdatingDataPembelian] = useState(false);

  // Pembelian --general handler
  const initDataPembelian = async () => {
    try {
      setIsLoadingDataPembelian(true);
      const params = {
        per_page: dataPembelianPerPage,
      };
      const response = await getPembelian(params);
      const result = dataPembelianFormatHandler(response.data.data);
      setDataPembelian(result);
      setDataMetaPembelian(response.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataPembelian(false);
    }
  };

  const updateDataPembelianHandler = async (payload) => {
    try {
      setIsUpdatingDataPembelian(true);
      const response = await getPembelian(payload);
      const result = dataPembelianFormatHandler(response.data.data);
      setDataPembelian(result);
      setDataMetaPembelian(response.data.meta);
    } catch (error) {
      console.log(error);
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataPembelian(false);
    }
  };

  const deleteDataPembelianHandler = async (payload) => {
    try {
      setIsUpdatingDataPembelian(true);
      const response = await deletePembelian({id: payload});
      setSnackbarState({
        state: true,
        type: 'success',
        message: response.data.message,
      });
      updateDataPembelianHandler({per_page: dataPembelianPerPage});
    } catch (error) {
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataPembelian(false);
    }
  };

  const searchDataPembelianHandler = async (payload) => {
    const searchParams = payload.reduce((obj, e) => {
      obj[e.type] = e.value;
      return obj;
    }, {});

    try {
      setIsUpdatingDataPembelian(true);
      const response = await getPembelian({
        search: searchParams,
        per_page: dataPembelianPerPage,
      });
      if (response.data.data.length !== 0) {
        const result = dataPembelianFormatHandler(response.data.data);
        setDataPembelian(result);
        setDataMetaPembelian(response.data.meta);
      } else {
        setSnackbarState({
          state: true,
          type: 'warning',
          message: `${payload} tidak ditemukan`,
        });
        const response = await getPembelian({
          per_page: dataPembelianPerPage,
        });
        const result = dataPembelianFormatHandler(response.data.data);
        setDataPembelian(result);
        setDataMetaPembelian(response.data.meta);
      }
    } catch (error) {
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataPembelian(false);
    }
  };

  useEffect(() => {
    initDataPembelian();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoadingDataPembelian ? (
        <LoaderOnLayout />
      ) : (
        <>
          <TableLayoutGudang
            baseRoutePath={`${router.asPath}`}
            title='Pembelian'
            isBtnAdd={true}
            tableHead={PembelianTableHead}
            data={dataPembelian}
            meta={dataMetaPembelian}
            dataPerPage={dataPembelianPerPage}
            isUpdatingData={isUpdatingDataPembelian}
            filterOptions={[
              // { label: "Gudang", value: "gudang" },
              {label: 'Nomor Faktur', value: 'nomor_faktur'},
              {label: 'Supplier', value: 'supplier'},
              {label: 'Tanggal Pembelian', value: 'date'},
            ]}
            updateDataPerPage={(e, filter) => {
              const searchParams = filter.reduce((obj, e) => {
                obj[e.type] = e.value;
                return obj;
              }, {});

              setDataPerPage(e.target.value);
              updateDataPembelianHandler({
                per_page: e.target.value,
                search: searchParams,
              });
            }}
            updateDataNavigate={(payload) =>
              updateDataPembelianHandler({
                per_page: dataPembelianPerPage,
                cursor: payload,
              })
            }
            refreshData={() =>
              updateDataPembelianHandler({
                per_page: dataPembelianPerPage,
              })
            }
            deleteData={deleteDataPembelianHandler}
            searchData={searchDataPembelianHandler}
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

export default Pembelian;
