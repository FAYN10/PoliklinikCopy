import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getDetailSuster } from "api/suster";
import LoaderOnLayout from "components/LoaderOnLayout";
import FormSuster from "components/modules/suster/form";
import { formatGenToIso } from "utils/formatTime";
import getStaticData from "utils/getStaticData";

const Detail = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [dataSuster, setDataSuster] = useState({});
  const [detailDataSuster, setDetailDataSuster] = useState({});
  const [isLoadingDataSuster, setIsLoadingDataSuster] = useState(true);

  const dataFormatter = (data) => {
    let tempData = {
      employee_id: data.employee,
      status_aktif: getStaticData("statusAktif", data.status_aktif || false),
      no_str: data.no_str,
      tgl_expired_str: formatGenToIso(data.tgl_expired_str),
      status_ppa: getStaticData("statusPPA", data.status_ppa || ""),
    };
    return { ...tempData };
  };

  const updateData = (data) => {
    setDetailDataSuster(data);
    setDataSuster(() => dataFormatter(data));
  };

  useEffect(() => {
    if (router.isReady) {
      (async () => {
        try {
          const response = await getDetailSuster({ id: slug[0] });
          const data = response.data.data;
          const formattedData = dataFormatter(data);
          setDataSuster(formattedData);
          setDetailDataSuster(data);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoadingDataSuster(false);
        }
      })();
    }
  }, [router.isReady, slug]);

  return (
    <>
      {isLoadingDataSuster ? (
        <LoaderOnLayout />
      ) : (
        <>
          <h2 className="color-grey-text mt-0">Detail perawat</h2>
          <FormSuster
            isEditType
            prePopulatedDataForm={dataSuster}
            detailPrePopulatedData={detailDataSuster}
            updatePrePopulatedData={updateData}
          />
        </>
      )}
    </>
  );
};

export default Detail;
