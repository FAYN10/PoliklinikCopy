import {useState, forwardRef, useRef, useEffect} from 'react';
import {useRouter} from 'next/router';
import {FocusError} from 'focus-formik-error';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import LoadingButton from '@mui/lab/LoadingButton';
import PlusIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import BackIcon from '@material-ui/icons/ArrowBack';
import DoneIcon from '@mui/icons-material/Done';
import {parse} from 'date-fns';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import {
  formatIsoToGen,
  formatGenToIso,
  formatReadable,
  formatLabelDate,
} from 'utils/formatTime';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {stringSchema} from 'utils/yupSchema';
import Snackbar from 'components/SnackbarMui';
import {
  createPurchaseOrder,
  updatePurchaseOrder,
  getDetailPurchaseOrder,
} from 'api/gudang/purchase-order';
import SelectAsync from 'components/SelectAsync';
import {getPoType} from 'api/gudang/po-type';
import {getSupplier} from 'api/supplier';
import {jenisGudang} from 'public/static/data';
import PrintIcon from '@mui/icons-material/Print';
import ReactToPrint from 'react-to-print';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import useClientPermission from 'custom-hooks/useClientPermission';
import {filterFalsyValue} from 'utils/helper';
import {Divider, Typography, Button, Paper} from '@mui/material';
import {Add as AddIcon, Delete as DeleteIcon} from '@mui/icons-material';
import DialogAddItem from './dialogAddItem';
import TableLayoutDetail from 'components/TableLayoutDetail';

