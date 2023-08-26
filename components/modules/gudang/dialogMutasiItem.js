import React, {useState, useEffect} from 'react';
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
  FormControl,
  Card,
  CardContent,
} from '@mui/material';
import * as Yup from 'yup';
import {stringSchema} from 'utils/yupSchema';
import {useFormik} from 'formik';
import SelectAsync from 'components/SelectAsync';
import {FocusError} from 'focus-formik-error';
import {LoadingButton} from '@mui/lab';
import useClientPermission from 'custom-hooks/useClientPermission';
import {getListItem} from 'api/gudang/item';
import {getSediaan} from 'api/gudang/sediaan';
import TableLayoutDetail from 'components/TableLayoutDetailGudang';

const daftarItemTableHead = [
  {
    id: 'kode_item',
    label: 'Kode Item',
  },
  {
    id: 'nama_item',
    label: 'Nama Item',
  },
  {
    id: 'nomor_batch',
    label: 'Nomor Batch',
  },
  {
    id: 'gudang',
    label: 'Gudang',
  },
  {
    id: 'stok',
    label: 'Stok',
  },
  {
    id: 'sediaan',
    label: 'Sediaan',
  },
  {
    id: 'harga_jual_satuan',
    label: 'Harga Jual',
  },
  {
    id: 'tanggal_ed',
    label: 'Expired Date',
  },
];

const dataItemFormatHandler = (payload) => {
  const result = payload.map((e) => {
    return {
      kode_item: e.item.kode || 'null',
      nama_item: e.item.name || 'null',
      nomor_batch: e.nomor_batch || 'null',
      gudang: e.gudang || 'null',
      stok: e.stok || 'null',
      sediaan: e.sediaan.name || 'null',
      harga_jual_satuan: e.harga_jual_satuan || 'null',
      tanggal_ed: formatReadable(e.tanggal_ed) || 'null',
      id: e.id,
    };
  });
  return result;
};

