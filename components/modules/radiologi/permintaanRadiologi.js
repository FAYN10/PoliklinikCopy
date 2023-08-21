import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const PermintaanRadiologi = () => {


  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>No. Pemeriksaan</TableCell>
            <TableCell>Waktu Permintaan</TableCell>
            <TableCell>Nama Pemeriksaan</TableCell>
            <TableCell>Jenis Pemeriksaan</TableCell>
            <TableCell>Dokter Pengirim</TableCell>
            <TableCell>Unit Pengirim</TableCell>
            <TableCell>Diagnosis Kerja</TableCell>
            <TableCell>Catatan Permintaan</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dummyPermintaanData.map((data) => (
            <TableRow key={data.noPemeriksaan}>
              <TableCell>{data.noPemeriksaan}</TableCell>
              <TableCell>{data.waktuPermintaan}</TableCell>
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
  );
};

export default PermintaanRadiologi;
