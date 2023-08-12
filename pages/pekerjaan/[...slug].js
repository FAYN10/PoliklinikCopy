import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getDetailPekerjaan } from "api/pekerjaan";
import LoaderOnLayout from "components/LoaderOnLayout";
import Form from "components/modules/pekerjaan/form";

const Detail = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [data, setData] = useState({});
  const [detailData, setDetailData] = useState({});
  const [isLoadingData, setIsLoadingData] = useState(true);

  const dataFormatter = (payload) => {
    let tempData = {
      name: payload.name,
    };
    return { ...tempData };
  };

  const updateData = (data) => {
    setDetailData(data);
    setData(() => dataFormatter(data));
  };

  useEffect(() => {
    if (router.isReady) {
      (async () => {
        try {
          const response = await getDetailPekerjaan({ id: slug[0] });
          const data = response.data.data;
          const formattedData = dataFormatter(data);
          setData(formattedData);
          setDetailData(data);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoadingData(false);
        }
      })();
    }
  }, [router.isReady, slug]);

  return (
    <>
      {isLoadingData ? (
        <LoaderOnLayout />
      ) : (
        <>
          <h2 className="color-grey-text mt-0">Detail pekerjaan</h2>
          <Form
            isEditType
            prePopulatedDataForm={data}
            detailPrePopulatedData={detailData}
            updatePrePopulatedData={updateData}
          />
        </>
      )}
    </>
  );
};

export default Detail;
