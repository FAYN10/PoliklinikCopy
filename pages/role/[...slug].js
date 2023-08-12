import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getDetailRole } from "api/role";
import LoaderOnLayout from "components/LoaderOnLayout";
import FormRole from "components/modules/role/form";

const Detail = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [dataRole, setDataRole] = useState({});
  const [detailDataRole, setDetailDataRole] = useState({});
  const [isLoadingDataRole, setIsLoadingDataRole] = useState(true);

  const dataFormatter = (data) => {
    let tempArr = [];
    data.permissions.forEach((e) => {
      tempArr.push(e.name);
    });
    let tempData = {
      name: data.name,
      permissions: [...tempArr],
    };
    return { ...tempData };
  };

  const updateData = (data) => {
    setDetailDataRole(data);
    setDataRole(() => dataFormatter(data));
  };

  useEffect(() => {
    if (router.isReady) {
      (async () => {
        try {
          const response = await getDetailRole({ id: slug[0] });
          const data = response.data.data;
          const formattedData = dataFormatter(data);
          setDataRole(formattedData);
          setDetailDataRole(data);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoadingDataRole(false);
        }
      })();
    }
  }, [router.isReady, slug]);

  return (
    <>
      {isLoadingDataRole ? (
        <LoaderOnLayout />
      ) : (
        <>
          <h2 className="color-grey-text mt-0">Detail role</h2>
          <FormRole
            isEditType
            prePopulatedDataForm={dataRole}
            detailPrePopulatedData={detailDataRole}
            updatePrePopulatedData={updateData}
          />
        </>
      )}
    </>
  );
};

export default Detail;
