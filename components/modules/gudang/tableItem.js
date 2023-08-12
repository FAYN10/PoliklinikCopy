import React, {useState} from 'react';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {Add as AddIcon, Delete as DeleteIcon} from '@mui/icons-material';
import DialogAddItem from './dialogAddItem';

const TableItem = () => {
  const [rows, setRows] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const addRow = (newData) => {
    const newRow = {id: rows.length + 1, ...newData};
    setRows([...rows, newRow]);
    closeDialog();
  };

  const deleteRow = (id) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
  };

  return (
    <div>
      <TableContainer component={Paper}>
      <Button
          variant='contained'
          color='primary'
          startIcon={<AddIcon />}
          onClick={openDialog}
          sx={{ float: 'right', marginTop: 1, marginRight: 1 }}
        >
          Tambah item
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Kode Item</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Nama Item</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Jumlah</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Sediaan</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.kode_item}</TableCell>
                <TableCell>{row.nama_item}</TableCell>
                <TableCell>{row.jumlah}</TableCell>
                <TableCell>{row.sediaan}</TableCell>
                <TableCell>
                  <Button
                    variant='text'
                    color='error'
                    startIcon={<DeleteIcon />}
                    onClick={() => deleteRow(row.id)}
                  >
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
      </TableContainer>

      <DialogAddItem open={isDialogOpen} onClose={closeDialog} onAdd={addRow} />
    </div>
  );
};

export default TableItem;
