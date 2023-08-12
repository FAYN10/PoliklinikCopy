import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getListPasien, deletePasien, searchPasien } from "api/pasien";
import TableLayout from "components/TableLayout";
import TableLayoutV2 from "components/TableLayoutV2";
import LoaderOnLayout from "components/LoaderOnLayout";
import Snackbar from "components/SnackbarMui";
import RawatJalanTableHeader from "components/modules/pasien/rawatJalanTableHeader";
import RawatInapTableHeader from "components/modules/pasien/rawatInapTableHeader";
import { getListRawatJalan } from "api/rawat-jalan";
import { getListRawatInap } from "api/rawat-inap";

const pasienTableHead = [
  {
    id: "no_rm",
    label: "Nomor RM",
  },
  {
    id: "nama_pasien",
    label: "Nama",
  },
  {
    id: "nik",
    label: "NIK/Passport",
  },
  {
    id: "alamat",
    label: "Alamat",
  },
];

const dataPasienFormatHandler = (payload) => {
  const result = payload.map((e) => {
    return {
      no_rm: e.no_rm || "null",
      nama_pasien: e.nama_pasien,
      nik: e.nik || e.no_passport || "null",
      alamat_domisili: e.alamat_domisili || "null",
      id: e.id,
    };
  });
  return result;
};

const rawatJalanTableHead = [
  {
    id: "no_rm",
    label: "Nomor RM",
  },
  {
    id: "nama",
    label: "Nama",
  },
  {
    id: "alamat",
    label: "Alamat",
  },
  {
    id: "asuransi",
    label: "Asuransi",
  },
  {
    id: "DATETIME_MEDIS",
    label: "Tgl Masuk",
  },
  {
    id: "poliklinik",
    label: "Poliklinik",
  },
  {
    id: "dokter",
    label: "Dokter",
  },
  {
    id: "antrian",
    label: "No. Antri",
  },
  {
    id: "rujukan",
    label: "Rujukan",
  },
];

const dataRawatJalanFormatHandler = (payload) => {
  const result = payload.map((e) => {
    return {
      no_rm: e.no_rm || "-",
      nama: e.nama || "-",
      alamat: e.alamat || "-",
      asuransi: e.asuransi || "-",
      DATETIME_MEDIS: e.DATETIME_MEDIS || "-",
      poliklinik: e.poliklinik || "-",
      dokter: e.dokter || "-",
      antrian: e.antrian || "-",
      rujukan: e.rujukan || "-",
      // id: e.id,
    };
  });
  return result;
};

const rawatInapTableHead = [
  {
    id: "no_rm",
    label: "Nomor RM",
  },
  {
    id: "nik",
    label: "NIK",
  },
  {
    id: "nama",
    label: "Nama",
  },
  {
    id: "alamat",
    label: "Alamat",
  },
  {
    id: "tgl_masuk",
    label: "Tgl Masuk",
  },
  {
    id: "kamar",
    label: "Kamar/Bangsal",
  },
  {
    id: "diet",
    label: "Diet",
  },
  {
    id: "dpjp",
    label: "DPJP",
  },
];

const dataRawatInapFormatHandler = (payload) => {
  const result = payload.map((e) => {
    return {
      no_rm: e.no_rm || "-",
      nik: e.nik || "-",
      nama: e.nama || "-",
      alamat: e.alamat || "-",
      tgl_masuk: e.tgl_masuk || "-",
      kamar: e.kamar || "-",
      diet: e.diet || "-",
      dpjp: e.dpjp || "-",
      // id: e.id,
    };
  });
  return result;
};

