import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";


const PermintaanRadiologi = () => {
  // Data dummy untuk tabel permintaan radiologi
  const dataPermintaanRadiologi = [
    {
      jenisPemeriksaan: "MRI Scan",
      waktuPemeriksaan: "2023-08-15 10:30",
      dokterPengirim: "Dr. John Doe",
      unitPengirim: "Radiologi",
      diagnosisKerja: "Patah tulang",
      catatanPermintaan: "Harap segera diprioritaskan",
    },
    {
      jenisPemeriksaan: "Rontgen",
      waktuPemeriksaan: "2023-08-16 15:45",
      dokterPengirim: "Dr. Jane Smith",
      unitPengirim: "Radiologi",
      diagnosisKerja: "Kerusakan sendi",
      catatanPermintaan: "Mohon segera hasilnya",
    },
    // Tambahkan data dummy lainnya jika diperlukan
  ];

  return (
    
    <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell sx={{ backgroundColor: (theme) => theme.palette.success.main, color: (theme) => theme.palette.common.white }}>
            Jenis Pemeriksaan
          </TableCell>
          <TableCell sx={{ backgroundColor: (theme) => theme.palette.success.main, color: (theme) => theme.palette.common.white }}>
            Waktu Pemeriksaan
          </TableCell>
          <TableCell sx={{ backgroundColor: (theme) => theme.palette.success.main, color: (theme) => theme.palette.common.white }}>
            Dokter Pengirim
          </TableCell>
          <TableCell sx={{ backgroundColor: (theme) => theme.palette.success.main, color: (theme) => theme.palette.common.white }}>
            Unit Pengirim
          </TableCell>
          <TableCell sx={{ backgroundColor: (theme) => theme.palette.success.main, color: (theme) => theme.palette.common.white }}>
            Diagnosis Kerja
          </TableCell>
          <TableCell sx={{ backgroundColor: (theme) => theme.palette.success.main, color: (theme) => theme.palette.common.white }}>
            Catatan Permintaan
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {dataPermintaanRadiologi.map((data, index) => (
          <TableRow key={index}>
            <TableCell>{data.jenisPemeriksaan}</TableCell>
            <TableCell>{data.waktuPemeriksaan}</TableCell>
            <TableCell>{data.dokterPengirim}</TableCell>
            <TableCell>{data.unitPengirim}</TableCell>
            <TableCell>{data.diagnosisKerja}</TableCell>
            <TableCell>{data.catatanPermintaan}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
  );
};

export default PermintaanRadiologi;
