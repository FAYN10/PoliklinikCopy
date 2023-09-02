import React, { useState } from 'react';
import FormAssessmentPasien from './formAssessmentPasien';
import FormAssessmentPetugas from './formAssessmentPetugas';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const Assessment = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [selectedNamaPemeriksaan, setSelectedNamaPemeriksaan] = useState(null);
  const [selectedJenisPemeriksaan, setSelectedJenisPemeriksaan] = useState(null);

  const handleFormClick = (formType, permintaanData) => {
    setActiveForm(formType);

    if (formType === 'pasien') {
    } else if (formType === 'petugas') {
    }
  };

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <List>
          <ListItem
            button
            onClick={() => handleFormClick('pasien')}
            selected={activeForm === 'pasien'}
          >
            <ListItemText primary="Form Assessment Pasien" />
          </ListItem>
          <ListItem
            button
            onClick={() => handleFormClick('petugas')}
            selected={activeForm === 'petugas'}
          >
            <ListItemText primary="Form Assessment Pemeriksaan" />
          </ListItem>
        </List>
        <div style={{ borderLeft: '1px solid #ccc', marginLeft: '20px', paddingLeft: '20px' }}>
          {activeForm === 'pasien' && (
            <>
              <FormAssessmentPasien />
            </>
          )}
          {activeForm === 'petugas' && (
            <>
              <p>Nama Pemeriksaan: {selectedNamaPemeriksaan}</p>
              <p>Jenis Pemeriksaan: {selectedJenisPemeriksaan}</p>
              <FormAssessmentPetugas />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assessment;
