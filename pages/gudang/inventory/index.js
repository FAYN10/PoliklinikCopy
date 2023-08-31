import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {getInventory, getPosInventory} from 'api/gudang/inventory';
import TableLayoutGudang from 'components/TableLayoutGudang';
import LoaderOnLayout from 'components/LoaderOnLayout';
import Snackbar from 'components/SnackbarMui';
import {formatReadable} from 'utils/formatTime';

const InventoryTableHead = [
  {
    id: 'unit',
    label: 'Unit',
  },
  {
    id: 'gudang',
    label: 'Gudang',
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
    id: 'stok',
    label: 'Stok',
  },
  {
    id: 'sediaan',
    label: 'Sediaan',
  },
  {
    id: 'harga_jual_satuan',
    label: 'Harga Jual',
  },
  {
    id: 'tanggal_ed',
    label: 'Expired Date',
  },
];

const dataInventoryFormatHandler = (payload) => {
  const result = payload.map((e) => {
    return {
      unit: e.unit || 'null',
      gudang: e.gudang || 'null',
      kode_item: e.item || 'null',
      nomor_batch: e.nomor_batch || 'null',
      stok: e.stok || 'null',
      sediaan: e.sediaan || 'null',
      harga_jual_satuan: e.harga_jual_satuan || 'null',
      tanggal_ed: formatReadable(e.tanggal_ed) || 'null',
      id: e.id,
    };
  });
  return result;
};

const PosInventoryTableHead = [
  {
    id: 'unit',
    label: 'Unit',
  },
  {
    id: 'gudang',
    label: 'Gudang',
  },
];

const dataPosInventoryFormatHandler = (payload) => {
  const result = payload.map((e) => {
    return {
      unit: e.unit.name || 'null',
      gudang: e.gudang || 'null',
      id: e.id,
    };
  });
  return result;
};

