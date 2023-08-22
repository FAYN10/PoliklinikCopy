import { useEffect, useState } from "react";
import { useRouter } from "next/router";
// import { getListBmhpRadiologi, deleteBmhpRadiologi, searchBmhpRadiologi } from "api/BmhpRadiologi";
import TableLayout from "components/TableLayout";
import Spinner from "components/SpinnerMui";
import Snackbar from "components/SnackbarMui";
import { formatReadable } from "utils/formatTime";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import TableLayoutV4 from "components/TableLayoutV4";

const bmhpRadiologiTableHead = [
    {
        id: "namaBarang",
        label: "Nama barang",
    },
    {
        id: "jumlahBarang",
        label: "Jumlah Barang",
    },
    {
        id: "waktuPemakaian",
        label: "Waktu Pemakaian",
    },
];

const dataBmhpRadiologiFormatHandler = (payload) => {
    const result = payload.map((e) => {
        return {
            namaBarang: e.namaBarang || "null",
            jumlahBarang: e.jumlahBarang || "null",
            waktuPemakaian: e.waktuPemakaian,

        };
    });
    result.sort((a, b) => parseInt(a.antrian) - parseInt(b.antrian));
    return result;
};

const BmhpRadiologi = () => {
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const openAddDialogHandler = () => {
        setOpenAddDialog(true);
    };
    const closeAddDialogHandler = () => {
        setOpenAddDialog(false);
    };

    const [newBmhpData, setNewBmhpData] = useState({
        namaBarang: "",
        jumlahBarang: "",
        waktuPemakaian: "",
    });
    const router = useRouter();
    const [dataBmhpRadiologi, setDataBmhpRadiologi] = useState([
        ]);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editData, setEditData] = useState(null);

    const openEditDialogHandler = (data) => {
        setEditData(data);
        setOpenEditDialog(true);
    };

    const closeEditDialogHandler = () => {
        setOpenEditDialog(false);
        setEditData(null);
    };
    //   const [dataBmhpRadiologi, setDataBmhpRadiologi] = useState([]);
    const [dataMetaBmhpRadiologi, setDataMetaBmhpRadiologi] = useState({});
    const [dataBmhpRadiologiPerPage, setDataPerPage] = useState(8);
    const [isLoadingDataBmhpRadiologi, setIsLoadingDataBmhpRadiologi] = useState(false);
    const [isUpdatingDataEmploye, setIsUpdatingDataBmhpRadiologi] = useState(false);
    const [snackbarState, setSnackbarState] = useState({
        state: false,
        type: null,
        message: "",
    });
    const addNewBmhpHandler = () => {

    };

    const initDataBmhpRadiologi = async () => {
        try {
            setIsLoadingDataBmhpRadiologi(true);
            const params = {
                per_page: dataBmhpRadiologiPerPage,
            };
            const response = await getListBmhpRadiologi(params);
            const result = dataBmhpRadiologiFormatHandler(response.data.data);
            setDataBmhpRadiologi(result);
            setDataMetaBmhpRadiologi(response.data.meta);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoadingDataBmhpRadiologi(false);
        }
    };

    const updateDataRoleHandler = async (payload) => {
        try {
            setIsUpdatingDataBmhpRadiologi(true);
            const response = await getListBmhpRadiologi(payload);
            const result = dataBmhpRadiologiFormatHandler(response.data.data);
            setDataBmhpRadiologi(result);
            setDataMetaBmhpRadiologi(response.data.meta);
        } catch (error) {
            console.log(error);
            setSnackbarState({
                state: true,
                type: "error",
                message: error.message,
            });
        } finally {
            setIsUpdatingDataBmhpRadiologi(false);
        }
    };

    const deletaDataRoleHandler = async (payload) => {
        try {
            setIsUpdatingDataBmhpRadiologi(true);
            const response = await deleteBmhpRadiologi({ id: payload });
            setSnackbarState({
                state: true,
                type: "success",
                message: response.data.message,
            });
            updateDataRoleHandler({ per_page: dataBmhpRadiologiPerPage });
        } catch (error) {
            setSnackbarState({
                state: true,
                type: "error",
                message: error.message,
            });
        } finally {
            setIsUpdatingDataBmhpRadiologi(false);
        }
    };

    const searchDataRoleHandler = async (payload) => {
        try {
            setIsUpdatingDataBmhpRadiologi(true);
            const response = await searchBmhpRadiologi({
                search: payload,
                per_page: dataBmhpRadiologiPerPage,
            });
            if (response.data.data.length !== 0) {
                const result = dataBmhpRadiologiFormatHandler(response.data.data);
                setDataBmhpRadiologi(result);
                setDataMetaBmhpRadiologi(response.data.meta);
            } else {
                setSnackbarState({
                    state: true,
                    type: "warning",
                    message: `${payload} tidak ditemukan`,
                });
                const response = await getListBmhpRadiologi({
                    per_page: dataBmhpRadiologiPerPage,
                });
                const result = dataBmhpRadiologiFormatHandler(response.data.data);
                setDataBmhpRadiologi(result);
                setDataMetaBmhpRadiologi(response.data.meta);
            }
        } catch (error) {
            setSnackbarState({
                state: true,
                type: "error",
                message: error.message,
            });
        } finally {
            setIsUpdatingDataBmhpRadiologi(false);
        }
    };

    useEffect(() => {
        initDataBmhpRadiologi();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {isLoadingDataBmhpRadiologi ? (
                <div className="flex justify-center items-center flex--fill-height-with-header">
                    <Spinner />
                </div>
            ) : (
                <TableLayoutV4
                    baseRoutePath={`${router.asPath}`}
                    title="BMHP Radiologi"
                    tableHead={bmhpRadiologiTableHead}
                    data={dataBmhpRadiologi}
                    meta={dataMetaBmhpRadiologi}
                    dataPerPage={dataBmhpRadiologiPerPage}
                    isUpdatingData={isUpdatingDataEmploye}
                    filterOptions={[
                        { label: "Tanggal", value: "date" },
                    ]}
                    updateDataPerPage={(e) => {
                        setDataPerPage(e.target.value);
                        updateDataRoleHandler({ per_page: e.target.value });
                    }}
                    updateDataNavigate={(payload) =>
                        updateDataRoleHandler({
                            per_page: dataBmhpRadiologiPerPage,
                            cursor: payload,
                        })
                    }
                    refreshData={() =>
                        updateDataRoleHandler({ per_page: dataBmhpRadiologiPerPage })
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
            <Dialog open={openAddDialog} onClose={closeAddDialogHandler}>
                <DialogTitle>Tambah BMHP Baru</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Nama Barang"
                        fullWidth
                        variant="outlined"
                        value={newBmhpData.namaBarang}
                        onChange={(e) => setNewBmhpData({ ...newBmhpData, namaBarang: e.target.value })}
                    />
                    <TextField
                        label="Jumlah Barang"
                        fullWidth
                        type="number"
                        variant="outlined"
                        value={newBmhpData.jumlahBarang}
                        onChange={(e) => setNewBmhpData({ ...newBmhpData, jumlahBarang: e.target.value })}
                    />
                    <TextField
                        label="Waktu Pemakaian"
                        fullWidth
                        type="date"
                        variant="outlined"
                        value={newBmhpData.waktuPemakaian}
                        onChange={(e) => setNewBmhpData({ ...newBmhpData, waktuPemakaian: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeAddDialogHandler} color="primary">
                        Batal
                    </Button>
                    <Button onClick={addNewBmhpHandler} color="primary">
                        Tambah
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BmhpRadiologi;