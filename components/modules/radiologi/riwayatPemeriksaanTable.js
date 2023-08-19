import React from "react";
import { useRouter } from "next/router";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";


const RiwayatPemeriksaanTable = () => {
  const router = useRouter();
  const { selectedData } = router.query;

  const dataPermintaanRadiologi = [
    {
      waktuPemeriksaan: "2023-08-15 10:30",
      noPemeriksaan: "1",
      namaPemeriksaan: "XRay",
      jenisPemeriksaan: "BNO",
      dokterPengirim: "Dr. John Doe",
      diagnosisKerja: "Patah tulang",
    },
    {
        waktuPemeriksaan: "2023-08-15 10:30",
        noPemeriksaan: "2",
        namaPemeriksaan: "USG",
        jenisPemeriksaan: "USG_ABDOMEN",
        dokterPengirim: "Dr. John Doe",
        diagnosisKerja: "Patah tulang",
    },
  ];

  return (
    <div>
      <TableContainer component={Paper}>
       
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: (theme) => theme.palette.success.main, color: (theme) => theme.palette.common.white }}>
                Tanggal Pemeriksaan
              </TableCell>
              <TableCell sx={{ backgroundColor: (theme) => theme.palette.success.main, color: (theme) => theme.palette.common.white }}>
                No. Pemeriksaan
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
                Diagnosis Kerja
              </TableCell>
             
            </TableRow>
          </TableHead>
          <TableBody>
            {dataPermintaanRadiologi.map((data, index) => (
              <TableRow key={index}>
                
                <TableCell>{data.waktuPemeriksaan}</TableCell>
                <TableCell>{data.noPemeriksaan}</TableCell>
                <TableCell>{data.namaPemeriksaan}</TableCell>
                <TableCell>{data.jenisPemeriksaan}</TableCell>
                <TableCell>{data.dokterPengirim}</TableCell>
                
                <TableCell>{data.diagnosisKerja}</TableCell>
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
    </div>

  );
};

export default RiwayatPemeriksaanTable;
