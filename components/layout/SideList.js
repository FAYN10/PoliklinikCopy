import Dashboard from "@material-ui/icons/DashboardOutlined";
import People from "@material-ui/icons/PeopleAltOutlined";
import Hospital from "@material-ui/icons/LocalHospitalOutlined";
import UserAuth from "@mui/icons-material/AdminPanelSettingsOutlined";
import SettingsIcon from "@mui/icons-material/Settings";

let SideList = [
  {
    name: "Dashboard",
    icon: <Dashboard />,
    permission: [],
    children: [],
    childrenState: false,
    routePath: "/dashboard",
  },
  {
    name: "SDM",
    icon: <People />,
    permission: ["doctor:all", "suster:all", "employee:all"],
    children: [
      { name: "Dokter", permission: ["doctor:all"], routePath: "/doctor" },
      { name: "Perawat", permission: ["suster:all"], routePath: "/suster" },
      {
        name: "Karyawan",
        permission: ["employee:all"],
        routePath: "/employee",
      },
    ],
    childrenState: false,
    routePath: null,
  },
  {
    name: "RS",
    icon: <Hospital />,
    permission: ["pasien:all", "rawatjalan:all", "rawatinap:all"],
    children: [
      {
        name: "Pasien",
        permission: ["pasien:all", "rawatjalan:all", "rawatinap:all"],
        routePath: "/pasien",
      },
      {
        name: "Radiologi",
        permission: ["radiologi:all"],
        routePath: "/radiologi",
      },
    ],
    childrenState: false,

    routePath: null,
  },
  {
    name: "Auth",
    icon: <UserAuth />,
    permission: ["role:all", "user:all"],
    children: [
      { name: "Role", permission: ["role:all"], routePath: "/role" },
      { name: "Pengguna", permission: ["user:all"], routePath: "/user" },
    ],
    childrenState: false,
    routePath: null,
  },
  {
    name: "Umum",
    icon: <SettingsIcon />,
    permission: [
      "agama:all",
      "bahasa:all",
      "pendidikan:all",
      "pekerjaan:all",
      "suku:all",
    ],
    children: [
      { name: "Agama", permission: ["agama:all"], routePath: "/agama" },
      { name: "Bahasa", permission: ["bahasa:all"], routePath: "/bahasa" },
      {
        name: "Pendidikan",
        permission: ["pendidikan:all"],
        routePath: "/pendidikan",
      },
      {
        name: "Pekerjaan",
        permission: ["pekerjaan:all"],
        routePath: "/pekerjaan",
      },
      { name: "Suku", permission: ["suku:all"], routePath: "/suku" },
    ],
    childrenState: false,
    routePath: null,
  },
];

// inject role admin for all feature
SideList = SideList.map((e) => {
  e.permission.push("admin");
  e.children.forEach((c) => {
    c.permission.push("admin");
  });
  return e;
});

export default SideList;
