import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {getRetur} from 'api/gudang/retur';
import TableLayoutGudang from 'components/TableLayoutGudang';
import LoaderOnLayout from 'components/LoaderOnLayout';
import Snackbar from 'components/SnackbarMui';

const ReturTableHead = [
  {
    id: 'nomor_retur',
    label: 'Nomor Retur',
  },
  {
    id: 'nomor_faktur',
    label: 'Nomor Faktur',
  },
  {
    id: 'supplier',
    label: 'Supplier',
  },
  {
    id: 'gudang',
    label: 'Gudang',
  },
];

const dataReturFormatHandler = (payload) => {
  const result = payload.map((e) => {
    return {
      nomor_retur: e.nomor_retur || 'null',
      nomor_faktur: e.nomor_faktur || 'null',
      supplier: e.supplier || 'null',
      gudang: e.gudang || 'null',
      id: e.id,
    };
  });
  return result;
};

const Retur = () => {
  const router = useRouter();
  const [snackbarState, setSnackbarState] = useState({
    state: false,
    type: null,
    message: '',
  });

  // Retur --general state
  const [dataRetur, setDataRetur] = useState([]);
  const [dataMetaRetur, setDataMetaRetur] = useState({});
  const [dataReturPerPage, setDataPerPage] = useState(8);
  const [isLoadingDataRetur, setIsLoadingDataRetur] = useState(false);
  const [isUpdatingDataRetur, setIsUpdatingDataRetur] = useState(false);

  // Retur --general handler
  const initDataRetur = async () => {
    try {
      setIsLoadingDataRetur(true);
      const params = {
        per_page: dataReturPerPage,
      };
      const response = await getRetur(params);
      const result = dataReturFormatHandler(response.data.data);
      setDataRetur(result);
      setDataMetaRetur(response.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataRetur(false);
    }
  };

  const updateDataReturHandler = async (payload) => {
    try {
      setIsUpdatingDataRetur(true);
      const response = await getRetur(payload);
      const result = dataReturFormatHandler(response.data.data);
      setDataRetur(result);
      setDataMetaRetur(response.data.meta);
    } catch (error) {
      console.log(error);
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataRetur(false);
    }
  };

  const deleteDataReturHandler = async (payload) => {
    try {
      setIsUpdatingDataRetur(true);
      const response = await deleteRetur({id: payload});
      setSnackbarState({
        state: true,
        type: 'success',
        message: response.data.message,
      });
      updateDataReturHandler({per_page: dataReturPerPage});
    } catch (error) {
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataRetur(false);
    }
  };

  const searchDataReturHandler = async (payload) => {
    const searchParams = payload.reduce((obj, e) => {
      obj[e.type] = e.value;
      return obj;
    }, {});

    try {
      setIsUpdatingDataRetur(true);
      const response = await getRetur({
        search: searchParams,
        per_page: dataReturPerPage,
      });
      if (response.data.data.length !== 0) {
        const result = dataReturFormatHandler(response.data.data);
        setDataRetur(result);
        setDataMetaRetur(response.data.meta);
      } else {
        setSnackbarState({
          state: true,
          type: 'warning',
          message: `${payload} tidak ditemukan`,
        });
        const response = await getRetur({
          per_page: dataReturPerPage,
        });
        const result = dataReturFormatHandler(response.data.data);
        setDataRetur(result);
        setDataMetaRetur(response.data.meta);
      }
    } catch (error) {
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataRetur(false);
    }
  };

  useEffect(() => {
    initDataRetur();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoadingDataRetur ? (
        <LoaderOnLayout />
      ) : (
        <>
          <TableLayoutGudang
            baseRoutePath={`${router.asPath}`}
            title='Retur'
            isBtnAdd={true}
            tableHead={ReturTableHead}
            data={dataRetur}
            meta={dataMetaRetur}
            dataPerPage={dataReturPerPage}
            isUpdatingData={isUpdatingDataRetur}
            filterOptions={[
              {label: 'Supplier', value: 'supplier'},
              {label: 'Nomor Faktur', value: 'nomor_faktur'},
            ]}
            updateDataPerPage={(e, filter) => {
              const searchParams = filter.reduce((obj, e) => {
                obj[e.type] = e.value;
                return obj;
              }, {});

              setDataPerPage(e.target.value);
              updateDataReturHandler({
                per_page: e.target.value,
                search: searchParams,
              });
            }}
            updateDataNavigate={(payload) =>
              updateDataReturHandler({
                per_page: dataReturPerPage,
                cursor: payload,
              })
            }
            refreshData={() =>
              updateDataReturHandler({
                per_page: dataReturPerPage,
              })
            }
            deleteData={deleteDataReturHandler}
            searchData={searchDataReturHandler}
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

export default Retur;
