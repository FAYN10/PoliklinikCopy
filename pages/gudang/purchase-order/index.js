import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {getPurchaseOrder, deletePurchaseOrder} from 'api/gudang/purchase-order';
import TableLayoutGudang from 'components/TableLayoutGudang';
import LoaderOnLayout from 'components/LoaderOnLayout';
import Snackbar from 'components/SnackbarMui';
import {formatReadable} from 'utils/formatTime';

const PurchaseOrderTableHead = [
  {
    id: 'nomor_po',
    label: 'Nomor PO',
  },
  {
    id: 'tanggal_po',
    label: 'Tanggal PO',
  },
  {
    id: 'po_type',
    label: 'Jenis Surat',
  },
  {
    id: 'supplier',
    label: 'Supplier',
  },
  {
    id: 'gudang',
    label: 'Gudang',
  },
  {
    id: 'action',
    label: '',
  },
];

const dataPurchaseOrderFormatHandler = (payload) => {
  const result = payload.map((e) => {
    return {
      nomor_po: e.nomor_po || 'null',
      tanggal_po: formatReadable(e.tanggal_po) || 'null',
      potype: e.potype || 'null',
      supplier: e.supplier || 'null',
      gudang: e.gudang || 'null',
      id: e.id,
    };
  });
  return result;
};

const PurchaseOrder = () => {
  const router = useRouter();
  const [snackbarState, setSnackbarState] = useState({
    state: false,
    type: null,
    message: '',
  });

  // PurchaseOrder --general state
  const [dataPurchaseOrder, setDataPurchaseOrder] = useState([]);
  const [dataMetaPurchaseOrder, setDataMetaPurchaseOrder] = useState({});
  const [dataPurchaseOrderPerPage, setDataPerPage] = useState(8);
  const [isLoadingDataPurchaseOrder, setIsLoadingDataPurchaseOrder] =
    useState(false);
  const [isUpdatingDataPurchaseOrder, setIsUpdatingDataPurchaseOrder] =
    useState(false);

  // PurchaseOrder --general handler
  const initDataPurchaseOrder = async () => {
    try {
      setIsLoadingDataPurchaseOrder(true);
      const params = {
        per_page: dataPurchaseOrderPerPage,
      };
      const response = await getPurchaseOrder(params);
      const result = dataPurchaseOrderFormatHandler(response.data.data);
      setDataPurchaseOrder(result);
      setDataMetaPurchaseOrder(response.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataPurchaseOrder(false);
    }
  };

  const updateDataPurchaseOrderHandler = async (payload) => {
    try {
      setIsUpdatingDataPurchaseOrder(true);
      const response = await getPurchaseOrder(payload);
      const result = dataPurchaseOrderFormatHandler(response.data.data);
      setDataPurchaseOrder(result);
      setDataMetaPurchaseOrder(response.data.meta);
    } catch (error) {
      console.log(error);
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataPurchaseOrder(false);
    }
  };

  const deleteDataPurchaseOrderHandler = async (payload) => {
    try {
      setIsUpdatingDataPurchaseOrder(true);
      const response = await deletePurchaseOrder({id: payload});
      setSnackbarState({
        state: true,
        type: 'success',
        message: response.data.message,
      });
      updateDataPurchaseOrderHandler({per_page: dataPurchaseOrderPerPage});
    } catch (error) {
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataPurchaseOrder(false);
    }
  };

  const searchDataPurchaseOrderHandler = async (payload) => {
    const searchParams = payload.reduce((obj, e) => {
      obj[e.type] = e.value;
      return obj;
    }, {});

    try {
      setIsUpdatingDataPurchaseOrder(true);
      const response = await getPurchaseOrder({
        search: searchParams,
        per_page: dataPurchaseOrderPerPage,
      });
      if (response.data.data.length !== 0) {
        const result = dataPurchaseOrderFormatHandler(response.data.data);
        setDataPurchaseOrder(result);
        setDataMetaPurchaseOrder(response.data.meta);
      } else {
        setSnackbarState({
          state: true,
          type: 'warning',
          message: `${payload} tidak ditemukan`,
        });
        const response = await getPurchaseOrder({
          per_page: dataPurchaseOrderPerPage,
        });
        const result = dataPurchaseOrderFormatHandler(response.data.data);
        setDataPurchaseOrder(result);
        setDataMetaPurchaseOrder(response.data.meta);
      }
    } catch (error) {
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataPurchaseOrder(false);
    }
  };

  useEffect(() => {
    initDataPurchaseOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoadingDataPurchaseOrder ? (
        <LoaderOnLayout />
      ) : (
        <>
          <TableLayoutGudang
            baseRoutePath={`${router.asPath}`}
            title='Purchase Order'
            isBtnAdd={true}
            isTerima={true}
            isDelete={true}
            tableHead={PurchaseOrderTableHead}
            data={dataPurchaseOrder}
            meta={dataMetaPurchaseOrder}
            dataPerPage={dataPurchaseOrderPerPage}
            isUpdatingData={isUpdatingDataPurchaseOrder}
            filterOptions={[
              {label: 'Gudang', value: 'gudang'},
              {label: 'Jenis Surat', value: 'potype'},
              {label: 'Nomor PO', value: 'nomor_po'},
              {label: 'Supplier', value: 'supplier'},
              {label: 'Tanggal PO', value: 'date'},
            ]}
            updateDataPerPage={(e, filter) => {
              const searchParams = filter.reduce((obj, e) => {
                obj[e.type] = e.value;
                return obj;
              }, {});

              setDataPerPage(e.target.value);
              updateDataPurchaseOrderHandler({
                per_page: e.target.value,
                search: searchParams,
              });
            }}
            updateDataNavigate={(payload) =>
              updateDataPurchaseOrderHandler({
                per_page: dataPurchaseOrderPerPage,
                cursor: payload,
              })
            }
            refreshData={() =>
              updateDataPurchaseOrderHandler({
                per_page: dataPurchaseOrderPerPage,
              })
            }
            deleteData={deleteDataPurchaseOrderHandler}
            searchData={searchDataPurchaseOrderHandler}
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

export default PurchaseOrder;
