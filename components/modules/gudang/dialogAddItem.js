import React, {useState} from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  Grid,
  Typography,
  Snackbar,
  Divider,
} from '@mui/material';
import * as Yup from 'yup';
import { parse } from "date-fns";
import {stringSchema} from 'utils/yupSchema';
import {useFormik} from 'formik';
import SelectAsync from 'components/SelectAsync';
import {getListItem} from 'api/gudang/item';
import {getSediaan} from 'api/gudang/sediaan';
import {FocusError} from 'focus-formik-error';
import {LoadingButton} from '@mui/lab';
import useClientPermission from 'custom-hooks/useClientPermission';

const DialogAddItem = ({
  state,
  setState,
  isEditType = false,
  isPembelian = false,
  prePopulatedDataForm = {},
  detailPrePopulatedData = {},
  updatePrePopulatedData = () => 'update data',
  createData = () => {},
}) => {
  // const router = useRouter();
  const {isActionPermitted} = useClientPermission();
  const [snackbar, setSnackbar] = useState({
    state: false,
    type: null,
    message: '',
  });
  const [isEditingMode, setIsEditingMode] = useState(false);

  const handleIsEditingMode = (e) => {
    setIsEditingMode(e.target.checked);
  };

  const tableItemInitialValues = !isEditType
    ? {
        item: {id: '', kode: '', name: ''},
        jumlah: null,
        sediaan: {id: '', name: ''},
        // nomor_batch: null,
        // harga_beli_satuan: null,
        // harga_jual_satuan: null,
        // diskon: null,
        // margin: null,
        // total_pembelian: null,
        // tanggal_ed: null,
      }
    : prePopulatedDataForm;

  const createTableItemSchema = Yup.object({
    item: Yup.object({
      id: stringSchema('Kode Item', true),
    }),
    jumlah: Yup.string()
      .matches(/^[0-9]+$/, 'Wajib angka')
      .required('Jumlah wajib diisi'),
    sediaan: Yup.object({
      id: stringSchema('Sediaan', true),
    }),
    // nomor_batch: Yup.string()
    //   .matches(/^[0-9]+$/, 'Wajib angka')
    //   .required('Nomor batch wajib diisi'),
    // harga_beli_satuan: Yup.string()
    //   .matches(/^[0-9]+$/, 'Wajib angka')
    //   .required('Harga beli wajib diisi'),
    // harga_jual_satuan: Yup.string()
    //   .matches(/^[0-9]+$/, 'Wajib angka')
    //   .required('Harga Jual wajib diisi'),
    // diskon: Yup.string()
    //   .matches(/^[0-9]+$/, 'Wajib angka')
    //   .required('Diskon wajib diisi'),
    // margin: Yup.string()
    //   .matches(/^[0-9]+$/, 'Wajib angka')
    //   .required('Margin wajib diisi'),
    // total_pembelian: Yup.string()
    //   .matches(/^[0-9]+$/, 'Wajib angka')
    //   .required('Total pembelian wajib diisi'),
    // tanggal_ed: Yup.date()
    //   .transform(function (value, originalValue) {
    //     if (this.isType(value)) {
    //       return value;
    //     }
    //     const result = parse(originalValue, 'dd/MM/yyyy', new Date());
    //     return result;
    //   })
    //   .typeError('Expired date tidak valid')
    //   .min('2023-01-01', 'Expired date tidak valid')
    //   .required('Expired date wajib diisi'),
  });

  const createTableItemValidation = useFormik({
    initialValues: tableItemInitialValues,
    validationSchema: createTableItemSchema,
    enableReinitialize: true,
    onSubmit: async (values, {resetForm, setFieldError}) => {
      let messageContext = isEditType ? 'diperbarui' : 'ditambahkan';
      let data = {...values};
      try {
        createData(data);
        resetForm();
        setState(false);
      } catch (error) {
        if (Object.keys(error.errorValidationObj).length >= 1) {
          for (let key in error.errorValidationObj) {
            setFieldError(key, error.errorValidationObj[key][0]);
          }
        }
        setSnackbar({
          state: true,
          type: 'error',
          message: `Terjadi kesalahan, "${data.nama_item}" gagal ${messageContext}!`,
        });
      }
    },
  });

  return (
    <>
      <Dialog open={state} onClose={() => setState(false)}>
        <DialogTitle sx={{paddingLeft: 2, paddingBottom: 1}}>
          Tambah Item
        </DialogTitle>
        <Divider sx={{borderWidth: '1px'}} />
        <DialogContent sx={{paddingBottom: 2}}>
          <form onSubmit={createTableItemValidation.handleSubmit}>
            <FocusError formik={createTableItemValidation} />
            <div className='mt-40'>
              <Grid container spacing={1}>
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <Typography variant='h1 font-w-600'>Nama Item</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <div className='mb-16'>
                      <SelectAsync
                        id='item'
                        labelField='Nama Item'
                        labelOptionRef='name'
                        valueOptionRef='id'
                        handlerRef={createTableItemValidation}
                        handlerFetchData={getListItem}
                        handlerOnChange={(value) => {
                          if (value) {
                            createTableItemValidation.setFieldValue(
                              'item',
                              value
                            );
                          } else {
                            createTableItemValidation.setFieldValue('item', {
                              id: '',
                              name: '',
                            });
                          }
                        }}
                        isDisabled={isEditType && !isEditingMode}
                      />
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <Typography variant='h1 font-w-600'>Kode Item</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <div className='mb-16'>
                      <TextField
                        fullWidth
                        id='kode_item'
                        name='kode_item'
                        label='Kode Item'
                        value={createTableItemValidation.values.item.kode}
                        onChange={createTableItemValidation.handleChange}
                        error={
                          createTableItemValidation.touched.kode_item &&
                          Boolean(createTableItemValidation.errors.kode_item)
                        }
                        helperText={
                          createTableItemValidation.touched.kode_item &&
                          createTableItemValidation.errors.kode_item
                        }
                        disabled
                      />
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <Typography variant='h1 font-w-600'>Jumlah</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <div className='mb-16'>
                      <TextField
                        fullWidth
                        id='jumlah'
                        name='jumlah'
                        label='Jumlah'
                        value={createTableItemValidation.values.jumlah}
                        onChange={createTableItemValidation.handleChange}
                        error={
                          createTableItemValidation.touched.jumlah &&
                          Boolean(createTableItemValidation.errors.jumlah)
                        }
                        helperText={
                          createTableItemValidation.touched.jumlah &&
                          createTableItemValidation.errors.jumlah
                        }
                        disabled={isEditType && !isEditingMode}
                      />
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <Typography variant='h1 font-w-600'>Sediaan</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <div className='mb-16'>
                      <SelectAsync
                        id='sediaan'
                        labelField='Sediaan'
                        labelOptionRef='name'
                        valueOptionRef='id'
                        handlerRef={createTableItemValidation}
                        handlerFetchData={getSediaan}
                        handlerOnChange={(value) => {
                          if (value) {
                            createTableItemValidation.setFieldValue(
                              'sediaan',
                              value
                            );
                          } else {
                            createTableItemValidation.setFieldValue('sediaan', {
                              id: '',
                              name: '',
                            });
                          }
                        }}
                        isDisabled={isEditType && !isEditingMode}
                      />
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              {/* {isPembelian ? (
                <Grid container spacing={1}>
                  <Grid container spacing={1}>
                    <Grid item xs={3}>
                      <Typography variant='h1 font-w-600'>Kode Item</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <div className='mb-16'>
                        <SelectAsync
                          id='item'
                          labelField='Kode Item'
                          labelOptionRef='name'
                          valueOptionRef='id'
                          handlerRef={createTableItemValidation}
                          handlerFetchData={getListItem}
                          handlerOnChange={(value) => {
                            if (value) {
                              createTableItemValidation.setFieldValue(
                                'item',
                                value
                              );
                            } else {
                              createTableItemValidation.setFieldValue('item', {
                                id: '',
                                name: '',
                              });
                            }
                          }}
                          isDisabled={isEditType && !isEditingMode}
                        />
                      </div>
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={3}>
                      <Typography variant='h1 font-w-600'>Nama Item</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <div className='mb-16'>
                        <TextField
                          fullWidth
                          id='nama_item'
                          name='nama_item'
                          label='Nama Item'
                          value={createTableItemValidation.values.item.kode}
                          onChange={createTableItemValidation.handleChange}
                          error={
                            createTableItemValidation.touched.nama_item &&
                            Boolean(createTableItemValidation.errors.nama_item)
                          }
                          helperText={
                            createTableItemValidation.touched.nama_item &&
                            createTableItemValidation.errors.nama_item
                          }
                          disabled
                        />
                      </div>
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={3}>
                      <Typography variant='h1 font-w-600'>Jumlah</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <div className='mb-16'>
                        <TextField
                          fullWidth
                          id='jumlah'
                          name='jumlah'
                          label='Jumlah'
                          value={createTableItemValidation.values.jumlah}
                          onChange={createTableItemValidation.handleChange}
                          error={
                            createTableItemValidation.touched.jumlah &&
                            Boolean(createTableItemValidation.errors.jumlah)
                          }
                          helperText={
                            createTableItemValidation.touched.jumlah &&
                            createTableItemValidation.errors.jumlah
                          }
                          disabled={isEditType && !isEditingMode}
                        />
                      </div>
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={3}>
                      <Typography variant='h1 font-w-600'>Sediaan</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <div className='mb-16'>
                        <SelectAsync
                          id='sediaan'
                          labelField='Sediaan'
                          labelOptionRef='name'
                          valueOptionRef='id'
                          handlerRef={createTableItemValidation}
                          handlerFetchData={getSediaan}
                          handlerOnChange={(value) => {
                            if (value) {
                              createTableItemValidation.setFieldValue(
                                'sediaan',
                                value
                              );
                            } else {
                              createTableItemValidation.setFieldValue(
                                'sediaan',
                                {
                                  id: '',
                                  name: '',
                                }
                              );
                            }
                          }}
                          isDisabled={isEditType && !isEditingMode}
                        />
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              ) : null} */}
              <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                <Button
                  onClick={() => setState(false)}
                  variant='contained'
                  color='error'
                  sx={{marginRight: 1}}
                >
                  Batal
                </Button>
                <LoadingButton
                  type='submit'
                  variant='contained'
                  disabled={!isActionPermitted('purchaseOrder:store')}
                  loading={createTableItemValidation.isSubmitting}
                >
                  Tambah Item
                </LoadingButton>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Snackbar
        state={snackbar.state}
        setState={setSnackbar}
        message={snackbar.message}
        isSuccessType={snackbar.type === 'success'}
        isErrorType={snackbar.type === 'error'}
      />
    </>
  );
};

export default DialogAddItem;
