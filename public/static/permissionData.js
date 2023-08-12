const permission = [
  { key: "pasien", label: "pasien" },
  { key: "rawatinap", label: "pasien rawat inap" },
  { key: "rawatjalan", label: "pasien rawat jalan" },
  { key: "role", label: "role" },
  { key: "employee", label: "karyawan" },
  { key: "doctor", label: "dokter" },
  { key: "suster", label: "suster" },
  { key: "user", label: "pengguna" },
  { key: "agama", label: "agama" },
  { key: "bahasa", label: "bahasa" },
  { key: "pendidikan", label: "pendidikan" },
  { key: "pekerjaan", label: "pekerjaan" },
  { key: "suku", label: "suku" },
];

const generateDataPermission = () => {
  const data = permission.map((e) => {
    return {
      key: e.key,
      label: e.label,
      data: [
        {
          label: `Dapat melihat daftar ${e.label}`,
          permission: `${e.key}:all`,
        },
        {
          label: `Dapat melihat detail ${e.label}`,
          permission: `${e.key}:show`,
        },
        {
          label: `Dapat menambahkan ${e.label}`,
          permission: `${e.key}:store`,
        },
        {
          label: `Dapat mengupdate ${e.label}`,
          permission: `${e.key}:update`,
        },
        {
          label: `Dapat menghapus ${e.label}`,
          permission: `${e.key}:destroy`,
        },
      ],
    };
  });
  return data;
};

const dataPermission = generateDataPermission();

export default dataPermission;
