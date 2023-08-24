import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getListBMHPRadiologi, deleteBmhpRadiologi, searchBmhpRadiologi } from "api/radiologi";
import TableLayout from "components/TableLayout";
import Spinner from "components/SpinnerMui";
import Snackbar from "components/SnackbarMui";
import { formatReadable } from "utils/formatTime";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import TableLayoutV4 from "components/TableLayoutV4";

const BMHPRadiologiTableHead = [
    {
        id: "nama_barang",
        label: "Nama barang",
    },
    {
        id: "jumlah_barang",
        label: "Jumlah Barang",
    },
    {
        id: "waktu_pemakaian",
        label: "Waktu Pemakaian",
    },
];

const dataBMHPRadiologiFormatHandler = (payload) => {
    const result = payload.map((e) => {
        return {
            namaBarang: e.nama_barang || "null",
            jumlahBarang: e.jumlah_barang || "null",
            waktuPemakaian: e.waktu_pemakaian || "null",
            id: e.id,

        };
    });
   
    return result;
};

const BmhpRadiologi = () => {
    const router = useRouter();
    const [dataBMHPRadiologi, setDataBMHPRadiologi] = useState([]);
    const [dataMetaBMHPRadiologi, setDataMetaBMHPRadiologi] = useState({});
    const [dataBMHPRadiologiPerPage, setDataPerPage] = useState(8);
    const [isLoadingDataBMHPRadiologi, setIsLoadingDataBMHPRadiologi] = useState(false);
    const [isUpdatingDataEmploye, setIsUpdatingDataBMHPRadiologi] = useState(false);
    const [snackbarState, setSnackbarState] = useState({
      state: false,
      type: null,
      message: "",
    });
  
    const initDataBMHPRadiologi = async () => {
      try {
        setIsLoadingDataBMHPRadiologi(true);
        const params = {
          per_page: dataBMHPRadiologiPerPage,
        };
        const response = await getListBMHPRadiologi(params);
        const result = dataBMHPRadiologiFormatHandler(response.data.data);
        setDataBMHPRadiologi(result);
        setDataMetaBMHPRadiologi(response.data.meta);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingDataBMHPRadiologi(false);
      }
    };
  
    const updateDataRoleHandler = async (payload) => {
      try {
        setIsUpdatingDataBMHPRadiologi(true);
        const response = await getListBMHPRadiologi(payload);
        const result = dataBMHPRadiologiFormatHandler(response.data.data);
        setDataBMHPRadiologi(result);
        setDataMetaBMHPRadiologi(response.data.meta);
      } catch (error) {
        console.log(error);
        setSnackbarState({
          state: true,
          type: "error",
          message: error.message,
        });
      } finally {
        setIsUpdatingDataBMHPRadiologi(false);
      }
    };
  
    const deletaDataRoleHandler = async (payload) => {
      try {
        setIsUpdatingDataBMHPRadiologi(true);
        const response = await deleteBMHPRadiologi({ id: payload });
        setSnackbarState({
          state: true,
          type: "success",
          message: response.data.message,
        });
        updateDataRoleHandler({ per_page: dataBMHPRadiologiPerPage });
      } catch (error) {
        setSnackbarState({
          state: true,
          type: "error",
          message: error.message,
        });
      } finally {
        setIsUpdatingDataBMHPRadiologi(false);
      }
    };
  
    const searchDataRoleHandler = async (payload) => {
      try {
        setIsUpdatingDataBMHPRadiologi(true);
        const response = await searchBMHPRadiologi({
          search: payload,
          per_page: dataBMHPRadiologiPerPage,
        });
        if (response.data.data.length !== 0) {
          const result = dataBMHPRadiologiFormatHandler(response.data.data);
          setDataBMHPRadiologi(result);
          setDataMetaBMHPRadiologi(response.data.meta);
        } else {
          setSnackbarState({
            state: true,
            type: "warning",
            message: `${payload} tidak ditemukan`,
          });
          const response = await getListBMHPRadiologi({
            per_page: dataBMHPRadiologiPerPage,
          });
          const result = dataBMHPRadiologiFormatHandler(response.data.data);
          setDataBMHPRadiologi(result);
          setDataMetaBMHPRadiologi(response.data.meta);
        }
      } catch (error) {
        setSnackbarState({
          state: true,
          type: "error",
          message: error.message,
        });
      } finally {
        setIsUpdatingDataBMHPRadiologi(false);
      }
    };
  
    useEffect(() => {
      initDataBMHPRadiologi();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    return (
      <>
        {isLoadingDataBMHPRadiologi ? (
          <div className="flex justify-center items-center flex--fill-height-with-header">
            <Spinner />
          </div>
        ) : (
          <TableLayoutV4
            baseRoutePath={`${router.asPath}`}
            title="BMHP Radiologi"
            tableHead={BMHPRadiologiTableHead}
            data={dataBMHPRadiologi}
            meta={dataMetaBMHPRadiologi}
            dataPerPage={dataBMHPRadiologiPerPage}
            isUpdatingData={isUpdatingDataEmploye}
            filterOptions={[
                { label: "Tanggal", value: "waktuPemakaian" },
              ]}
            updateDataPerPage={(e) => {
              setDataPerPage(e.target.value);
              updateDataRoleHandler({ per_page: e.target.value });
            }}
            updateDataNavigate={(payload) =>
              updateDataRoleHandler({
                per_page: dataBMHPRadiologiPerPage,
                cursor: payload,
              })
            }
            refreshData={() =>
              updateDataRoleHandler({ per_page: dataBMHPRadiologiPerPage })
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
export default BmhpRadiologi;