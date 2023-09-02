import React from "react";
import TextField from "@mui/material/TextField";

const FormDosisRadiasi = ({ nama_pemeriksaan }) => {
  // Check if the nama_pemeriksaan is "XRay"
  const isXRay = nama_pemeriksaan === "X-Ray";

  return (
    <div>
      {isXRay && (
        <div>
          <TextField
            fullWidth
            id="KV"
            name="KV"
            label="KV"
            variant="outlined"
            // Add other relevant props and handlers as needed
          />
          <TextField
            fullWidth
            id="MA"
            name="MA"
            label="MA"
            variant="outlined"
            // Add other relevant props and handlers as needed
          />
          <TextField
            fullWidth
            id="S"
            name="S"
            label="S"
            variant="outlined"
            // Add other relevant props and handlers as needed
          />
          <TextField
            fullWidth
            id="FFD"
            name="FFD"
            label="FFD"
            variant="outlined"
            // Add other relevant props and handlers as needed
          />
        </div>
      )}
    </div>
  );
};

export default FormDosisRadiasi;