const DialogMutasiItem = ({
  state,
  setState,
  isEditType = false,
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

  // Item --general state
  const [dataItem, setDataItem] = useState([]);
  const [dataMetaItem, setDataMetaItem] = useState({});
  const [dataItemPerPage, setDataItemPerPage] = useState(8);
  const [isLoadingDataItem, setIsLoadingDataItem] = useState(false);
  const [isUpdatingDataItem, setIsUpdatingDataItem] = useState(false);

  const [isEditingMode, setIsEditingMode] = useState(false);

  const handleIsEditingMode = (e) => {
    setIsEditingMode(e.target.checked);
  };

  const initDataItem = async () => {
    try {
      setIsLoadingDataItem(true);
      const params = {
        per_page: dataItemPerPage,
      };
      const response = await getDetailPembelian(params);
      const result = dataItemFormatHandler(response.data.data.receive_detail);
      setDataItem(result);
      setDataMetaItem(response.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDataItem(false);
    }
  };

  const updateDataItemHandler = async (payload) => {
    try {
      setIsUpdatingDataItem(true);
      const response = await getDetailPembelian(payload);
      const result = dataItemFormatHandler(response.data.data.receive_detail);
      setDataItem(result);
      setDataMetaItem(response.data.meta);
    } catch (error) {
      console.log(error);
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataItem(false);
    }
  };

  const searchDataItemHandler = async (payload) => {
    try {
      setIsUpdatingDataItem(true);
      const response = await searchItem({
        search_text: payload.map((e) => e.value),
        search_column: payload.map((e) => e.type),
        per_page: dataItemPerPage,
      });
      if (response.data.data.length !== 0) {
        const result = dataItemFormatHandler(response.data.data);
        setDataItem(result);
        setDataMetaItem(response.data.meta);
      } else {
        setSnackbarState({
          state: true,
          type: 'warning',
          message: `${payload} tidak ditemukan`,
        });
        const response = await getDetailPembelian({
          per_page: dataItemPerPage,
        });
        const result = dataItemFormatHandler(response.data.data);
        setDataItem(result);
        setDataMetaItem(response.data.meta);
      }
    } catch (error) {
      setSnackbarState({
        state: true,
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsUpdatingDataItem(false);
    }
  };

  const tableItemInitialValues = !isEditType
    ? {
        item: {id: '', kode: '', name: ''},
        nomor_batch: null,
        jumlah: null,
        sediaan: {id: '', name: ''},
      }
    : prePopulatedDataForm;

  const createTableItemSchema = Yup.object({
    item: Yup.object({
      id: stringSchema('Kode Item', true),
    }),
    nomor_batch: stringSchema('Nomor batch', true),
    jumlah: Yup.string()
      .matches(/^[0-9]+$/, 'Wajib angka')
      .required('Jumlah wajib diisi'),
    sediaan: Yup.object({
      id: stringSchema('Sediaan', true),
    }),
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

  useEffect(() => {
    initDataItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Dialog
        open={state}
        onClose={() => setState(false)}
        maxWidth='xl'
        fullWidth
      >
        <DialogTitle sx={{paddingLeft: 2, paddingBottom: 1}}>
          Mutasi Item
        </DialogTitle>
        <Divider sx={{borderWidth: '1px'}} />
        <DialogContent sx={{paddingBottom: 2}}>
          <div style={{display: 'flex'}}>
            <Card style={{flex: 1, padding: '20px', marginRight: '5px'}}>
              <CardContent>
                <form onSubmit={createTableItemValidation.handleSubmit}>
                  <FocusError formik={createTableItemValidation} />
                  <div className='mt-40'>
                    <Grid item xs={9} md={6}>
                      <Grid container spacing={1}>
                        <Grid item xs={3.5}>
                          <Typography variant='h1 font-w-600'>
                            Kode Item
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
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
                                  createTableItemValidation.setFieldValue(
                                    'item',
                                    {
                                      id: '',
                                      name: '',
                                    }
                                  );
                                }
                              }}
                              isDisabled
                            />
                          </div>
                        </Grid>
                      </Grid>
                      <Grid container spacing={1}>
                        <Grid item xs={3.5}>
                          <Typography variant='h1 font-w-600'>
                            Nama Item
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
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
                                Boolean(
                                  createTableItemValidation.errors.nama_item
                                )
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
                        <Grid item xs={3.5}>
                          <Typography variant='h1 font-w-600'>
                            Nomor Batch
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <div className='mb-16'>
                            <TextField
                              fullWidth
                              id='nomor_batch'
                              name='nomor_batch'
                              label='Nomor Batch'
                              value={
                                createTableItemValidation.values.nomor_batch
                              }
                              onChange={createTableItemValidation.handleChange}
                              error={
                                createTableItemValidation.touched.nomor_batch &&
                                Boolean(
                                  createTableItemValidation.errors.nomor_batch
                                )
                              }
                              helperText={
                                createTableItemValidation.touched.nomor_batch &&
                                createTableItemValidation.errors.nomor_batch
                              }
                              disabled
                            />
                          </div>
                        </Grid>
                      </Grid>
                      <Grid container spacing={1}>
                        <Grid item xs={3.5}>
                          <Typography variant='h1 font-w-600'>
                            Jumlah
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
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
                        <Grid item xs={3.5}>
                          <Typography variant='h1 font-w-600'>
                            Sediaan
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <div className='mb-16'>
                            <SelectAsync
                              id='sediaan'
                              labelField='Sediaan'
                              labelOptionRef='sediaan'
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
                              isDisabled
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
                        disabled={!isActionPermitted('pembelian:store')}
                        loading={createTableItemValidation.isSubmitting}
                      >
                        Simpan
                      </LoadingButton>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
            <Card style={{flex: 1, padding: '20px', marginRight: '5px'}}>
              <CardContent>
                <TableLayoutDetail
                  // baseRoutePath={`${router.asPath}`}
                  title='Daftar Item'
                  tableHead={daftarItemTableHead}
                  data={dataItem}
                  meta={dataMetaItem}
                  dataPerPage={dataItemPerPage}
                  isUpdatingData={isUpdatingDataItem}
                  updateDataPerPage={(e, filter) => {
                    setDataItemPerPage(e.target.value);
                    updateDataItemHandler({
                      per_page: e.target.value,
                      search_text: filter.map((e) => e.value),
                      search_column: filter.map((e) => e.type),
                    });
                  }}
                  updateDataNavigate={(payload) =>
                    updateDataItemHandler({
                      per_page: dataItemPerPage,
                      cursor: payload,
                    })
                  }
                  refreshData={() =>
                    updateDataItemHandler({per_page: dataItemPerPage})
                  }
                  searchData={searchDataItemHandler}
                />
              </CardContent>
            </Card>
          </div>
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

export default DialogMutasiItem;
