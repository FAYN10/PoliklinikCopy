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
  const dummyPermintaanData = [
    {
      noPemeriksaan: 1,
      waktuPermintaan: "2023-08-20 09:00:00",
      namaPemeriksaan: "X-Ray",
      jenisPemeriksaan: "APPENDICOGRAM",
      dokterPengirim: "Dr. John Doe",
      unitPengirim: "Poli Umum",
      diagnosisKerja: "Appendicitis",
      catatanPermintaan: "Harap segera dilakukan pemeriksaan.",
    },
    {
      noPemeriksaan: 2,
      waktuPermintaan: "2023-08-21 14:30:00",
      namaPemeriksaan: "X-Ray",
      jenisPemeriksaan: "HSG",
      dokterPengirim: "Dr. Jane Smith",
      unitPengirim: "Poli Kandungan",
      diagnosisKerja: "Infertility",
      catatanPermintaan: "Pasien sedang menjalani program hamil.",
    },

  ];

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
