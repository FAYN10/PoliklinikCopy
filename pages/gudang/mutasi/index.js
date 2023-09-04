import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getMutasi } from "api/gudang/mutasi";
import TableLayoutGudang from "components/TableLayoutGudang";
import LoaderOnLayout from "components/LoaderOnLayout";
import Snackbar from "components/SnackbarMui";
import { formatReadable } from "utils/formatTime";

const MutasiTableHead = [
  {
    id: "tanggal_permintaan",
    label: "Tanggal Permintaan",
  },
  {
    id: "unit",
    label: "Unit",
  },
  {
    id: "gudang",
    label: "Gudang",
  },
];

const dataMutasiFormatHandler = (payload) => {
  const result = payload.map((e) => {
    return {
      tanggal_permintaan: formatReadable(e.tanggal_permintaan) || "null",
      unit: e.unit || "null",
      gudang: e.gudang || "null",
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
    message: "",
  });

  // Mutasi --general state
  const [dataMutasi, setDataMutasi] = useState([]);
  const [dataMetaMutasi, setDataMetaMutasi] = useState({});
  const [dataMutasiPerPage, setDataPerPage] = useState(8);
  const [isLoadingDataMutasi, setIsLoadingDataMutasi] = useState(false);
  const [isUpdatingDataMutasi, setIsUpdatingDataMutasi] = useState(false);

  // Mutasi --general handler
  const initDataMutasi = async () => {
    try {
      setIsLoadingDataMutasi(true);
      const params = {
        per_page: dataMutasiPerPage,
      };
      const response = await getMutasi(params);
      const result = dataMutasiFormatHandler(response.data.data);
      setDataMutasi(result);
      setDataMetaMutasi(response.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataMutasi(false);
    }
  };

  const updateDataMutasiHandler = async (payload) => {
    try {
      setIsUpdatingDataMutasi(true);
      const response = await getMutasi(payload);
      const result = dataMutasiFormatHandler(response.data.data);
      setDataMutasi(result);
      setDataMetaMutasi(response.data.meta);
    } catch (error) {
      console.log(error);
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataMutasi(false);
    }
  };

  const deleteDataMutasiHandler = async (payload) => {
    try {
      setIsUpdatingDataMutasi(true);
      const response = await deleteMutasi({ id: payload });
      setSnackbarState({
        state: true,
        type: "success",
        message: response.data.message,
      });
      updateDataMutasiHandler({ per_page: dataMutasiPerPage });
    } catch (error) {
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataMutasi(false);
    }
  };
  
  const searchDataMutasiHandler = async (payload) => {
    try {
      setIsUpdatingDataMutasi(true);
      const response = await searchMutasi({
        search_text: payload.map((e) => e.value),
        search_column: payload.map((e) => e.type),
        per_page: dataMutasiPerPage,
      });
      if (response.data.data.length !== 0) {
        const result = dataMutasiFormatHandler(response.data.data);
        setDataMutasi(result);
        setDataMetaMutasi(response.data.meta);
      } else {
        setSnackbarState({
          state: true,
          type: "warning",
          message: `${payload} tidak ditemukan`,
        });
        const response = await getMutasi({
          per_page: dataMutasiPerPage,
        });
        const result = dataMutasiFormatHandler(response.data.data);
        setDataMutasi(result);
        setDataMetaMutasi(response.data.meta);
      }
    } catch (error) {
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataMutasi(false);
    }
  };

  useEffect(() => {
    initDataMutasi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoadingDataMutasi ? (
        <LoaderOnLayout />
      ) : (
        <>
            <TableLayoutGudang
              baseRoutePath={`${router.asPath}`}
              title="Mutasi"
              isBtnAdd={false}
              tableHead={MutasiTableHead}
              data={dataMutasi}
              meta={dataMetaMutasi}
              dataPerPage={dataMutasiPerPage}
              isUpdatingData={isUpdatingDataMutasi}
              filterOptions={[
                { label: "Mutasi", value: "mutasi" },
                { label: "Unit", value: "unit" },
              ]}
              updateDataPerPage={(e, filter) => {
                setDataPerPage(e.target.value);
                updateDataMutasiHandler({
                  per_page: e.target.value,
                  search_text: filter.map((e) => e.value),
                  search_column: filter.map((e) => e.type),
                });
              }}
              updateDataNavigate={(payload) =>
                updateDataMutasiHandler({
                  per_page: dataMutasiPerPage,
                  cursor: payload,
                })
              }
              refreshData={() =>
                updateDataMutasiHandler({ per_page: dataMutasiPerPage })
              }
              deleteData={deleteDataMutasiHandler}
              searchData={searchDataMutasiHandler}
            />
        </>
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

export default Mutasi;
