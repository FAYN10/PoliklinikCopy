import React from "react";
import { useRouter } from "next/router";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import Link from "next/link";

const RiwayatPemeriksaanTable = () => {
  const router = useRouter();
  const { selectedData } = router.query;

  const dataPermintaanRadiologi = [
    {
    },

  ];

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tanggal Pemeriksaan</TableCell>
              <TableCell>No. Pemeriksaan</TableCell>
              <TableCell>Nama Pemeriksaan</TableCell>
              <TableCell>Jenis Pemeriksaan</TableCell>
              <TableCell>Dokter Pengirim</TableCell>
              <TableCell>Diagnosis Kerja</TableCell>
              <TableCell>Detail</TableCell> 
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
                <TableCell>

                  <Link
                    href={{
                      pathname: "components/modules/radiologi/detailRiwayat.js",
                      query: { data: JSON.stringify(data) },
                    }}
                    passHref
                  >
                    <Button variant="contained" color="primary">
                      Detail
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RiwayatPemeriksaanTable;
