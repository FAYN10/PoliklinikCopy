import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Popover from "@mui/material/Popover";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationsNoneOutlinedIcon from "@material-ui/icons/NotificationsNoneOutlined";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import Tooltip from "@mui/material/Tooltip";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import { removeItem as removeCookie } from "utils/cookies";
import { getItem, removeItem as removeStorage } from "utils/storage";
import DialogChangePass from "components/DialogChangePass";
import DialogProfile from "components/DialogProfile";

const drawerWidth = 279;
const bgMain = "#f9fafb";
const Top = ({ mobileOpen, handleDrawerToggle }) => {
  const router = useRouter();
  const [avatarState, setAvatarState] = useState(null);
  const openAvatarPopover = Boolean(avatarState);
  const avatarPopover = avatarState ? "avatar-popover" : undefined;
  const [notifState, setNotifState] = useState(null);
  const openNotifPopover = Boolean(notifState);
  const notifPopover = notifState ? "notif-popover" : undefined;
  const basicData = getItem("basic_client");
  const [dialogChangePass, setDialogChangePass] = useState(false);
  const [dialogProfile, setDialogProfile] = useState(false);

  const notificationsLabel = (count) => {
    if (count === 0) return "no notifications";
    if (count > 99) return "more than 99 notifications";
    return `${count} notifications`;
  };
  const logoutHandler = () => {
    removeCookie("client");
    removeStorage("basic_client");
    router.push("/login");
  };

  const changePassHandler = () => {
    setAvatarState(null);
    setDialogChangePass(true);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          // width: { sm: `calc(100% - ${drawerWidth}px)` },
          // ml: { sm: `${drawerWidth}px` },
          width: { sm: mobileOpen ? `calc(100% - ${drawerWidth}px)` : "100%" },
          ml: { sm: mobileOpen ? `${drawerWidth}px` : 0 },
          bgcolor: bgMain,
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ height: 67 }}>
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            // sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon
              style={{ fontSize: "30px", color: "rgb(99, 115, 129)" }}
            />
          </IconButton>
          <div className="mr-auto"></div>
          {/* <div className="ml-4">
            <IconButton
              aria-label={notificationsLabel(1)}
              onClick={(e) => setNotifState(e.currentTarget)}
            >
              <Badge badgeContent={1} color="error">
                <NotificationsNoneOutlinedIcon
                  style={{ fontSize: "30px", color: "rgb(99, 115, 129)" }}
                />
              </Badge>
            </IconButton>
            <Popover
              id={notifPopover}
              open={openNotifPopover}
              anchorEl={notifState}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              onClose={() => setNotifState(null)}
            >
              <div className="p-12">The content of the Popover.</div>
            </Popover>
          </div> */}
          <div className="ml-4 flex items-center">
            <IconButton
              onClick={(e) => setAvatarState(e.currentTarget)}
              style={{ borderRadius: "16px", padding: "8px 14px" }}
            >
              <Avatar
                src={`${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/sdm-service/${basicData?.user.employee.photo}`}
                sx={{ width: 30, height: 30 }}
                aria-describedby={avatarPopover}
              />
              <div className="font-16 ml-8 font-w-600">
                {basicData?.user.employee.name}
              </div>
            </IconButton>
            <Popover
              id={avatarPopover}
              open={openAvatarPopover}
              anchorEl={avatarState}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              onClose={() => setAvatarState(null)}
            >
              <div className="py-16" style={{ minWidth: "216px" }}>
                <div
                  className="px-12 pointer"
                  onClick={() => setDialogProfile(true)}
                >
                  <p className="p-0 m-0 font-16 font-w-600">
                    {basicData?.user.employee.name}
                  </p>
                  <p className="p-0 m-0 font-14">{basicData?.user.email}</p>
                </div>
                <div className="my-12">
                  <Divider />
                </div>
                <div className="px-12 text-grey-text">
                  <p
                    className="p-0 m-0 font-14 font-w-600 pointer"
                    onClick={changePassHandler}
                  >
                    Edit password
                  </p>
                </div>
              </div>
            </Popover>
          </div>
          <div className="ml-4">
            <Tooltip title="Logout" arrow>
              <IconButton onClick={logoutHandler}>
                <LogoutIcon
                  style={{ fontSize: "30px", color: "rgb(99, 115, 129)" }}
                />
              </IconButton>
            </Tooltip>
          </div>
        </Toolbar>
        <Divider />
      </AppBar>
      <DialogChangePass
        state={dialogChangePass}
        setState={setDialogChangePass}
      />
      <DialogProfile state={dialogProfile} setState={setDialogProfile} />
    </>
  );
};

export default Top;
