import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {getMutasi, deleteMutasi} from 'api/gudang/mutasi';
import TableLayoutGudang from 'components/TableLayoutGudang';
import LoaderOnLayout from 'components/LoaderOnLayout';
import Snackbar from 'components/SnackbarMui';
import {formatReadable} from 'utils/formatTime';

const PermintaanMutasiTableHead = [
  {
    id: 'nomor_mutasi',
    label: 'Nomor Mutasi',
  },
  {
    id: 'tanggal_permintaan',
    label: 'Tanggal Permintaan',
  },
  {
    id: 'unit',
    label: 'Unit',
  },
  {
    id: 'gudang',
    label: 'Gudang',
  },
];

const dataPermintaanMutasiFormatHandler = (payload) => {
  const result = payload.map((e) => {
    return {
      nomor_mutasi: e.nomor_mutasi || 'null',
      tanggal_permintaan: formatReadable(e.tanggal_permintaan) || 'null',
      unit: e.unit || 'null',
      gudang: e.gudang || 'null',
      id: e.id,
    };
  });
  return result;
};

const RiwayatMutasiTableHead = [
  {
    id: 'nomor_mutasi',
    label: 'Nomor Mutasi',
  },
  {
    id: 'tanggal_mutasi',
    label: 'Tanggal Mutasi',
  },
  {
    id: 'tanggal_permintaan',
    label: 'Tanggal Permintaan',
  },
  {
    id: 'unit',
    label: 'Unit',
  },
  {
    id: 'gudang',
    label: 'Gudang',
  },
];

const dataRiwayatMutasiFormatHandler = (payload) => {
  const result = payload.map((e) => {
    return {
      nomor_mutasi: e.nomor_mutasi || 'null',
      tanggal_mutasi: formatReadable(e.tanggal_mutasi) || 'null',
      tanggal_permintaan: formatReadable(e.tanggal_permintaan) || 'null',
      unit: e.unit || 'null',
      gudang: e.gudang || 'null',
      id: e.id,
    };
  });
  return result;
};

