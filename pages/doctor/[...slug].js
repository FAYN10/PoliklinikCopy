import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getDetailDoctor } from "api/doctor";
import LoaderOnLayout from "components/LoaderOnLayout";
import FormDoctor from "components/modules/doctor/form";
import { formatGenToIso } from "utils/formatTime";
import getStaticData from "utils/getStaticData";

const Detail = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [dataDoctor, setDataDoctor] = useState({});
  const [detailDataDoctor, setDetailDataDoctor] = useState({});
  const [isLoadingDataDoctor, setIsLoadingDataDoctor] = useState(true);

  const dataFormatter = (data) => {
    let tempData = {
      employee_id: data.employee,
      poliklinik_id: data.poliklinik,
      status_aktif: getStaticData("statusAktif", data.status_aktif || false),
      no_sip: data.no_sip,
      tgl_expired_sip: formatGenToIso(data.tgl_expired_sip),
      status_ppa: getStaticData("statusPPA", data.status_ppa || ""),
    };
    return { ...tempData };
  };

  const updateData = (data) => {
    setDetailDataDoctor(data);
    setDataDoctor(() => dataFormatter(data));
  };

  useEffect(() => {
    if (router.isReady) {
      (async () => {
        try {
          const response = await getDetailDoctor({ id: slug[0] });
          const data = response.data.data;
          const formattedData = dataFormatter(data);
          setDataDoctor(formattedData);
          setDetailDataDoctor(data);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoadingDataDoctor(false);
        }
      })();
    }
  }, [router.isReady, slug]);

  return (
    <>
      {isLoadingDataDoctor ? (
        <LoaderOnLayout />
      ) : (
        <>
          <h2 className="color-grey-text mt-0">Detail dokter</h2>
          <FormDoctor
            isEditType
            prePopulatedDataForm={dataDoctor}
            detailPrePopulatedData={detailDataDoctor}
            updatePrePopulatedData={updateData}
          />
        </>
      )}
    </>
  );
};

export default Detail;
