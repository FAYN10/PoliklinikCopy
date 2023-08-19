import React from "react";
import { useRouter } from "next/router";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import FormPersiapanPemeriskaan from "./formPersiapanPemeriksaan";
import FormAssessmentPetugas from "./formAssessmentPetugas";


const PermintaanRadiologi = () => {
  const router = useRouter();
  const { selectedData } = router.query;

  const dataPermintaanRadiologi = [
    {
      noPemeriksaan: "1",
      namaPemeriksaan: "XRay",
      jenisPemeriksaan: "BNO",
      waktuPemeriksaan: "2023-08-15 10:30",
      dokterPengirim: "Dr. John Doe",
      unitPengirim: "UGD",
      diagnosisKerja: "Patah tulang",
      catatanPermintaan: "Harap segera diprioritaskan",
    },
    {
      noPemeriksaan: "2",
      namaPemeriksaan: "USG",
      jenisPemeriksaan: "USG_ABDOMEN",
      waktuPemeriksaan: "2023-08-15 10:30",
      dokterPengirim: "Dr. Jhonny",
      unitPengirim: "UGD",
      diagnosisKerja: "Patah tulang",
      catatanPermintaan: "Harap segera diprioritaskan",
    },

  ];

  const handleRowClick = (data) => {
    router.push(`/components/modules/radiologi/formAssessmentPetugas?jenisPemeriksaan=${data.jenisPemeriksaan}`);
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: (theme) => theme.palette.success.main, color: (theme) => theme.palette.common.white }}>
                No. Pemeriksaan
              </TableCell>
              <TableCell sx={{ backgroundColor: (theme) => theme.palette.success.main, color: (theme) => theme.palette.common.white }}>
                Waktu Pemeriksaan
              </TableCell>
              <TableCell sx={{ backgroundColor: (theme) => theme.palette.success.main, color: (theme) => theme.palette.common.white }}>
                Nama Pemeriksaan
              </TableCell>
              <TableCell sx={{ backgroundColor: (theme) => theme.palette.success.main, color: (theme) => theme.palette.common.white }}>
                Jenis Pemeriksaan
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
                <TableCell>{data.noPemeriksaan}</TableCell>
                <TableCell>{data.waktuPemeriksaan}</TableCell>
                <TableCell>{data.namaPemeriksaan}</TableCell>
                <TableCell>{data.jenisPemeriksaan}</TableCell>
                <TableCell>{data.dokterPengirim}</TableCell>
                <TableCell>{data.unitPengirim}</TableCell>
                <TableCell>{data.diagnosisKerja}</TableCell>
                <TableCell>{data.catatanPermintaan}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
    </div>

  );
};

export default PermintaanRadiologi;