const Mutasi = () => {
  const router = useRouter();
  const [snackbarState, setSnackbarState] = useState({
    state: false,
    type: null,
    message: '',
  });
  const [activeContent, setActiveContent] = useState(1);

  // Permintaan Mutasi --general state
  const [dataPermintaanMutasi, setDataPermintaanMutasi] = useState([]);
  const [dataMetaPermintaanMutasi, setDataMetaPermintaanMutasi] = useState({});
  const [dataPermintaanMutasiPerPage, setDataPermintaanMutasiPerPage] =
    useState(8);
  const [isLoadingDataPermintaanMutasi, setIsLoadingDataPermintaanMutasi] =
    useState(false);
  const [isUpdatingDataPermintaanMutasi, setIsUpdatingDataPermintaanMutasi] =
    useState(false);

  // Riwayat Mutasi --general state
  const [dataRiwayatMutasi, setDataRiwayatMutasi] = useState([]);
  const [dataMetaRiwayatMutasi, setDataMetaRiwayatMutasi] = useState({});
  const [dataRiwayatMutasiPerPage, setDataRiwayatMutasiPerPage] = useState(8);
  const [isLoadingDataRiwayatMutasi, setIsLoadingDataRiwayatMutasi] =
    useState(false);
  const [isUpdatingDataRiwayatMutasi, setIsUpdatingDataRiwayatMutasi] =
    useState(false);

  // Permintaan Mutasi --general handler
  const initDataPermintaanMutasi = async () => {
    try {
      setIsLoadingDataPermintaanMutasi(true);
      const params = {
        per_page: dataPermintaanMutasiPerPage,
      };
      const response = await getMutasi(params);
      const result = dataPermintaanMutasiFormatHandler(response.data.data);
      setDataPermintaanMutasi(result);
      setDataMetaPermintaanMutasi(response.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataPermintaanMutasi(false);
    }
  };

  const updateDataPermintaanMutasiHandler = async (payload) => {
    try {
      setIsUpdatingDataPermintaanMutasi(true);
      const response = await getMutasi(payload);
      const result = dataPermintaanMutasiFormatHandler(response.data.data);
      setDataPermintaanMutasi(result);
      setDataMetaPermintaanMutasi(response.data.meta);
    } catch (error) {
      console.log(error);
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataPermintaanMutasi(false);
    }
  };

  const deleteDataPermintaanMutasiHandler = async (payload) => {
    try {
      setIsUpdatingDataPermintaanMutasi(true);
      const response = await deleteMutasi({id: payload});
      setSnackbarState({
        state: true,
        type: 'success',
        message: response.data.message,
      });
      updateDataPermintaanMutasiHandler({
        per_page: dataPermintaanMutasiPerPage,
      });
    } catch (error) {
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataPermintaanMutasi(false);
    }
  };

  const searchDataPermintaanMutasiHandler = async (payload) => {
    const searchParams = payload.reduce((obj, e) => {
      obj[e.type] = e.value;
      return obj;
    }, {});

    try {
      setIsUpdatingDataPermintaanMutasi(true);
      const response = await getMutasi({
        search: searchParams,
        per_page: dataPermintaanMutasiPerPage,
      });
      if (response.data.data.length !== 0) {
        const result = dataPermintaanMutasiFormatHandler(response.data.data);
        setDataPermintaanMutasi(result);
        setDataMetaPermintaanMutasi(response.data.meta);
      } else {
        setSnackbarState({
          state: true,
          type: 'warning',
          message: `${payload} tidak ditemukan`,
        });
        const response = await getMutasi({
          per_page: dataPermintaanMutasiPerPage,
        });
        const result = dataPermintaanMutasiFormatHandler(response.data.data);
        setDataPermintaanMutasi(result);
        setDataMetaPermintaanMutasi(response.data.meta);
      }
    } catch (error) {
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataPermintaanMutasi(false);
    }
  };

  // Riwayat Mutasi --general handler
  const initDataRiwayatMutasi = async () => {
    try {
      setIsLoadingDataRiwayatMutasi(true);
      const params = {
        trashed: true,
        per_page: dataRiwayatMutasiPerPage,
      };
      const response = await getMutasi(params);
      const result = dataRiwayatMutasiFormatHandler(response.data.data);
      setDataRiwayatMutasi(result);
      setDataMetaRiwayatMutasi(response.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataRiwayatMutasi(false);
    }
  };

  const updateDataRiwayatMutasiHandler = async (payload) => {
    try {
      setIsUpdatingDataRiwayatMutasi(true);
      const response = await getMutasi(payload);
      const result = dataRiwayatMutasiFormatHandler(response.data.data);
      setDataRiwayatMutasi(result);
      setDataMetaRiwayatMutasi(response.data.meta);
    } catch (error) {
      console.log(error);
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataRiwayatMutasi(false);
    }
  };

  const deleteDataRiwayatMutasiHandler = async (payload) => {
    try {
      setIsUpdatingDataRiwayatMutasi(true);
      const response = await deleteMutasi({id: payload});
      setSnackbarState({
        state: true,
        type: 'success',
        message: response.data.message,
      });
      updateDataRiwayatMutasiHandler({per_page: dataRiwayatMutasiPerPage});
    } catch (error) {
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataRiwayatMutasi(false);
    }
  };

  const searchDataRiwayatMutasiHandler = async (payload) => {
    const searchParams = payload.reduce((obj, e) => {
      obj[e.type] = e.value;
      return obj;
    }, {});

    try {
      setIsUpdatingDataRiwayatMutasi(true);
      const response = await getMutasi({
        search: searchParams,
        trashed: true,
        per_page: dataRiwayatMutasiPerPage,
      });
      if (response.data.data.length !== 0) {
        const result = dataRiwayatMutasiFormatHandler(response.data.data);
        setDataRiwayatMutasi(result);
        setDataMetaRiwayatMutasi(response.data.meta);
      } else {
        setSnackbarState({
          state: true,
          type: 'warning',
          message: `${payload} tidak ditemukan`,
        });
        const response = await getMutasi({
          per_page: dataRiwayatMutasiPerPage,
        });
        const result = dataRiwayatMutasiFormatHandler(response.data.data);
        setDataRiwayatMutasi(result);
        setDataMetaRiwayatMutasi(response.data.meta);
      }
    } catch (error) {
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataRiwayatMutasi(false);
    }
  };

  useEffect(() => {
    if (Object.keys(router.query).length !== 0) {
      setActiveContent(parseInt(router.query.active_content));
    }
  }, [router]);

  useEffect(() => {
    (async () => {
      try {
        await initDataPermintaanMutasi();
        await initDataRiwayatMutasi();
      } catch (error) {
        setSnackbarState({
          state: true,
          type: 'error',
          message: error.message,
        });
      } finally {
        setIsLoadingDataPermintaanMutasi(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoadingDataPermintaanMutasi || isLoadingDataRiwayatMutasi ? (
        <LoaderOnLayout />
      ) : (
        <>
          <div className='tab-list flex mb-24'>
            <div
              className={activeContent === 1 ? 'pointer active' : 'pointer'}
              onClick={() => setActiveContent(1)}
            >
              Permintaan Mutasi
            </div>
            <div
              className={activeContent === 2 ? 'pointer active' : 'pointer'}
              onClick={() => setActiveContent(2)}
            >
              Riwayat Mutasi
            </div>
          </div>
          {activeContent === 1 && (
            <TableLayoutGudang
              baseRoutePath={`${router.asPath}`}
              title='Mutasi'
              isBtnAdd={true}
              tableHead={PermintaanMutasiTableHead}
              data={dataPermintaanMutasi}
              meta={dataMetaPermintaanMutasi}
              dataPerPage={dataPermintaanMutasiPerPage}
              isUpdatingData={isUpdatingDataPermintaanMutasi}
              filterOptions={[
                {label: 'Unit', value: 'unit'},
                {label: 'Gudang', value: 'gudang'},
              ]}
              updateDataPerPage={(e, filter) => {
                const searchParams = filter.reduce((obj, e) => {
                  obj[e.type] = e.value;
                  return obj;
                }, {});

                setDataPerPage(e.target.value);
                updateDataPermintaanMutasiHandler({
                  per_page: e.target.value,
                  search: searchParams,
                });
              }}
              updateDataNavigate={(payload) =>
                updateDataPermintaanMutasiHandler({
                  per_page: dataPermintaanMutasiPerPage,
                  cursor: payload,
                })
              }
              refreshData={() =>
                updateDataPermintaanMutasiHandler({
                  per_page: dataPermintaanMutasiPerPage,
                })
              }
              deleteData={deleteDataPermintaanMutasiHandler}
              searchData={searchDataPermintaanMutasiHandler}
            />
          )}
          {activeContent === 2 && (
            <TableLayoutGudang
              baseRoutePath={`${router.asPath}`}
              title=''
              isBtnAdd={false}
              tableHead={RiwayatMutasiTableHead}
              data={dataRiwayatMutasi}
              meta={dataMetaRiwayatMutasi}
              dataPerPage={dataRiwayatMutasiPerPage}
              isUpdatingData={isUpdatingDataRiwayatMutasi}
              filterOptions={[
                {label: 'Unit', value: 'unit'},
                {label: 'Gudang', value: 'gudang'},
              ]}
              updateDataPerPage={(e, filter) => {
                const searchParams = filter.reduce((obj, e) => {
                  obj[e.type] = e.value;
                  return obj;
                }, {});

                setDataPerPage(e.target.value);
                updateDataRiwayatMutasiHandler({
                  trashed: true,
                  per_page: e.target.value,
                  search: searchParams,
                });
              }}
              updateDataNavigate={(payload) =>
                updateDataRiwayatMutasiHandler({
                  trashed: true,
                  per_page: dataRiwayatMutasiPerPage,
                  cursor: payload,
                })
              }
              refreshData={() =>
                updateDataRiwayatMutasiHandler({
                  trashed: true,
                  per_page: dataRiwayatMutasiPerPage,
                })
              }
              deleteData={deleteDataRiwayatMutasiHandler}
              searchData={searchDataRiwayatMutasiHandler}
            />
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

export default Mutasi;
