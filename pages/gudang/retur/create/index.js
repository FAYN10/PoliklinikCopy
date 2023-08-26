import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {getPembelian, getDetailPembelian} from 'api/gudang/pembelian';
import TableLayoutGudang from 'components/TableLayoutGudang';
import LoaderOnLayout from 'components/LoaderOnLayout';
import Snackbar from 'components/SnackbarMui';
import {Card, CardContent} from '@mui/material';
import TableLayoutDetail from 'components/TableLayoutDetailGudang';

const daftarPembelianTableHead = [
  {
    id: 'nomor_faktur',
    label: 'Nomor Faktur',
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
      supplier: e.purchase_order.supplier.name || 'null',
      id: e.id,
    };
  });
  return result;
};

const daftarItemTableHead = [
  {
    id: 'kode_item',
    label: 'Kode Item',
  },
  {
    id: 'nomor_batch',
    label: 'Nomor Batch',
  },
  {
    id: 'tanggal_ed',
    label: 'Expired Date',
  },
  {
    id: 'jumlah',
    label: 'Jumlah',
  },
];

const dataItemFormatHandler = (payload) => {
  const result = payload.map((e) => {
    return {
      kode_item: e.item.kode || 'null',
      nomor_batch: e.nomor_batch || 'null',
      tanggal_ed: e.tanggal_ed || 'null',
      jumlah: e.stok || 'null',
      id: e.id,
    };
  });
  return result;
};

const PreRetur = () => {
  const router = useRouter();
  const [snackbarState, setSnackbarState] = useState({
    state: false,
    type: null,
    message: '',
  });

  // Pembelian --general state
  const [dataPembelian, setDataPembelian] = useState([]);
  const [dataMetaPembelian, setDataMetaPembelian] = useState({});
  const [dataPembelianPerPage, setDataPembelianPerPage] = useState(8);
  const [isLoadingDataPembelian, setIsLoadingDataPembelian] = useState(false);
  const [isUpdatingDataPembelian, setIsUpdatingDataPembelian] = useState(false);
  // Item --general state
  const [dataItem, setDataItem] = useState([]);
  const [dataMetaItem, setDataMetaItem] = useState({});
  const [dataItemPerPage, setDataItemPerPage] = useState(8);
  const [isLoadingDataItem, setIsLoadingDataItem] = useState(false);
  const [isUpdatingDataItem, setIsUpdatingDataItem] = useState(false);

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

  // Item --general handler
  const initDataItem = async () => {
    try {
      setIsLoadingDataItem(true);
      const params = {
        id: 1,
      };
      const response = await getDetailPembelian(params);
      const result = dataItemFormatHandler(response.data.data.gudang);
      setDataItem(result);
      setDataMetaItem(response.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataItem(false);
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

  const updateDataItemHandler = async (payload) => {
    try {
      setIsUpdatingDataItem(true);
      const response = await getDetailPembelian(payload);
      const result = dataItemFormatHandler(response.data.data.gudang);
      setDataItem(result);
      setDataMetaItem(response.data.meta);
    } catch (error) {
      console.log(error);
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataItem(false);
    }
  };

  const searchDataPembelianHandler = async (payload) => {
    try {
      setIsUpdatingDataPembelian(true);
      const response = await searchPembelian({
        search_text: payload.map((e) => e.value),
        search_column: payload.map((e) => e.type),
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
        const result = dataPembelianFormatHandler(
          response.data.data.receive_detail
        );
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

  const searchDataItemHandler = async (payload) => {
    try {
      setIsUpdatingDataItem(true);
      const response = await searchItem({
        search_text: payload.map((e) => e.value),
        search_column: payload.map((e) => e.type),
        per_page: dataItemPerPage,
      });
      if (response.data.data.length !== 0) {
        const result = dataItemFormatHandler(response.data.data);
        setDataItem(result);
        setDataMetaItem(response.data.meta);
      } else {
        setSnackbarState({
          state: true,
          type: 'warning',
          message: `${payload} tidak ditemukan`,
        });
        const response = await getDetailPembelian({
          per_page: dataItemPerPage,
        });
        const result = dataItemFormatHandler(response.data.data);
        setDataItem(result);
        setDataMetaItem(response.data.meta);
      }
    } catch (error) {
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataItem(false);
    }
  };

  useEffect(() => {
    initDataPembelian();
    initDataItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoadingDataPembelian || isLoadingDataItem ? (
        <LoaderOnLayout />
      ) : (
        <>
          <div style={{display: 'flex'}}>
            <Card style={{flex: 1, padding: '20px', marginRight: '5px'}}>
              <CardContent>
                <TableLayoutGudang
                  baseRoutePath={`${router.asPath}`}
                  title='Daftar Pembelian'
                  isBtnAdd={false}
                  tableHead={daftarPembelianTableHead}
                  data={dataPembelian}
                  meta={dataMetaPembelian}
                  dataPerPage={dataPembelianPerPage}
                  isUpdatingData={isUpdatingDataPembelian}
                  filterOptions={[
                    {label: 'Nomor Faktur', value: 'nomor_faktur'},
                    {label: 'Supplier', value: 'supplier'},
                  ]}
                  updateDataPerPage={(e, filter) => {
                    setDataPembelianPerPage(e.target.value);
                    updateDataPembelianHandler({
                      per_page: e.target.value,
                      search_text: filter.map((e) => e.value),
                      search_column: filter.map((e) => e.type),
                    });
                  }}
                  updateDataNavigate={(payload) =>
                    updateDataPembelianHandler({
                      per_page: dataPembelianPerPage,
                      cursor: payload,
                    })
                  }
                  refreshData={() =>
                    updateDataPembelianHandler({per_page: dataPembelianPerPage})
                  }
                  searchData={searchDataPembelianHandler}
                />
              </CardContent>
            </Card>
            <Card style={{flex: 1, padding: '20px'}}>
              <CardContent>
                <TableLayoutDetail
                  baseRoutePath={`${router.asPath}`}
                  title='Daftar Item'
                  tableHead={daftarItemTableHead}
                  data={dataItem}
                  meta={dataMetaItem}
                  dataPerPage={dataItemPerPage}
                  isUpdatingData={isUpdatingDataItem}
                  updateDataPerPage={(e, filter) => {
                    setDataItemPerPage(e.target.value);
                    updateDataItemHandler({
                      per_page: e.target.value,
                      search_text: filter.map((e) => e.value),
                      search_column: filter.map((e) => e.type),
                    });
                  }}
                  updateDataNavigate={(payload) =>
                    updateDataItemHandler({
                      per_page: dataItemPerPage,
                      cursor: payload,
                    })
                  }
                  refreshData={() =>
                    updateDataItemHandler({per_page: dataItemPerPage})
                  }
                  searchData={searchDataItemHandler}
                />
              </CardContent>
            </Card>
          </div>
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

export default PreRetur;
