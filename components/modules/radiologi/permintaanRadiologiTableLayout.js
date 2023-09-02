import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";

const PermintaanRadiologiTableLayout = ({ tableHead, data }) => {
  // Mengecek apakah data adalah array dan tidak kosong
  const isDataValid = Array.isArray(data) && data.length > 0;

  // State untuk data yang telah disortir
  const [sortedData, setSortedData] = useState([]);

  // Efek ini akan berjalan saat data berubah
  useEffect(() => {
    if (isDataValid) {
      // Menyortir data berdasarkan "nomor_pemeriksaan"
      const sorted = [...data].sort((a, b) => {
        const nomorA = String(a.nomor_pemeriksaan || ""); // Mengonversi ke string, jika bukan string
        const nomorB = String(b.nomor_pemeriksaan || ""); // Mengonversi ke string, jika bukan string
        return nomorA.localeCompare(nomorB);
      });

      setSortedData(sorted);
    } else {
      setSortedData([]); // Jika data tidak valid, set sortedData menjadi array kosong
    }
  }, [data]); // Bergantung pada perubahan data

  return (
    <Box p={2}>
      {" "}
      {/* Menambahkan jarak menggunakan Box */}
      <TableContainer component={Paper}>
        {/* Mengecek apakah data valid */}
        {isDataValid ? (
          <Table>
            <TableHead>
              <TableRow>
                {tableHead.map((column) => (
                  <TableCell key={column.id}>{column.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.map((item) => (
                <TableRow key={item.id}>
                  {tableHead.map((column) => (
                    <TableCell key={column.id}>{item[column.id]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Box p={2}>
            {" "}
            {/* Menambahkan jarak pada pesan jika data tidak tersedia */}
            <Typography variant="subtitle1">
              Tidak ada data yang tersedia.
            </Typography>
          </Box>
        )}
      </TableContainer>
    </Box>
  );
};

export default PermintaanRadiologiTableLayout;
