import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getListSuster, deleteSuster, searchSuster } from "api/suster";
import TableLayout from "components/TableLayout";
import Spinner from "components/SpinnerMui";
import Snackbar from "components/SnackbarMui";

const susterTableHead = [
  {
    id: "name",
    label: "Nama",
  },
  {
    id: "telp",
    label: "No telepon",
  },
  {
    id: "status_aktif",
    label: "Status",
  },
];

const dataSusterFormatHandler = (payload) => {
  const result = payload.map((e) => {
    return {
      name: e.employee.name,
      telp: e.employee.telp || "null",
      status_aktif: e.status_aktif ? "AKTIF" : "TIDAK AKTIF",
      id: e.id,
    };
  });
  return result;
};

const Suster = () => {
  const router = useRouter();
  const [dataSuster, setDataSuster] = useState([]);
  const [dataMetaSuster, setDataMetaSuster] = useState({});
  const [dataSusterPerPage, setDataPerPage] = useState(8);
  const [isLoadingDataSuster, setIsLoadingDataSuster] = useState(false);
  const [isUpdatingDataSuster, setIsUpdatingDataSuster] = useState(false);
  const [snackbarState, setSnackbarState] = useState({
    state: false,
    type: null,
    message: "",
  });

  const initDataSuster = async () => {
    try {
      setIsLoadingDataSuster(true);
      const params = {
        per_page: dataSusterPerPage,
      };
      const response = await getListSuster(params);
      const result = dataSusterFormatHandler(response.data.data);
      setDataSuster(result);
      setDataMetaSuster(response.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataSuster(false);
    }
  };

  const updateDataSusterHandler = async (payload) => {
    try {
      setIsUpdatingDataSuster(true);
      const response = await getListSuster(payload);
      const result = dataSusterFormatHandler(response.data.data);
      setDataSuster(result);
      setDataMetaSuster(response.data.meta);
    } catch (error) {
      console.log(error);
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataSuster(false);
    }
  };

  const deletaDataSusterHandler = async (payload) => {
    try {
      setIsUpdatingDataSuster(true);
      const response = await deleteSuster({ id: payload });
      setSnackbarState({
        state: true,
        type: "success",
        message: response.data.message,
      });
      updateDataSusterHandler({ per_page: dataSusterPerPage });
    } catch (error) {
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataSuster(false);
    }
  };

  const searchDataSusterHandler = async (payload) => {
    try {
      setIsUpdatingDataSuster(true);
      const response = await searchSuster({
        search: payload,
        per_page: dataSusterPerPage,
      });
      if (response.data.data.length !== 0) {
        const result = dataSusterFormatHandler(response.data.data);
        setDataSuster(result);
        setDataMetaSuster(response.data.meta);
      } else {
        setSnackbarState({
          state: true,
          type: "warning",
          message: `${payload} tidak ditemukan`,
        });
        const response = await getListSuster({
          per_page: dataSusterPerPage,
        });
        const result = dataSusterFormatHandler(response.data.data);
        setDataSuster(result);
        setDataMetaSuster(response.data.meta);
      }
    } catch (error) {
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataSuster(false);
    }
  };

  useEffect(() => {
    initDataSuster();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoadingDataSuster ? (
        <div className="flex justify-center items-center flex--fill-height-with-header">
          <Spinner />
        </div>
      ) : (
        <TableLayout
          baseRoutePath={`${router.asPath}`}
          title="Perawat"
          tableHead={susterTableHead}
          data={dataSuster}
          meta={dataMetaSuster}
          dataPerPage={dataSusterPerPage}
          isUpdatingData={isUpdatingDataSuster}
          updateDataPerPage={(e) => {
            setDataPerPage(e.target.value);
            updateDataSusterHandler({ per_page: e.target.value });
          }}
          updateDataNavigate={(payload) =>
            updateDataSusterHandler({
              per_page: dataSusterPerPage,
              cursor: payload,
            })
          }
          refreshData={() =>
            updateDataSusterHandler({ per_page: dataSusterPerPage })
          }
          deleteData={deletaDataSusterHandler}
          searchData={searchDataSusterHandler}
        />
      )}
      <Snackbar
        state={snackbarState.state}
        setState={(payload) =>
          setSnackbarState({
            state: payload,
            type: null,
            message: "",
          })
        }
        message={snackbarState.message}
        isSuccessType={snackbarState.type === "success"}
        isErrorType={snackbarState.type === "error"}
        isWarningType={snackbarState.type === "warning"}
      />
    </>
  );
};

export default Suster;
