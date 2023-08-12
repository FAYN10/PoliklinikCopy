import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Collapse from "@mui/material/Collapse";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import SideList from "./SideList";
import useClientPermission from "custom-hooks/useClientPermission";
import { useMediaQuery, useTheme } from "@mui/material";

const drawerWidth = 279;
const bgMain = "#f9fafb";
const Side = ({ window, mobileOpen, handleDrawerToggle }) => {
  const router = useRouter();
  const { clientPermission } = useClientPermission();
  const [sideBarListMenu, setSideBarListMenu] = useState(SideList);

  const activeStateHandler = (type, payload) => {
    let result;
    let comparator;
    if (payload.children.length === 0) {
      comparator = payload.routePath;
    } else {
      let isFound = payload.children.find((e) =>
        router.pathname.includes(e.routePath)
      );
      isFound ? (comparator = isFound.routePath) : (comparator = "404");
    }
    if (router.pathname.includes(comparator)) {
      if (type === "bg") result = "bg-green-soft";
      if (type === "ti") result = "color-green-primary";
    } else {
      if (type === "bg") result = "";
      if (type === "ti") result = "color-grey-text";
    }
    return result;
  };

  const activeStateChildrenHandler = (payload) => {
    if (router.pathname.includes(payload)) {
      return "color-green-primary";
    } else {
      return "color-grey-text";
    }
  };
  // useEffect(() => {
  //   console.log("permsision arr", clientPermission);
  //   console.log(sideBarListMenu);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [clientPermission]);

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  const drawer = (
    <div>
      <div className="flex items-center py-2 px-16">
        <Image src="/icons/logo.png" width={40} height={40} alt="rsmp" />
        <p className="ml-10 font-18 font-w-600 text-green-primary">
          RSU Mitra Paramedika
        </p>
      </div>
      <Divider />
      <List>
        {sideBarListMenu.map((item, index) => {
          if (clientPermission.some((p) => item.permission.includes(p))) {
            return (
              <div key={item.name} className="px-6">
                <ListItemButton
                  className={activeStateHandler("bg", item)}
                  sx={{ paddingY: 1.5, borderRadius: 2 }}
                  onClick={
                    item.children.length !== 0
                      ? () => {
                          let temp = [...sideBarListMenu];
                          temp[index].childrenState =
                            !temp[index].childrenState;
                          setSideBarListMenu([...temp]);
                        }
                      : () => router.push(`${item.routePath}`)
                  }
                >
                  <ListItemIcon
                    sx={{ minWidth: 0 }}
                    className={`mr-16 ${activeStateHandler("ti", item)}`}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <div
                    className={`font-14 font-w-600 mr-auto ${activeStateHandler(
                      "ti",
                      item
                    )}`}
                  >
                    {item.name}
                  </div>
                  {item.children.length === 0 ? null : item.childrenState ? (
                    <ExpandLessIcon
                      className={activeStateHandler("ti", item)}
                    />
                  ) : (
                    <ExpandMoreIcon
                      className={activeStateHandler("ti", item)}
                    />
                  )}
                </ListItemButton>
                {item.children.length !== 0 ? (
                  <Collapse
                    in={item.childrenState}
                    timeout="auto"
                    unmountOnExit
                  >
                    {item.children.map((itemChildren) => {
                      if (
                        clientPermission.some((p) =>
                          itemChildren.permission.includes(p)
                        )
                      ) {
                        return (
                          <List
                            key={itemChildren.name}
                            component="div"
                            disablePadding
                          >
                            <ListItemButton
                              onClick={
                                itemChildren.routePath
                                  ? () =>
                                      router.push(`${itemChildren.routePath}`)
                                  : null
                              }
                            >
                              <ListItemIcon
                                sx={{ minWidth: 0 }}
                                className={`ml-2 mr-14 ${activeStateChildrenHandler(
                                  itemChildren.routePath
                                )}`}
                              >
                                <ArrowRightIcon />
                              </ListItemIcon>
                              <div
                                className={`font-14 font-w-600 mr-auto ${activeStateChildrenHandler(
                                  itemChildren.routePath
                                )}`}
                              >
                                {itemChildren.name}
                              </div>
                            </ListItemButton>
                          </List>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </Collapse>
                ) : null}
              </div>
            );
          } else {
            return null;
          }
        })}
      </List>
    </div>
  );
  const container =
    window !== undefined ? () => window.document.body : undefined;

  return (
    <Box
      component="nav"
      sx={{
        width:
          // { sm: drawerWidth },
          { sm: mobileOpen ? drawerWidth : 0 },
        flexShrink: { sm: 0 },
      }}
      aria-label="mailbox folders"
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen && matches}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            bgcolor: bgMain,
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          // display: { xs: "none", sm: "block" },
          display: { xs: "none", sm: mobileOpen ? "block" : "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            bgcolor: bgMain,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Side;
