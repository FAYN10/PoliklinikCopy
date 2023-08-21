import React from 'react';
import { generateExaminationOptions } from 'api/radiologi.js'; // Import the function from your radiologi.js file
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const FormAssessmentPetugas = ({ selectedNamaPemeriksaan, selectedJenisPemeriksaan }) => {
  const examinationOptions = generateExaminationOptions();
  const selectedOption = examinationOptions.find(
    (option) => option.label === `${selectedNamaPemeriksaan} - ${selectedJenisPemeriksaan}`
  );

  if (!selectedOption) {
    return <p>No preparation steps found for the selected examination.</p>;
  }

  const selectedPemeriksaan = selectedOption.value;

  return (
    <div>
      <h2>Persiapan Pemeriksaan</h2>
      <ul>
        {selectedPemeriksaan.persiapanPemeriksaan.map((step, index) => (
          <li key={index}>
            <FormControlLabel
              control={<Checkbox />}
              label={step}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormAssessmentPetugas;
