import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getListEmployee, deleteEmployee, searchEmployee } from "api/employee";
import TableLayout from "components/TableLayout";
import Spinner from "components/SpinnerMui";
import Snackbar from "components/SnackbarMui";
import { formatReadable } from "utils/formatTime";

const employeeTableHead = [
  {
    id: "name",
    label: "Nama",
  },
  {
    id: "created_at",
    label: "Waktu buat",
  },
  {
    id: "positions",
    label: "Posisi",
  },
];

const dataEmployeeFormatHandler = (payload) => {
  const result = payload.map((e) => {
    const tempPos = [];
    e.positions.forEach((i) => {
      tempPos.push(i.title);
    });
    const strPos = tempPos.join(", ");
    return {
      name: e.name,
      created_at: formatReadable(e.created_at) || "null",
      positions: strPos || "null",
      id: e.id,
    };
  });
  return result;
};

const Employee = () => {
  const router = useRouter();
  const [dataEmployee, setDataEmployee] = useState([]);
  const [dataMetaEmployee, setDataMetaEmployee] = useState({});
  const [dataEmployeePerPage, setDataPerPage] = useState(8);
  const [isLoadingDataEmployee, setIsLoadingDataEmployee] = useState(false);
  const [isUpdatingDataEmploye, setIsUpdatingDataEmployee] = useState(false);
  const [snackbarState, setSnackbarState] = useState({
    state: false,
    type: null,
    message: "",
  });

  const initDataEmployee = async () => {
    try {
      setIsLoadingDataEmployee(true);
      const params = {
        per_page: dataEmployeePerPage,
      };
      const response = await getListEmployee(params);
      const result = dataEmployeeFormatHandler(response.data.data);
      setDataEmployee(result);
      setDataMetaEmployee(response.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataEmployee(false);
    }
  };

  const updateDataRoleHandler = async (payload) => {
    try {
      setIsUpdatingDataEmployee(true);
      const response = await getListEmployee(payload);
      const result = dataEmployeeFormatHandler(response.data.data);
      setDataEmployee(result);
      setDataMetaEmployee(response.data.meta);
    } catch (error) {
      console.log(error);
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataEmployee(false);
    }
  };

  const deletaDataRoleHandler = async (payload) => {
    try {
      setIsUpdatingDataEmployee(true);
      const response = await deleteEmployee({ id: payload });
      setSnackbarState({
        state: true,
        type: "success",
        message: response.data.message,
      });
      updateDataRoleHandler({ per_page: dataEmployeePerPage });
    } catch (error) {
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataEmployee(false);
    }
  };

  const searchDataRoleHandler = async (payload) => {
    try {
      setIsUpdatingDataEmployee(true);
      const response = await searchEmployee({
        search: payload,
        per_page: dataEmployeePerPage,
      });
      if (response.data.data.length !== 0) {
        const result = dataEmployeeFormatHandler(response.data.data);
        setDataEmployee(result);
        setDataMetaEmployee(response.data.meta);
      } else {
        setSnackbarState({
          state: true,
          type: "warning",
          message: `${payload} tidak ditemukan`,
        });
        const response = await getListEmployee({
          per_page: dataEmployeePerPage,
        });
        const result = dataEmployeeFormatHandler(response.data.data);
        setDataEmployee(result);
        setDataMetaEmployee(response.data.meta);
      }
    } catch (error) {
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataEmployee(false);
    }
  };

  useEffect(() => {
    initDataEmployee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoadingDataEmployee ? (
        <div className="flex justify-center items-center flex--fill-height-with-header">
          <Spinner />
        </div>
      ) : (
        <TableLayout
          baseRoutePath={`${router.asPath}`}
          title="Karyawan"
          tableHead={employeeTableHead}
          data={dataEmployee}
          meta={dataMetaEmployee}
          dataPerPage={dataEmployeePerPage}
          isUpdatingData={isUpdatingDataEmploye}
          updateDataPerPage={(e) => {
            setDataPerPage(e.target.value);
            updateDataRoleHandler({ per_page: e.target.value });
          }}
          updateDataNavigate={(payload) =>
            updateDataRoleHandler({
              per_page: dataEmployeePerPage,
              cursor: payload,
            })
          }
          refreshData={() =>
            updateDataRoleHandler({ per_page: dataEmployeePerPage })
          }
          deleteData={deletaDataRoleHandler}
          searchData={searchDataRoleHandler}
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

export default Employee;
