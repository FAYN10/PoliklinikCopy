import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getListDoctor, deleteDoctor, searchDoctor } from "api/doctor";
import TableLayout from "components/TableLayout";
import Spinner from "components/SpinnerMui";
import Snackbar from "components/SnackbarMui";

const doctorTableHead = [
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

const dataDoctorFormatHandler = (payload) => {
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

const Doctor = () => {
  const router = useRouter();
  const [dataDoctor, setDataDoctor] = useState([]);
  const [dataMetaDoctor, setDataMetaDoctor] = useState({});
  const [dataDoctorPerPage, setDataPerPage] = useState(8);
  const [isLoadingDataDoctor, setIsLoadingDataDoctor] = useState(false);
  const [isUpdatingDataDoctor, setIsUpdatingDataDoctor] = useState(false);
  const [snackbarState, setSnackbarState] = useState({
    state: false,
    type: null,
    message: "",
  });

  const initDataDoctor = async () => {
    try {
      setIsLoadingDataDoctor(true);
      const params = {
        per_page: dataDoctorPerPage,
      };
      const response = await getListDoctor(params);
      const result = dataDoctorFormatHandler(response.data.data);
      setDataDoctor(result);
      setDataMetaDoctor(response.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataDoctor(false);
    }
  };

  const updateDataDoctorHandler = async (payload) => {
    try {
      setIsUpdatingDataDoctor(true);
      const response = await getListDoctor(payload);
      const result = dataDoctorFormatHandler(response.data.data);
      setDataDoctor(result);
      setDataMetaDoctor(response.data.meta);
    } catch (error) {
      console.log(error);
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataDoctor(false);
    }
  };

  const deletaDataDoctorHandler = async (payload) => {
    try {
      setIsUpdatingDataDoctor(true);
      const response = await deleteDoctor({ id: payload });
      setSnackbarState({
        state: true,
        type: "success",
        message: response.data.message,
      });
      updateDataDoctorHandler({ per_page: dataDoctorPerPage });
    } catch (error) {
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataDoctor(false);
    }
  };

  const searchDataDoctorHandler = async (payload) => {
    try {
      setIsUpdatingDataDoctor(true);
      const response = await searchDoctor({
        search: payload,
        per_page: dataDoctorPerPage,
      });
      if (response.data.data.length !== 0) {
        const result = dataDoctorFormatHandler(response.data.data);
        setDataDoctor(result);
        setDataMetaDoctor(response.data.meta);
      } else {
        setSnackbarState({
          state: true,
          type: "warning",
          message: `${payload} tidak ditemukan`,
        });
        const response = await getListDoctor({
          per_page: dataDoctorPerPage,
        });
        const result = dataDoctorFormatHandler(response.data.data);
        setDataDoctor(result);
        setDataMetaDoctor(response.data.meta);
      }
    } catch (error) {
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataDoctor(false);
    }
  };

  useEffect(() => {
    initDataDoctor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoadingDataDoctor ? (
        <div className="flex justify-center items-center flex--fill-height-with-header">
          <Spinner />
        </div>
      ) : (
        <TableLayout
          baseRoutePath={`${router.asPath}`}
          title="Dokter"
          tableHead={doctorTableHead}
          data={dataDoctor}
          meta={dataMetaDoctor}
          dataPerPage={dataDoctorPerPage}
          isUpdatingData={isUpdatingDataDoctor}
          updateDataPerPage={(e) => {
            setDataPerPage(e.target.value);
            updateDataDoctorHandler({ per_page: e.target.value });
          }}
          updateDataNavigate={(payload) =>
            updateDataDoctorHandler({
              per_page: dataDoctorPerPage,
              cursor: payload,
            })
          }
          refreshData={() =>
            updateDataDoctorHandler({ per_page: dataDoctorPerPage })
          }
          deleteData={deletaDataDoctorHandler}
          searchData={searchDataDoctorHandler}
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

export default Doctor;
