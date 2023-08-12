import { useState, useEffect } from "react";
import { getItem } from "utils/storage";

const useClientPermission = () => {
  const [clientPermission, setClientPermission] = useState([]);

  useEffect(() => {
    const basicData = getItem("basic_client");
    if (basicData) {
      let tempRolesArr = [...basicData.roles];
      let tempPermissionArr = [];
      if (!tempRolesArr.length) return null;
      tempRolesArr.forEach((elementR) => {
        elementR.permissions.forEach((elementP) => {
          tempPermissionArr.push(elementP.name);
        });
      });
      if (tempPermissionArr.length) {
        tempPermissionArr = [...new Set(tempPermissionArr)];
        setClientPermission(tempPermissionArr);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    clientPermission,
    isActionPermitted(payload) {
      let value = true;
      if (clientPermission.includes("admin")) return value;
      if (!clientPermission.includes(payload)) {
        value = false;
      }
      return value;
    },
  };
};

export default useClientPermission;
