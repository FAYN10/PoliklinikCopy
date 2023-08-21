import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import PermintaanPemeriksaan from "./PermintaanPemeriksaan";
import FormAssessmentPasien from "./formAssessmentPasien";
import FormAssessmentPetugas from "./formAssessmentPetugas";
import FormExpertise from "formExpertise";

const DetailRiwayat = () => {
  const router = useRouter();
  const { data } = router.query; // Assuming the data is passed as a JSON string
  
  const parsedData = JSON.parse(data);

  return (
    <div>
      <h1>Detail Riwayat Pemeriksaan</h1>

      <h2>Detail Permintaan Pemeriksaan</h2>
      <PermintaanPemeriksaan data={parsedData} />

      <h2>Form Assessment Pasien</h2>
      <FormAssessmentPasien data={parsedData} />

      <h2>Form Assessment Petugas</h2>
      <FormAssessmentPetugas data={parsedData} />

      <h2>Form Expertise</h2>
      <FormExpertise data={parsedData} />
    </div>
  );
};

export default DetailRiwayat;
