import React from "react";
import FormPersiapanPemeriksaan from "./formPersiapanPemeriksaan"; // Sesuaikan dengan lokasi komponen Anda
import FormDosisRadiasi from "./formDosisRadiasi"; // Sesuaikan dengan lokasi komponen Anda

const FormAssessmentPetugas = ({ nama_pemeriksaan }) => {
  return (
    <div>
      {/* Komponen FormAssessmentPemeriksaan dengan prop nama_pemeriksaan */}
      <FormPersiapanPemeriksaan nama_pemeriksaan={nama_pemeriksaan} />
      
      {/* Komponen FormDosisRadiasi dengan prop nama_pemeriksaan */}
      <FormDosisRadiasi nama_pemeriksaan={nama_pemeriksaan} />
    </div>
  );
};

export default FormAssessmentPetugas;
