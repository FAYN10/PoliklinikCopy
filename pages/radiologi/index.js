import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getListRadiologi,
  deleteRadiologi,
  searchRadiologi,
} from "api/radiologi";
import TableLayout from "components/TableLayout";
import TableLayoutV3 from "components/TableLayoutV3";
import LoaderOnLayout from "components/LoaderOnLayout";
import Snackbar from "components/SnackbarMui";
import { getListPasien } from "api/pasien";

const radiologiTableHead = [
  {
    id: "no_antrian",
    label: "No. Antrian",
  },
  {
    id: "no_rm",
    label: "No. RM",
  },
  {
    id: "nama",
    label: "Nama",
  },
  {
    id: "alamat_domisili",
    label: "Alamat",
  },
  {
    id: "tipe_jaminan",
    label: "Tipe jaminan",
  },
  {
    id: "prioritas",
    label: "Prioritas",
  },
  {
    id: "pelayanan",
    label: "Pelayanan",
  },
  {
    id: "dokter",
    label: "Dokter",
  },
];

const dataRadiologiFormatHandler = (payload) => {
  const result = payload.map((e) => {
    return {
      antrian: e.no_antrian || "null",
      no_rm: e.no_rm || "null",
      nama_pasien: e.nama_pasien || "null",
      alamat_domisili: e.alamat_domisili || "null",
      asuransi: e.tipe_jaminan || "null",
      prioritas: e.prioritas === "1" ? "CITO" : "Non-CITO",
      poli: e.pelayanan || "null",
      dokter: e.dokter || "null",
      id: e.id,
    };
  });
  result.sort((a, b) => parseInt(a.antrian) - parseInt(b.antrian));
  return result;
};

const Radiologi = () => {
  const [dataPasien, setDataPasien] = useState([]);
  const [dataMetaPasien, setDataMetaPasien] = useState({});
  const [isLoadingDataPasien, setIsLoadingDataPasien] = useState(false);
  const [isUpdatingDataPasien, setIsUpdatingDataPasien] = useState(false);
  const router = useRouter();
  const [snackbarState, setSnackbarState] = useState({
    state: false,
    type: null,
    message: "",
  });
  const [activeContent, setActiveContent] = useState(1);

  // pasien --general state
  const [dataRadiologi, setDataRadiologi] = useState([]);
  const [dataMetaRadiologi, setDataMetaPermintaanRadiologi] = useState({});
  const [dataRadiologiPerPage, setDataPerPage] = useState(8);
  const [isLoadingDataRadiologi, setIsLoadingDataRadiologi] = useState(false);
  const [isUpdatingDataRadiologi, setIsUpdatingDataRadiologi] = useState(false);

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
  
  const initDataRadiologi = async () => {
    try {
      setIsLoadingDataRadiologi(true);
      const params = {
        per_page: dataRadiologiPerPage,
      };
      const response = await getListRadiologi(params);
      const result = dataRadiologiFormatHandler(response.data.data);
      setDataRadiologi(result);
      setDataMetaPermintaanRadiologi(response.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataRadiologi(false);
    }
  };
  const updateDataRadiologiHandler = async (payload) => {
    try {
      setIsUpdatingDataRadiologi(true);
      const response = await getListRadiologi(payload);
      const result = dataRadiologiFormatHandler(response.data.data);
      setDataRadiologi(result);
      setDataMetaPermintaanRadiologi(response.data.meta);
    } catch (error) {
      console.log(error);
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataRadiologi(false);
    }
  };
  const deletaDataRadiologiHandler = async (payload) => {
    try {
      setIsUpdatingDataRadiologi(true);
      const response = await deleteRadiologi({ id: payload });
      setSnackbarState({
        state: true,
        type: "success",
        message: response.data.message,
      });
      updateDataRadiologiHandler({ per_page: dataRadiologiPerPage });
    } catch (error) {
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataRadiologi(false);
    }
  };
  const searchDataRadiologiHandler = async (payload) => {
    try {
      setIsUpdatingDataRadiologi(true);
      const response = await searchRadiologi({
        search_text: payload.map((e) => e.value),
        search_column: payload.map((e) => e.type),
        per_page: dataRadiologiPerPage,
      });
      if (response.data.data.length !== 0) {
        const result = dataRadiologiFormatHandler(response.data.data);
        setDataRadiologi(result);
        setDataMetaPermintaanRadiologi(response.data.meta);
      } else {
        setSnackbarState({
          state: true,
          type: "warning",
          message: `${payload} tidak ditemukan`,
        });
        const response = await getListRadiologi({
          per_page: dataRadiologiPerPage,
        });
        const result = dataRadiologiFormatHandler(response.data.data);
        setDataRadiologi(result);
        setDataMetaPermintaanRadiologi(response.data.meta);
      }
    } catch (error) {
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataRadiologi(false);
    }
  };
  useEffect(() => {
    if (Object.keys(router.query).length !== 0) {
      setActiveContent(parseInt(router.query.active_content));
    }
  }, [router]);

  useEffect(() => {
    initDataRadiologi();
    initDataPasien();
  }, []);
  return (
    <>
      {isLoadingDataRadiologi ? (
        <LoaderOnLayout />
      ) : (
        <>
          <TableLayoutV3
            baseRoutePath={`${router.asPath}`}
            title="Pasien Radiologi"
            tableHead={radiologiTableHead}
            data={dataRadiologi}
            meta={dataMetaRadiologi}
            dataPerPage={dataRadiologiPerPage}
            isUpdatingData={isUpdatingDataRadiologi}
            filterOptions={[
              { label: "Tipe Jaminan", value: "asuransi" },
              { label: "Pelayanan", value: "poli" },
              { label: "Prioritas", value: "prioritas" },
              { label: "Tanggal", value: "date" },
            ]}
            updateDataPerPage={(e) => {
              setDataPerPage(e.target.value);
              updateDataRadiologiHandler({ per_page: e.target.value });
            }}
            updateDataNavigate={(payload) =>
              updateDataRadiologiHandler({
                per_page: dataRadiologiPerPage,
                cursor: payload,
              })
            }
            refreshData={() =>
              updateDataRadiologiHandler({ per_page: dataRadiologiPerPage })
            }
            deleteData={deletaDataRadiologiHandler}
            searchData={searchDataRadiologiHandler}
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
