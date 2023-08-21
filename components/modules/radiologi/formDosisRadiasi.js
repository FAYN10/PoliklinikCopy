import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';

const FormDosisRadiasi = () => {
  const [kv, setKv] = useState('');
  const [ma, setMa] = useState('');
  const [s, setS] = useState('');
  const [ffd, setFfd] = useState('');

  const handleKVChange = (event) => {
    setKv(event.target.value);
  };

  const handleMAChange = (event) => {
    setMa(event.target.value);
  };

  const handleSChange = (event) => {
    setS(event.target.value);
  };

  const handleFFDChange = (event) => {
    setFfd(event.target.value);
  };

  return (
    <Card>
      <CardContent>
        <h2>Form Dosis Radiasi</h2>
        <div>
          <TextField
            label="KV"
            variant="outlined"
            fullWidth
            value={kv}
            onChange={handleKVChange}
            margin="normal"
          />
        </div>
        <div>
          <TextField
            label="MA"
            variant="outlined"
            fullWidth
            value={ma}
            onChange={handleMAChange}
            margin="normal"
          />
        </div>
        <div>
          <TextField
            label="S"
            variant="outlined"
            fullWidth
            value={s}
            onChange={handleSChange}
            margin="normal"
          />
        </div>
        <div>
          <TextField
            label="FFD"
            variant="outlined"
            fullWidth
            value={ffd}
            onChange={handleFFDChange}
            margin="normal"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FormDosisRadiasi;