const Inventory = () => {
  const router = useRouter();
  const [snackbarState, setSnackbarState] = useState({
    state: false,
    type: null,
    message: '',
  });
  const [activeContent, setActiveContent] = useState(1);

  // Inventory --general state
  const [dataInventory, setDataInventory] = useState([]);
  const [dataMetaInventory, setDataMetaInventory] = useState({});
  const [dataInventoryPerPage, setDataInventoryPerPage] = useState(8);
  const [isLoadingDataInventory, setIsLoadingDataInventory] = useState(false);
  const [isUpdatingDataInventory, setIsUpdatingDataInventory] = useState(false);

  // Pos Inventory --general state
  const [dataPosInventory, setDataPosInventory] = useState([]);
  const [dataMetaPosInventory, setDataMetaPosInventory] = useState({});
  const [dataPosInventoryPerPage, setDataPosInventoryPerPage] = useState(8);
  const [isLoadingDataPosInventory, setIsLoadingDataPosInventory] =
    useState(false);
  const [isUpdatingDataPosInventory, setIsUpdatingDataPosInventory] =
    useState(false);

  // Inventory --general handler
  const initDataInventory = async () => {
    try {
      setIsLoadingDataInventory(true);
      const params = {
        per_page: dataInventoryPerPage,
      };
      const response = await getInventory(params);
      const result = dataInventoryFormatHandler(response.data.data);
      setDataInventory(result);
      setDataMetaInventory(response.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataInventory(false);
    }
  };

  const updateDataInventoryHandler = async (payload) => {
    try {
      setIsUpdatingDataInventory(true);
      const response = await getInventory(payload);
      const result = dataInventoryFormatHandler(response.data.data);
      setDataInventory(result);
      setDataMetaInventory(response.data.meta);
    } catch (error) {
      console.log(error);
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataInventory(false);
    }
  };

  const deleteDataInventoryHandler = async (payload) => {
    try {
      setIsUpdatingDataInventory(true);
      const response = await deleteInventory({id: payload});
      setSnackbarState({
        state: true,
        type: 'success',
        message: response.data.message,
      });
      updateDataInventoryHandler({per_page: dataInventoryPerPage});
    } catch (error) {
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataInventory(false);
    }
  };

  const searchDataInventoryHandler = async (payload) => {
    const searchParams = payload.reduce((obj, e) => {
      obj[e.type] = e.value;
      return obj;
    }, {});

    try {
      setIsUpdatingDataInventory(true);
      const response = await getInventory({
        search: searchParams,
        per_page: dataInventoryPerPage,
      });
      if (response.data.data.length !== 0) {
        const result = dataInventoryFormatHandler(response.data.data);
        setDataInventory(result);
        setDataMetaInventory(response.data.meta);
      } else {
        setSnackbarState({
          state: true,
          type: 'warning',
          message: `${payload} tidak ditemukan`,
        });
        const response = await getInventory({
          per_page: dataInventoryPerPage,
        });
        const result = dataInventoryFormatHandler(response.data.data);
        setDataInventory(result);
        setDataMetaInventory(response.data.meta);
      }
    } catch (error) {
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataInventory(false);
    }
  };

  // Pos Inventory --general handler
  const initDataPosInventory = async () => {
    try {
      setIsLoadingDataPosInventory(true);
      const params = {
        per_page: dataPosInventoryPerPage,
      };
      const response = await getPosInventory(params);
      const result = dataPosInventoryFormatHandler(response.data.data);
      setDataPosInventory(result);
      setDataMetaPosInventory(response.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataPosInventory(false);
    }
  };

  const updateDataPosInventoryHandler = async (payload) => {
    try {
      setIsUpdatingDataPosInventory(true);
      const response = await getPosInventory(payload);
      const result = dataPosInventoryFormatHandler(response.data.data);
      setDataPosInventory(result);
      setDataMetaPosInventory(response.data.meta);
    } catch (error) {
      console.log(error);
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataPosInventory(false);
    }
  };

  const deleteDataPosInventoryHandler = async (payload) => {
    try {
      setIsUpdatingDataPosInventory(true);
      const response = await deletePosInventory({id: payload});
      setSnackbarState({
        state: true,
        type: 'success',
        message: response.data.message,
      });
      updateDataPosInventoryHandler({per_page: dataPosInventoryPerPage});
    } catch (error) {
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataPosInventory(false);
    }
  };

  const searchDataPosInventoryHandler = async (payload) => {
    const searchParams = payload.reduce((obj, e) => {
      obj[e.type] = e.value;
      return obj;
    }, {});

    try {
      setIsUpdatingDataPosInventory(true);
      const response = await getPosInventory({
        search: searchParams,
        per_page: dataPosInventoryPerPage,
      });
      if (response.data.data.length !== 0) {
        const result = dataPosInventoryFormatHandler(response.data.data);
        setDataPosInventory(result);
        setDataMetaPosInventory(response.data.meta);
      } else {
        setSnackbarState({
          state: true,
          type: 'warning',
          message: `${payload} tidak ditemukan`,
        });
        const response = await getPosInventory({
          per_page: dataPosInventoryPerPage,
        });
        const result = dataPosInventoryFormatHandler(response.data.data);
        setDataPosInventory(result);
        setDataMetaPosInventory(response.data.meta);
      }
    } catch (error) {
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataPosInventory(false);
    }
  };

  useEffect(() => {
    if (Object.keys(router.query).length !== 0) {
      setActiveContent(parseInt(router.query.active_content));
    }
  }, [router]);

  useEffect(() => {
    initDataInventory();
    initDataPosInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoadingDataInventory || isLoadingDataPosInventory ? (
        <LoaderOnLayout />
      ) : (
        <>
          <div className='tab-list flex mb-24'>
            <div
              className={activeContent === 1 ? 'pointer active' : 'pointer'}
              onClick={() => setActiveContent(1)}
            >
              Inventory
            </div>
            <div
              className={activeContent === 2 ? 'pointer active' : 'pointer'}
              onClick={() => setActiveContent(2)}
            >
              Pos Inventory
            </div>
          </div>
          {activeContent === 1 && (
            <TableLayoutGudang
              baseRoutePath={`${router.asPath}`}
              title=''
              isBtnAdd={false}
              tableHead={InventoryTableHead}
              data={dataInventory}
              meta={dataMetaInventory}
              dataPerPage={dataInventoryPerPage}
              isUpdatingData={isUpdatingDataInventory}
              filterOptions={[
                {label: 'Gudang', value: 'gudang'},
                {label: 'Unit', value: 'unit'},
              ]}
              updateDataPerPage={(e, filter) => {
                const searchParams = filter.reduce((obj, e) => {
                  obj[e.type] = e.value;
                  return obj;
                }, {});

                setDataPerPage(e.target.value);
                updateDataInventoryHandler({
                  per_page: e.target.value,
                  search: searchParams,
                });
              }}
              updateDataNavigate={(payload) =>
                updateDataInventoryHandler({
                  per_page: dataInventoryPerPage,
                  cursor: payload,
                })
              }
              refreshData={() =>
                updateDataInventoryHandler({
                  per_page: dataInventoryPerPage,
                })
              }
              deleteData={deleteDataInventoryHandler}
              searchData={searchDataInventoryHandler}
            />
          )}
          {activeContent === 2 && (
            <TableLayoutGudang
              baseRoutePath={`${router.asPath}`}
              title=''
              isBtnAdd={false}
              tableHead={PosInventoryTableHead}
              data={dataPosInventory}
              meta={dataMetaPosInventory}
              dataPerPage={dataPosInventoryPerPage}
              isUpdatingData={isUpdatingDataPosInventory}
              filterOptions={[
                {label: 'Gudang', value: 'gudang'},
                {label: 'Unit', value: 'unit'},
              ]}
              updateDataPerPage={(e, filter) => {
                const searchParams = filter.reduce((obj, e) => {
                  obj[e.type] = e.value;
                  return obj;
                }, {});

                setDataPerPage(e.target.value);
                updateDataPosInventoryHandler({
                  per_page: e.target.value,
                  search: searchParams,
                });
              }}
              updateDataNavigate={(payload) =>
                updateDataPosInventoryHandler({
                  per_page: dataPosInventoryPerPage,
                  cursor: payload,
                })
              }
              refreshData={() =>
                updateDataPosInventoryHandler({
                  per_page: dataPosInventoryPerPage,
                })
              }
              deleteData={deleteDataPosInventoryHandler}
              searchData={searchDataPosInventoryHandler}
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

export default Inventory;
