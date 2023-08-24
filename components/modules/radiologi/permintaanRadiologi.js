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
const permintaanTableHead = [
  {
    id:"no_pemeriksaan",
    label: "No. Pemeriksaan"
  },
  {
    id:"waktu_permintaan",
    label: "Waktu Permintaan"
  },
  {
    id:"nama_pemeriksaan",
    label: "Nama Pemeriksaan"
  },
  {
    id:"jenis_pemeriksaan",
    label:"Jenis Pemeriksaan"
  },
  {
    id:"dokter_pengirim",
    label:"Dokter Pengirim"
  },
  {
    id:"unit_pengirim",
    label:"Unit Pengirim"
  },
  {
    id:"diagnosis_kerja",
    label:"Diagnosis Kerja",
  },
  {
    id:"catatan_permintaan",
    label:"Catatan Permintaan"
  }
]
const PermintaanRadiologi = ({data}) => {

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
          {data.map((data) => (
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
