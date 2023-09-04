import React, {useState} from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
} from '@mui/material';
import SelectAsync from 'components/SelectAsync';
import {getItem} from 'api/gudang/item';
import {getSediaan} from 'api/gudang/sediaan';

const DialogAddItem = ({open, onClose, onAdd}) => {
  const [formData, setFormData] = useState({
    kode_item: '',
    nama_item: '',
    jumlah: '',
    sediaan: '',
  });

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData((prevData) => ({...prevData, [name]: value}));
  };

  const handleAddClick = () => {
    onAdd(formData);
    setFormData({kode_item: '', nama_item: '', jumlah: '', sediaan: ''});
  };

  const [SediaanRef, setSediaanRef] = useState({
    values: {
      id: '',
      sediaan: '',
    },
    touched: false,
    errors: false,
  });
  
  const handleOnChangeSediaan = (value) => {
    if (value) {
      setSediaanRef((e) => ({
        ...e,
        values: {
          ...value,
        },
      }));
    } else {
      setSediaanRef((e) => ({
        ...e,
        values: {
          id: "",
          sediaan: "",
        },
      }));
    }
  };



  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Tambah Item</DialogTitle>
      <DialogContent>
        <DialogContentText>Mohon isi detail item di bawah!</DialogContentText>
        <TextField
          label='Kode Item'
          name='kode_item'
          value={formData.kode_item}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label='Nama Item'
          name='nama_item'
          value={formData.nama_item}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label='Jumlah'
          name='jumlah'
          value={formData.jumlah}
          onChange={handleInputChange}
          fullWidth
        />
        <SelectAsync
          id="sediaan"
          labelField="Sediaan"
          labelOptionRef="sediaan"
          valueOptionRef="id"
          handlerRef={SediaanRef}
          handlerFetchData={getSediaan}
          handlerOnChange={(value) => handleOnChangeSediaan(value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='error'>
          Batal
        </Button>
        <Button onClick={handleAddClick} color='primary'>
          Tambah
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogAddItem;
