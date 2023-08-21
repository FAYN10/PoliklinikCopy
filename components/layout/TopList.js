const TopList = [
  {
    name: "Pasien",
    routePath: "/pasien",
    list: [
      { label: "Pasien", value: 1 },
      { label: "Rawat jalan", value: 2 },
      { label: "Rawat inap", value: 3 },
    ],
  },
  {
    name: "Radiologi",
    routePath: "pages/radiologi/[...slug].js",
    list: [
      { label: "Permintaan Radiologi", value: 1 },
      { label: "Assessment Radiologi", value: 2 },
      { label: "Hasil Pemeriksaan", value: 3 },
      { label: "Riwayat Pemeriksaan", value: 4 },
    ],
  },
];

export default TopList;
