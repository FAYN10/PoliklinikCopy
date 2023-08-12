import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getListRole, deleteRole, searchRole } from "api/role";
import TableLayout from "components/TableLayout";
import Spinner from "components/SpinnerMui";
import Snackbar from "components/SnackbarMui";
import { formatReadable } from "utils/formatTime";

const roleTableHead = [
  {
    id: "name",
    label: "Nama",
  },
  {
    id: "created_at",
    label: "Waktu Buat",
  },
];

const dataRoleFormatHandler = (payload) => {
  const result = payload.map((e) => {
    return {
      name: e.name,
      created_at: formatReadable(e.created_at) || "null",
      id: e.id,
    };
  });
  return result;
};

const Role = () => {
  const router = useRouter();
  const [dataRole, setDataRole] = useState([]);
  const [dataMetaRole, setDataMetaRole] = useState({});
  const [dataRolePerPage, setDataPerPage] = useState(8);
  const [isLoadingDataRole, setIsLoadingDataRole] = useState(false);
  const [isUpdatingDataRole, setIsUpdatingDataRole] = useState(false);
  const [snackbarState, setSnackbarState] = useState({
    state: false,
    type: null,
    message: "",
  });

  const initDataRole = async () => {
    try {
      setIsLoadingDataRole(true);
      const params = {
        per_page: dataRolePerPage,
      };
      const response = await getListRole(params);
      const result = dataRoleFormatHandler(response.data.data);
      setDataRole(result);
      setDataMetaRole(response.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataRole(false);
    }
  };

  const updateDataRoleHandler = async (payload) => {
    try {
      setIsUpdatingDataRole(true);
      const response = await getListRole(payload);
      const result = dataRoleFormatHandler(response.data.data);
      setDataRole(result);
      setDataMetaRole(response.data.meta);
    } catch (error) {
      console.log(error);
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataRole(false);
    }
  };

  const deletaDataRoleHandler = async (payload) => {
    try {
      setIsUpdatingDataRole(true);
      const response = await deleteRole({ id: payload });
      setSnackbarState({
        state: true,
        type: "success",
        message: response.data.message,
      });
      updateDataRoleHandler({ per_page: dataRolePerPage });
    } catch (error) {
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataRole(false);
    }
  };

  const searchDataRoleHandler = async (payload) => {
    try {
      setIsUpdatingDataRole(true);
      const response = await searchRole({
        search: payload,
        per_page: dataRolePerPage,
      });
      if (response.data.data.length !== 0) {
        const result = dataRoleFormatHandler(response.data.data);
        setDataRole(result);
        setDataMetaRole(response.data.meta);
      } else {
        setSnackbarState({
          state: true,
          type: "warning",
          message: `${payload} tidak ditemukan`,
        });
        const response = await getListRole({
          per_page: dataRolePerPage,
        });
        const result = dataRoleFormatHandler(response.data.data);
        setDataRole(result);
        setDataMetaRole(response.data.meta);
      }
    } catch (error) {
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataRole(false);
    }
  };

  useEffect(() => {
    initDataRole();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoadingDataRole ? (
        <div className="flex justify-center items-center flex--fill-height-with-header">
          <Spinner />
        </div>
      ) : (
        <TableLayout
          baseRoutePath={`${router.asPath}`}
          title="Role"
          tableHead={roleTableHead}
          data={dataRole}
          meta={dataMetaRole}
          dataPerPage={dataRolePerPage}
          isUpdatingData={isUpdatingDataRole}
          updateDataPerPage={(e) => {
            setDataPerPage(e.target.value);
            updateDataRoleHandler({ per_page: e.target.value });
          }}
          updateDataNavigate={(payload) =>
            updateDataRoleHandler({
              per_page: dataRolePerPage,
              cursor: payload,
            })
          }
          refreshData={() =>
            updateDataRoleHandler({ per_page: dataRolePerPage })
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

export default Role;
