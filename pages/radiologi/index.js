import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getListPasien, deletePasien, searchPasien } from "api/pasien";
import TableLayout from "components/TableLayout";
import TableLayoutV3 from "components/TableLayoutV3";
import LoaderOnLayout from "components/LoaderOnLayout";
import Snackbar from "components/SnackbarMui";


const radiologiTableHead = [
    {
        id: "antrian",
        label: "No. Antrian",
    },
    {
        id: "no_rm",
        label: "No. RM",
        
    },
    {
        id: "nama_pasien",
        label: "Nama",
    },
    // {
    //     id: "nik",
    //     label: "NIK/Passport",
    // },
    {
        id: "alamat",
        label: "Alamat",
    },
    {
        id: "asuransi",
        label: "Tipe jaminan",
    },
    {
        id: "prioritas",
        label: "Prioritas",
    },
    {
        id: "poli",
        label: "Pelayanan",
    },
    {
        id: "dokter",
        label: "Dokter",
    },
];

const dataPasienFormatHandler = (payload) => {
    const result = payload.map((e) => {
        return {
            antrian: e.antrian || "null",
            no_rm: e.no_rm || "null",
            nama_pasien: e.nama_pasien,
            // nik: e.nik || e.no_passport || "null",
            alamat_domisili: e.alamat_domisili || "null",
            asuransi: e.asuransi || "null",
            prioriats: e.prioriats || "null",
            poli: e.poli || "null",
            dokter: e.dokter || "null",
            id: e.id,
        };
    });
    result.sort((a, b) => parseInt(a.antrian) - parseInt(b.antrian));
    return result;
};

const Radiologi = () => {
    const router = useRouter();
    const [snackbarState, setSnackbarState] = useState({
        state: false,
        type: null,
        message: "",
    });
    const [activeContent, setActiveContent] = useState(1);

    // pasien --general state
    const [dataPasien, setDataPasien] = useState([]);
    const [dataMetaPasien, setDataMetaPasien] = useState({});
    const [dataPasienPerPage, setDataPerPage] = useState(8);
    const [isLoadingDataPasien, setIsLoadingDataPasien] = useState(false);
    const [isUpdatingDataPasien, setIsUpdatingDataPasien] = useState(false);

    // pasien --general handler
    const initDataPasien = async () => {
        try {
            setIsLoadingDataPasien(true);
            const params = {
                per_page: dataPasienPerPage,
            };
            const response = await getListPasien(params);
            const result = dataPasienFormatHandler(response.data.data);
            setDataPasien(result);
            setDataMetaPasien(response.data.meta);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoadingDataPasien(false);
        }
    };
    const updateDataPasienHandler = async (payload) => {
        try {
            setIsUpdatingDataPasien(true);
            const response = await getListPasien(payload);
            const result = dataPasienFormatHandler(response.data.data);
            setDataPasien(result);
            setDataMetaPasien(response.data.meta);
        } catch (error) {
            console.log(error);
            setSnackbarState({
                state: true,
                type: "error",
                message: error.message,
            });
        } finally {
            setIsUpdatingDataPasien(false);
        }
    };
    const deletaDataPasienHandler = async (payload) => {
        try {
            setIsUpdatingDataPasien(true);
            const response = await deletePasien({ id: payload });
            setSnackbarState({
                state: true,
                type: "success",
                message: response.data.message,
            });
            updateDataPasienHandler({ per_page: dataPasienPerPage });
        } catch (error) {
            setSnackbarState({
                state: true,
                type: "error",
                message: error.message,
            });
        } finally {
            setIsUpdatingDataPasien(false);
        }
    };
    const searchDataPasienHandler = async (payload) => {
        try {
            setIsUpdatingDataPasien(true);
            const response = await searchPasien({
                search_text: payload.map((e) => e.value),
                search_column: payload.map((e) => e.type),
                per_page: dataPasienPerPage,
            });
            if (response.data.data.length !== 0) {
                const result = dataPasienFormatHandler(response.data.data);
                setDataPasien(result);
                setDataMetaPasien(response.data.meta);
            } else {
                setSnackbarState({
                    state: true,
                    type: "warning",
                    message: `${payload} tidak ditemukan`,
                });
                const response = await getListPasien({
                    per_page: dataPasienPerPage,
                });
                const result = dataPasienFormatHandler(response.data.data);
                setDataPasien(result);
                setDataMetaPasien(response.data.meta);
            }
        } catch (error) {
            setSnackbarState({
                state: true,
                type: "error",
                message: error.message,
            });
        } finally {
            setIsUpdatingDataPasien(false);
        }
    };
    

    useEffect(() => {
        if (Object.keys(router.query).length !== 0) {
            setActiveContent(parseInt(router.query.active_content));
        }
    }, [router]);

    useEffect(() => {
        initDataPasien();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {isLoadingDataPasien ? (
                <LoaderOnLayout />
            ) : (
                <>
                    <TableLayoutV3
                        baseRoutePath={`${router.asPath}`}
                        title="Pasien Radiologi"
                        tableHead={radiologiTableHead}
                        data={dataPasien}
                        meta={dataMetaPasien}
                        dataPerPage={dataPasienPerPage}
                        isUpdatingData={isUpdatingDataPasien}
                        filterOptions={[
                            { label: "Tipe Jaminan", value: "asuransi" },
                            { label: "Pelayanan", value: "poli" },
                            { label: "Prioritas", value: "prioritas" },
                            { label: "Tanggal", value: "date" },
                          ]}
                        updateDataPerPage={(e) => {
                            setDataPerPage(e.target.value);
                            updateDataPasienHandler({ per_page: e.target.value });
                        }}
                        updateDataNavigate={(payload) =>
                            updateDataPasienHandler({
                                per_page: dataPasienPerPage,
                                cursor: payload,
                            })
                        }
                        refreshData={() =>
                            updateDataPasienHandler({ per_page: dataPasienPerPage })
                        }
                        deleteData={deletaDataPasienHandler}
                        searchData={searchDataPasienHandler}
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

export default Radiologi;