const Pasien = () => {
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
  // pasien --rawat-jalan state
  const [dataRawatJalan, setDataRawatJalan] = useState([]);
  const [dataMetaRawatJalan, setDataMetaRawatJalan] = useState({});
  const [dataRawatJalanPerPage, setDataRawatJalanPerPage] = useState(8);
  const [isLoadingDataRawatJalan, setIsLoadingDataRawatJalan] = useState(false);
  const [isUpdatingDataRawatJalan, setIsUpdatingDataRawatJalan] =
    useState(false);
  // pasien --rawat-inap state
  const [dataRawatInap, setDataRawatInap] = useState([]);
  const [dataMetaRawatInap, setDataMetaRawatInap] = useState({});
  const [dataRawatInapPerPage, setDataRawatInapPerPage] = useState(8);
  const [isLoadingDataRawatInap, setIsLoadingDataRawatInap] = useState(false);
  const [isUpdatingDataRawatInap, setIsUpdatingDataRawatInap] = useState(false);

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
  // pasien --rawat-jalan handler
  const initDataRawatJalan = async () => {
    try {
      setIsLoadingDataRawatJalan(true);
      const params = {
        per_page: dataRawatJalanPerPage,
      };
      const response = await getListRawatJalan(params);
      const result = dataRawatJalanFormatHandler(response.data.data);
      setDataRawatJalan(result);
      setDataMetaRawatJalan(response.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataRawatJalan(false);
    }
  };
  const updateDataRawatJalanHandler = async (payload) => {
    try {
      setIsUpdatingDataRawatJalan(true);
      const response = await getListRawatJalan(payload);
      const result = dataRawatJalanFormatHandler(response.data.data);
      setDataRawatJalan(result);
      setDataMetaRawatJalan(response.data.meta);
    } catch (error) {
      console.log(error);
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataRawatJalan(false);
    }
  };
  const deletaDataRawatJalanHandler = async (payload) => {
    // not ready yet
    // try {
    //   setIsUpdatingDataRawatJalan(true);
    //   setSnackbarState({
    //     state: true,
    //     type: "success",
    //     message: response.data.message,
    //   });
    //   updateDataRawatJalanHandler({ per_page: dataRawatJalanPerPage });
    // } catch (error) {
    //   setSnackbarState({
    //     state: true,
    //     type: "error",
    //     message: error.message,
    //   });
    // } finally {
    //   setIsUpdatingDataRawatJalan(false);
    // }
  };
  const searchDataRawatJalanHandler = async (payload) => {
    try {
      setIsUpdatingDataRawatJalan(true);
      const response = await getListRawatJalan({
        search_text: payload.map((e) => e.value),
        search_column: payload.map((e) => e.type),
        per_page: dataRawatJalanPerPage,
      });
      if (response.data.data.length !== 0) {
        const result = dataRawatJalanFormatHandler(response.data.data);
        setDataRawatJalan(result);
        setDataMetaRawatJalan(response.data.meta);
      } else {
        setSnackbarState({
          state: true,
          type: "warning",
          message: `${payload} tidak ditemukan`,
        });
        const response = await getListRawatJalan({
          per_page: dataRawatJalanPerPage,
        });
        const result = dataRawatJalanFormatHandler(response.data.data);
        setDataRawatJalan(result);
        setDataMetaRawatJalan(response.data.meta);
      }
    } catch (error) {
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataRawatJalan(false);
    }
  };
  // pasien --rawat-inap handler
  const initDataRawatInap = async () => {
    try {
      setIsLoadingDataRawatInap(true);
      const params = {
        per_page: dataRawatInapPerPage,
      };
      const response = await getListRawatInap(params);
      const result = dataRawatInapFormatHandler(response.data.data);
      setDataRawatInap(result);
      setDataMetaRawatInap(response.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataRawatInap(false);
    }
  };
  const updateDataRawatInapHandler = async (payload) => {
    try {
      setIsUpdatingDataRawatInap(true);
      const response = await getListRawatInap(payload);
      const result = dataRawatInapFormatHandler(response.data.data);
      setDataRawatInap(result);
      setDataMetaRawatInap(response.data.meta);
    } catch (error) {
      console.log(error);
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataRawatInap(false);
    }
  };
  const deletaDataRawatInapHandler = async (payload) => {
    // not ready yet
    // try {
    //   setIsUpdatingDataRawatInap(true);
    //   setSnackbarState({
    //     state: true,
    //     type: "success",
    //     message: response.data.message,
    //   });
    //   updateDataRawatInapHandler({ per_page: dataRawatInapPerPage });
    // } catch (error) {
    //   setSnackbarState({
    //     state: true,
    //     type: "error",
    //     message: error.message,
    //   });
    // } finally {
    //   setIsUpdatingDataRawatInap(false);
    // }
  };
  const searchDataRawatInapHandler = async (payload) => {
    try {
      setIsUpdatingDataRawatInap(true);
      const response = await getListRawatInap({
        search_text: payload.map((e) => e.value),
        search_column: payload.map((e) => e.type),
        per_page: dataRawatInapPerPage,
      });
      if (response.data.data.length !== 0) {
        const result = dataRawatInapFormatHandler(response.data.data);
        setDataRawatInap(result);
        setDataMetaRawatInap(response.data.meta);
      } else {
        setSnackbarState({
          state: true,
          type: "warning",
          message: `${payload} tidak ditemukan`,
        });
        const response = await getListRawatInap({
          per_page: dataRawatInapPerPage,
        });
        const result = dataRawatInapFormatHandler(response.data.data);
        setDataRawatInap(result);
        setDataMetaRawatInap(response.data.meta);
      }
    } catch (error) {
      setSnackbarState({
        state: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingDataRawatInap(false);
    }
  };

  useEffect(() => {
    if (Object.keys(router.query).length !== 0) {
      setActiveContent(parseInt(router.query.active_content));
    }
  }, [router]);

  useEffect(() => {
    initDataPasien();
    initDataRawatJalan();
    initDataRawatInap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoadingDataPasien ||
      isLoadingDataRawatJalan ||
      isLoadingDataRawatInap ? (
        <LoaderOnLayout />
      ) : (
        <>
          <div className="tab-list flex mb-24">
            <div
              className={activeContent === 1 ? "pointer active" : "pointer"}
              onClick={() => setActiveContent(1)}
            >
              Pasien
            </div>
            <div
              className={activeContent === 2 ? "pointer active" : "pointer"}
              onClick={() => setActiveContent(2)}
            >
              Rawat Jalan
            </div>
            <div
              className={activeContent === 3 ? "pointer active" : "pointer"}
              onClick={() => setActiveContent(3)}
            >
              Rawat Inap
            </div>
          </div>
          {activeContent === 1 && (
            <TableLayoutV2
              baseRoutePath={`${router.asPath}`}
              title="Pasien"
              tableHead={pasienTableHead}
              data={dataPasien}
              meta={dataMetaPasien}
              dataPerPage={dataPasienPerPage}
              isUpdatingData={isUpdatingDataPasien}
              filterOptions={[
                { label: "No. RM", value: "no_rm" },
                { label: "Email", value: "email" },
                { label: "Nama", value: "name" },
                { label: "Alamat", value: "address" },
              ]}
              updateDataPerPage={(e, filter) => {
                setDataPerPage(e.target.value);
                updateDataPasienHandler({
                  per_page: e.target.value,
                  search_text: filter.map((e) => e.value),
                  search_column: filter.map((e) => e.type),
                });
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
          )}
          {activeContent === 2 && (
            <TableLayoutV2
              baseRoutePath={`${router.asPath}`}
              title="Pasien Rawat Jalan"
              isBtnAdd={false}
              tableHead={rawatJalanTableHead}
              data={dataRawatJalan}
              meta={dataMetaRawatJalan}
              dataPerPage={dataRawatJalanPerPage}
              isUpdatingData={isUpdatingDataRawatJalan}
              filterOptions={[
                { label: "No. RM", value: "no_rm" },
                { label: "Email", value: "email" },
                { label: "Nama", value: "name" },
                { label: "Poli", value: "poli" },
                { label: "Dokter", value: "doctor" },
                { label: "Tanggal", value: "date" },
              ]}
              updateDataPerPage={(e, filter) => {
                setDataRawatJalanPerPage(e.target.value);
                updateDataRawatJalanHandler({
                  per_page: e.target.value,
                  search_text: filter.map((e) => e.value),
                  search_column: filter.map((e) => e.type),
                });
              }}
              updateDataNavigate={(payload) =>
                updateDataRawatJalanHandler({
                  per_page: dataRawatJalanPerPage,
                  cursor: payload,
                })
              }
              refreshData={() =>
                updateDataPasienHandler({ per_page: dataRawatJalanPerPage })
              }
              deleteData={deletaDataRawatJalanHandler}
              searchData={searchDataRawatJalanHandler}
            />
          )}
          {activeContent === 3 && (
            <TableLayoutV2
              baseRoutePath={`${router.asPath}`}
              title="Pasien Rawat Inap"
              isBtnAdd={false}
              tableHead={rawatInapTableHead}
              data={dataRawatInap}
              meta={dataMetaRawatInap}
              dataPerPage={dataRawatInapPerPage}
              isUpdatingData={isUpdatingDataRawatInap}
              filterOptions={[
                { label: "No. RM", value: "no_rm" },
                { label: "Nama", value: "name" },
                { label: "Tanggal", value: "date" },
              ]}
              updateDataPerPage={(e, filter) => {
                setDataRawatInapPerPage(e.target.value);
                updateDataRawatInapHandler({
                  per_page: e.target.value,
                  search_text: filter.map((e) => e.value),
                  search_column: filter.map((e) => e.type),
                });
              }}
              updateDataNavigate={(payload) =>
                updateDataRawatInapHandler({
                  per_page: dataRawatInapPerPage,
                  cursor: payload,
                })
              }
              refreshData={() =>
                updateDataRawatInapHandler({ per_page: dataRawatInapPerPage })
              }
              deleteData={deletaDataRawatInapHandler}
              searchData={searchDataRawatInapHandler}
            />
          )}
          {/* {activeContent === 2 && (
            <TableLayout
              isCustomHeader
              customHeader={
                <>
                  <RawatJalanTableHeader
                    refreshData={(payload) =>
                      updateDataRawatJalanHandler({
                        ...payload,
                        per_page: dataRawatJalanPerPage,
                      })
                    }
                  />
                </>
              }
              customCreatePath="/pasien/create/rawat-jalan"
              baseRoutePath={`${router.asPath}`}
              title="Pasien Rawat Jalan"
              isBtnAdd={false}
              customBtnAddTitle="pendaftaran rawat jalan"
              tableHead={rawatJalanTableHead}
              data={dataRawatJalan}
              meta={dataMetaRawatJalan}
              dataPerPage={dataRawatJalanPerPage}
              isUpdatingData={isUpdatingDataRawatJalan}
              updateDataPerPage={(e) => {
                setDataRawatJalanPerPage(e.target.value);
                updateDataRawatJalanHandler({ per_page: e.target.value });
              }}
              updateDataNavigate={(payload) =>
                updateDataRawatJalanHandler({
                  per_page: dataRawatJalanPerPage,
                  cursor: payload,
                })
              }
              deleteData={deletaDataRawatJalanHandler}
            />
          )} */}
          {/* {activeContent === 3 && (
            <TableLayout
              isCustomHeader
              customHeader={
                <>
                  <RawatInapTableHeader
                    refreshData={(payload) =>
                      updateDataRawatInapHandler({
                        ...payload,
                        per_page: dataRawatInapPerPage,
                      })
                    }
                  />
                </>
              }
              customCreatePath="/pasien/create/rawat-inap"
              baseRoutePath={`${router.asPath}`}
              title="Pasien Rawat Inap"
              isBtnAdd={false}
              customBtnAddTitle="pendaftaran rawat inap"
              tableHead={rawatInapTableHead}
              data={dataRawatInap}
              meta={dataMetaRawatInap}
              dataPerPage={dataRawatInapPerPage}
              isUpdatingData={isUpdatingDataRawatInap}
              updateDataPerPage={(e) => {
                setDataRawatInapPerPage(e.target.value);
                updateDataRawatInapHandler({ per_page: e.target.value });
              }}
              updateDataNavigate={(payload) =>
                updateDataRawatInapHandler({
                  per_page: dataRawatInapPerPage,
                  cursor: payload,
                })
              }
              refreshData={() =>
                updateDataRawatInapHandler({ per_page: dataPasienPerPage })
              }
              deleteData={deletaDataRawatInapHandler}
            />
          )} */}
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

export default Pasien;