const FormPembelian = ({
  isEditType = false,
  prePopulatedDataForm = {},
  detailPrePopulatedData = {},
  updatePrePopulatedData = () => 'update data',
  handleClose = () => {},
}) => {
  const router = useRouter();
  const {isActionPermitted} = useClientPermission();
  const labelPrintRef = useRef();
  const checkupPrintRef = useRef();
  const [snackbar, setSnackbar] = useState({
    state: false,
    type: null,
    message: '',
  });
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [dataDetail, setDataDetail] = useState([]);
  const [isDialogItem, setIsDialogItem] = useState(false);

  const detailPembelianTableHead = [
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
      id: 'jumlah',
      label: 'Jumlah',
    },
    {
      id: 'sediaan',
      label: 'Sediaan',
    },
    {
      id: 'harga_beli_satuan',
      label: 'Harga Beli',
    },
    {
      id: 'harga_jual_satuan',
      label: 'Harga Jual',
    },
    {
      id: 'diskon',
      label: 'Diskon',
    },
    {
      id: 'margin',
      label: 'Margin',
    },
    {
      id: 'total_pembelian',
      label: 'Total',
    },
    {
      id: 'tanggal_ed',
      label: 'Expired Date',
    },
  ];

  const dataDetailFormatHandler = (payload) => {
    const result = payload.map((e) => {
      return {
        kode_item: e.item.kode || 'null',
        nama_item: e.item.name || 'null',
        nomor_batch: e.nomor_batch || 'null',
        jumlah: e.stok || 'null',
        sediaan: e.sediaan.name || 'null',
        harga_beli_satuan: e.harga_beli_satuan || 'null',
        harga_jual_satuan: e.harga_jual_satuan || 'null',
        diskon: e.diskon || 'null',
        margin: e.margin || 'null',
        total: e.total_pembelian || 'null',
        tanggal_ed: e.tanggal_ed || 'null',
        id: e,
      };
    });
    return result;
  };

  const handleIsEditingMode = (e) => {
    setIsEditingMode(e.target.checked);
  };

  const pembelianInitialValues = !isEditType
    ? {
        nomor_faktur: null,
        nomor_po: null,
        tanggal_pembelian: null,
        tanggal_jatuh_tempo: null,
        supplier: {id: '', name: ''},
        ppn: null,
        receive_detail: [],
      }
    : prePopulatedDataForm;

  const createPembelianSchema = Yup.object({
    nomor_faktur: stringSchema('Nomor faktur'),
    nomor_po: stringSchema('Nomor PO'),
    tanggal_pembelian: Yup.date()
      .transform(function (value, originalValue) {
        if (this.isType(value)) {
          return value;
        }
        const result = parse(originalValue, 'dd/MM/yyyy', new Date());
        return result;
      })
      .typeError('Tanggal pembelian tidak valid')
      .min('2023-01-01', 'Tanggal pembelian tidak valid')
      .required('Tanggal pembelian wajib diisi'),
    tanggal_jatuh_tempo: Yup.date()
      .transform(function (value, originalValue) {
        if (this.isType(value)) {
          return value;
        }
        const result = parse(originalValue, 'dd/MM/yyyy', new Date());
        return result;
      })
      .typeError('Tanggal jatuh tempo tidak valid')
      .min('2023-01-01', 'Tanggal jatuh tempo tidak valid')
      .required('Tanggal jatuh tempo wajib diisi'),
    supplier: Yup.object({
      id: stringSchema('Supplier', true),
    }),
    ppn: stringSchema('PPN'),
    receive_detail: Yup.array(),
  });

  const createPembelianValidation = useFormik({
    initialValues: pembelianInitialValues,
    validationSchema: createPembelianSchema,
    enableReinitialize: true,
    onSubmit: async (values, {resetForm, setFieldError}) => {
      let messageContext = isEditType ? 'diperbarui' : 'ditambahkan';
      let data = {...values};
      data = {
        ...data,
        nomor_faktur: data.nomor_faktur,
        nomor_po: data.nomor_po,
        tanggal_pembelian: formatIsoToGen(data.tanggal_pembelian),
        tanggal_jatuh_tempo: formatIsoToGen(data.tanggal_jatuh_tempo),
        supplier: data.supplier.id,
        ppn: data.ppn,
      };
      try {
        let response;
        if (!isEditType) {
          const formattedData = filterFalsyValue({...data});
          response = await createPurchaseOrder(formattedData);
          resetForm();
        } else {
          await updatePurchaseOrder({
            ...formattedData,
            id: detailPrePopulatedData.id,
          });
          response = await getDetailPurchaseOrder({
            id: detailPrePopulatedData.id,
          });
          updatePrePopulatedData({...response.data.data});
        }
        setSnackbar({
          state: true,
          type: 'success',
          message: `"${data.nomor_faktur}" berhasil ${messageContext}!`,
        });
      } catch (error) {
        if (Object.keys(error.errorValidationObj).length >= 1) {
          for (let key in error.errorValidationObj) {
            setFieldError(key, error.errorValidationObj[key][0]);
          }
        }
        setSnackbar({
          state: true,
          type: 'error',
          message: `Terjadi kesalahan, "${data.nomor_faktur}" gagal ${messageContext}!`,
        });
      }
    },
  });

  const createDetailDataHandler = (payload) => {
    let tempData = [...createPembelianValidation.values.receive_detail];
    const isAvailable = tempData.some(
      (data) =>
        data.item.id !== payload.item.id &&
        data.sediaan.id !== payload.sediaan.id
    );
    if (isAvailable) {
      createPembelianValidation.setFieldValue(
        'receive_detail',
        tempData.filter((e) => e.item.id !== payload.item.id)
      );
    } else {
      createPembelianValidation.setFieldValue('receive_detail', [
        ...tempData,
        payload,
      ]);
    }
    console.log(createPembelianValidation.values.receive_detail);
    setDataDetail(
      dataDetailFormatHandler(createPembelianValidation.values.receive_detail)
    );
  };

  const deleteDetailDataHandler = (payload) => {
    let tempData = dataDetail.filter((data) => data.id == payload);
    // const result = dataDetailFormatHandler(createPembelianValidation.values.receive_detail);
    // createPembelianValidation.setFieldValue("receive_detail", ...tempData);
    // console.log(result);
    setDataDetail(tempData);
  };

  //   useEffect(() => {
  //     if (!isEditType) {
  //       const nomor_po = "";
  //       if(createPembelianValidation.values.potype.kode != "" && createPembelianValidation.values.tanggal_po != null){
  //         const year = formatIsoToGen(createPembelianValidation.values.tanggal_po).substring(0,4);
  //         const potype = createPembelianValidation.values.potype;
  //         nomor_po = `${potype.kode}${year}${String(potype.state_number + 1).padStart(6, '0')}`;
  //       }
  //       createPembelianValidation.setFieldValue('nomor_po', nomor_po);
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [createPembelianValidation.values.potype, createPembelianValidation.values.tanggal_po]);

  return (
    <>
      <Paper sx={{width: '100%', paddingTop: 3}}>
        {isEditType ? (
          <div className='flex justify-end mb-40'>
            <FormControlLabel
              control={
                <Switch
                  checked={isEditingMode}
                  onChange={handleIsEditingMode}
                  inputProps={{'aria-label': 'controlled'}}
                  disabled={!isActionPermitted('pasien:update')}
                />
              }
              label='Ubah data'
            />
          </div>
        ) : null}
        <form onSubmit={createPembelianValidation.handleSubmit}>
          <FocusError formik={createPembelianValidation} />
          <div className='p-16'>
            <Grid container spacing={0}>
              <Grid item xs={12} md={6}>
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <Typography variant='h1 font-w-600'>
                      Nomor Faktur
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <div className='mb-16'>
                      <TextField
                        fullWidth
                        id='nomor_faktur'
                        name='nomor_faktur'
                        label='Nomor Faktur'
                        value={
                          createPembelianValidation.values.nomor_faktur
                        }
                        onChange={createPembelianValidation.handleChange}
                        error={
                          createPembelianValidation.touched.nomor_faktur &&
                          Boolean(
                            createPembelianValidation.errors.nomor_faktur
                          )
                        }
                        helperText={
                          createPembelianValidation.touched.nomor_faktur &&
                          createPembelianValidation.errors.nomor_faktur
                        }
                        disabled={isEditType && !isEditingMode}
                      />
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <Typography variant='h1 font-w-600'>Nomor PO</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <div className='mb-16'>
                      <TextField
                        fullWidth
                        id='nomor_po'
                        name='nomor_po'
                        label='Nomor PO'
                        value={createPembelianValidation.values.nomor_po}
                        onChange={createPembelianValidation.handleChange}
                        error={
                          createPembelianValidation.touched.nomor_po &&
                          Boolean(createPembelianValidation.errors.nomor_po)
                        }
                        helperText={
                          createPembelianValidation.touched.nomor_po &&
                          createPembelianValidation.errors.nomor_po
                        }
                        disabled={isEditType && !isEditingMode}
                      />
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <Typography variant='h1 font-w-600'>
                      Tanggal Pembelian
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <div className='mb-16'>
                      <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            id='tanggal_pembelian'
                            name='tanggal_pembelian'
                            label='Tanggal Pembelian'
                            inputFormat='dd-MM-yyyy'
                            mask='__-__-____'
                            value={
                              createPembelianValidation.values
                                .tanggal_pembelian
                                ? formatGenToIso(
                                    createPembelianValidation.values
                                      .tanggal_pembelian
                                  )
                                : null
                            }
                            onChange={(newValue) => {
                              createPembelianValidation.setFieldValue(
                                'tanggal_pembelian',
                                newValue
                              );
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                error={
                                  createPembelianValidation.touched
                                    .tanggal_pembelian &&
                                  Boolean(
                                    createPembelianValidation.errors
                                      .tanggal_pembelian
                                  )
                                }
                                helperText={
                                  createPembelianValidation.touched
                                    .tanggal_pembelian &&
                                  createPembelianValidation.errors
                                    .tanggal_pembelian
                                }
                              />
                            )}
                            disabled={isEditType && !isEditingMode}
                          />
                        </LocalizationProvider>
                      </FormControl>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
              <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <Typography variant='h1 font-w-600'>
                        Jatuh Tempo Pembayaran
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <div className='mb-16'>
                      <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            id='tanggal_jatuh_tempo'
                            name='tanggal_jatuh_tempo'
                            label='Jatuh Tempo Pembayaran'
                            inputFormat='dd-MM-yyyy'
                            mask='__-__-____'
                            value={
                              createPembelianValidation.values
                                .tanggal_jatuh_tempo
                                ? formatGenToIso(
                                    createPembelianValidation.values
                                      .tanggal_jatuh_tempo
                                  )
                                : null
                            }
                            onChange={(newValue) => {
                              createPembelianValidation.setFieldValue(
                                'tanggal_jatuh_tempo',
                                newValue
                              );
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                error={
                                  createPembelianValidation.touched
                                    .tanggal_jatuh_tempo &&
                                  Boolean(
                                    createPembelianValidation.errors
                                      .tanggal_jatuh_tempo
                                  )
                                }
                                helperText={
                                  createPembelianValidation.touched
                                    .tanggal_jatuh_tempo &&
                                  createPembelianValidation.errors
                                    .tanggal_jatuh_tempo
                                }
                              />
                            )}
                            disabled={isEditType && !isEditingMode}
                          />
                        </LocalizationProvider>
                      </FormControl>
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <Typography variant='h1 font-w-600'>Supplier</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <div className='mb-16'>
                      <SelectAsync
                        id='supplier'
                        labelField='Supplier'
                        labelOptionRef='name'
                        valueOptionRef='id'
                        handlerRef={createPembelianValidation}
                        handlerFetchData={getSupplier}
                        handlerOnChange={(value) => {
                          if (value) {
                            createPembelianValidation.setFieldValue(
                              'supplier',
                              value
                            );
                          } else {
                            createPembelianValidation.setFieldValue(
                              'supplier',
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
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <Typography variant='h1 font-w-600'>PPN</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <div className='mb-16'>
                      <TextField
                        fullWidth
                        id='ppn'
                        name='ppn'
                        label='PPN'
                        value={createPembelianValidation.values.ppn}
                        onChange={createPembelianValidation.handleChange}
                        error={
                          createPembelianValidation.touched.ppn &&
                          Boolean(
                            createPembelianValidation.errors.ppn
                          )
                        }
                        helperText={
                          createPembelianValidation.touched.ppn &&
                          createPembelianValidation.errors.ppn
                        }
                        disabled={isEditType && !isEditingMode}
                      />
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>

          <Divider sx={{borderWidth: '1px'}} />

          <div className='p-16'>
            <TableLayoutDetail
              baseRoutePath={`${router.asPath}`}
              title='Item'
              isBtnAdd
              btnAddHandler={setIsDialogItem}
              tableHead={detailPembelianTableHead}
              data={dataDetail}
              // isUpdatingData={isUpdatingDataRawatJalan}
              deleteData={deleteDetailDataHandler}
              // createData={createDetailDataHandler}
            />

            <DialogAddItem
              state={isDialogItem}
              isPembelian
              setState={setIsDialogItem}
              createData={createDetailDataHandler}
            />

            <div className='flex justify-end items-center mt-16'>
              <Button
                type='button'
                variant='outlined'
                startIcon={<BackIcon />}
                sx={{marginRight: 2}}
                onClick={() => router.push('/gudang/pembelian')}
              >
                Kembali
              </Button>
              {isEditType ? (
                <LoadingButton
                  type='submit'
                  variant='contained'
                  sx={{marginBottom: 1, marginRight: 2}}
                  disabled={
                    JSON.stringify(
                      createPembelianValidation.initialValues
                    ) ===
                      JSON.stringify(createPembelianValidation.values) ||
                    !isActionPermitted('pasien:update') ||
                    (isEditType && !isEditingMode)
                  }
                  startIcon={<SaveIcon />}
                  loadingPosition='start'
                  loading={createPembelianValidation.isSubmitting}
                >
                  Simpan perubahan
                </LoadingButton>
              ) : (
                <LoadingButton
                  type='submit'
                  variant='contained'
                  disabled={!isActionPermitted('pasien:store')}
                  startIcon={<DoneIcon />}
                  loadingPosition='start'
                  loading={createPembelianValidation.isSubmitting}
                >
                  Simpan Pembelian
                </LoadingButton>
              )}
            </div>
          </div>
        </form>
      </Paper>
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

export default FormPembelian;
