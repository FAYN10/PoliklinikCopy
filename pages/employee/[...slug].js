import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getDetailEmployee } from "api/employee";
import LoaderOnLayout from "components/LoaderOnLayout";
import FormEmployee from "components/modules/employee/form";
import { formatGenToIso } from "utils/formatTime";
import getStaticData from "utils/getStaticData";

const DetailEmployee = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [dataEmployee, setDataEmployee] = useState({});
  const [detailDataEmployee, setDetailDataEmployee] = useState({});
  const [isLoadingDataEmployee, setIsLoadingDataEmployee] = useState(true);

  const dataFormatter = (data) => {
    let tempData = {
      nip: data.nip || "",
      name: data.name || "",
      callname: data.callname || "",
      birth_place: data.birth_place || "",
      birth_date: formatGenToIso(data.birth_date) || null,
      gender: getStaticData("gender", data.gender || ""),
      religion: data.religion || { id: "", name: "" },
      telp: data.telp || "",
      email: data.email || "",
      marital_status: getStaticData("maritalStatus", data.marital_status || ""),
      blood: getStaticData("bloodType", data.blood || ""),
      citizen: getStaticData("countries", data.citizen || ""),
      no_identity: data.no_identity,
      npwp: data.npwp,
      bank: getStaticData("bank", data.bank || ""),
      bank_account_number: data.bank_account_number || "",
      address_identity: data.address_identity || "",
      province_identity: data.province_identity || { kode: "", nama: "" },
      city_identity: data.city_identity || { kode: "", nama: "" },
      subdistrict_identity: data.subdistrict_identity || { kode: "", nama: "" },
      ward_identity: data.ward_identity || { kode: "", nama: "" },
      rt_identity: data.rt_identity || "",
      rw_identity: data.rw_identity || "",
      address_now: data.address_now || "",
      province_now: data.province_now || { kode: "", nama: "" },
      city_now: data.city_now || { kode: "", nama: "" },
      subdistrict_now: data.subdistrict_now || { kode: "", nama: "" },
      ward_now: data.ward_now || { kode: "", nama: "" },
      rt_now: data.rt_now || "",
      rw_now: data.rw_now || "",
      distance: data.distance || "",
    };
    return { ...tempData };
  };

  const updateData = (data) => {
    setDetailDataEmployee(data);
    setDataEmployee(() => dataFormatter(data));
  };

  useEffect(() => {
    if (router.isReady) {
      (async () => {
        try {
          const response = await getDetailEmployee({ id: slug[0] });
          const data = response.data.data;
          const formattedData = dataFormatter(data);
          setDataEmployee(formattedData);
          setDetailDataEmployee(data);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoadingDataEmployee(false);
        }
      })();
    }
  }, [router.isReady, slug]);

  return (
    <>
      {isLoadingDataEmployee ? (
        <LoaderOnLayout />
      ) : (
        <>
          <h2 className="color-grey-text mt-0">Detail employe</h2>
          <FormEmployee
            isEditType
            prePopulatedDataForm={dataEmployee}
            detailPrePopulatedData={detailDataEmployee}
            updatePrePopulatedData={updateData}
          />
        </>
      )}
    </>
  );
};

export default DetailEmployee;
