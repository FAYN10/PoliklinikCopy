import Dialog from "@mui/material/Dialog";
import Avatar from "@mui/material/Avatar";
import { getItem } from "utils/storage";

const DialogProfile = ({ state, setState }) => {
  const basicData = getItem("basic_client");
  const handleClose = () => {
    setState(false);
  };
  const formattedRoles = () => basicData?.roles.map((e) => e.name);

  return (
    <>
      <Dialog onClose={handleClose} open={state}>
        <div className="p-24 flex flex--gap-24">
          <Avatar
            src={`${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/sdm-service/${basicData?.user.employee.photo}`}
            sx={{ width: 100, height: 100 }}
            aria-describedby="avatar"
          />
          <div>
            <div>Name: {basicData?.user.username}</div>
            <div>Username: {basicData?.user.employee.name}</div>
            <div>Email: {basicData?.user.email}</div>
            <div>Roles: {formattedRoles()?.join(", ")}</div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default DialogProfile;
