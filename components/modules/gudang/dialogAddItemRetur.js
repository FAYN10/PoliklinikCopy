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
import {parse} from 'date-fns';
import {stringSchema} from 'utils/yupSchema';
import {useFormik} from 'formik';
import SelectAsync from 'components/SelectAsync';
import {getListItem} from 'api/gudang/item';
import {getSediaan} from 'api/gudang/sediaan';
import {getSupplier} from 'api/supplier';
import {FocusError} from 'focus-formik-error';
import {LoadingButton} from '@mui/lab';
import useClientPermission from 'custom-hooks/useClientPermission';

const DialogAddItem = ({
  state,
  setState,
  isEditType = false,
  isPurchaseOrder = false,
  isRetur = false,
  // isPembelian = false,
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
        jumlah_retur: null,
        alasan: null,
      }
    : prePopulatedDataForm;

  const createTableItemSchema = Yup.object({
    item: Yup.object({
      id: stringSchema('Kode Item', true),
    }),
    jumlah_retur: Yup.string()
      .matches(/^[0-9]+$/, 'Wajib angka')
      .required('Jumlah retur wajib diisi'),
    alasan: stringSchema('Alasan'),
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
                    <Typography variant='h1 font-w-600'>
                      Jumlah Retur
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <div className='mb-16'>
                      <TextField
                        fullWidth
                        id='jumlah_retur'
                        name='jumlah_retur'
                        label='Jumlah Retur'
                        value={createTableItemValidation.values.jumlah_retur}
                        onChange={createTableItemValidation.handleChange}
                        error={
                          createTableItemValidation.touched.jumlah_retur &&
                          Boolean(createTableItemValidation.errors.jumlah_retur)
                        }
                        helperText={
                          createTableItemValidation.touched.jumlah_retur &&
                          createTableItemValidation.errors.jumlah_retur
                        }
                        disabled={isEditType && !isEditingMode}
                      />
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <Typography variant='h1 font-w-600'>
                      Alasan
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <div className='mb-16'>
                      <TextField
                        fullWidth
                        id='alasan'
                        name='alasan'
                        label='Alasan'
                        value={createTableItemValidation.values.alasan}
                        onChange={createTableItemValidation.handleChange}
                        error={
                          createTableItemValidation.touched.alasan &&
                          Boolean(createTableItemValidation.errors.alasan)
                        }
                        helperText={
                          createTableItemValidation.touched.alasan &&
                          createTableItemValidation.errors.alasan
                        }
                        disabled={isEditType && !isEditingMode}
                      />
                    </div>
                  </Grid>
                </Grid>
              </Grid>
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
                  disabled={!isActionPermitted('Retur:store')}
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
