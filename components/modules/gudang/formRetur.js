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
import DialogAddItem from './dialogAddItemRetur';
import TableLayoutDetail from 'components/TableLayoutDetailGudang';
import DialogEditItem from './dialogEditItem';

const FormRetur = ({
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

  const detailReturTableHead = [
    {
      id: 'kode_item',
      label: 'Kode Item',
    },
    {
      id: 'nama_item',
      label: 'Nama Item',
    },
    {
      id: 'stok',
      label: 'Jumlah Stok',
    },
    {
      id: 'jumlah_retur',
      label: 'Jumlah Retur',
    },
    {
      id: 'alasan',
      label: 'Alasan',
    },
  ];

  const dataDetailFormatHandler = (payload) => {
    const result = payload.map((e) => {
      return {
        kode_item: e.item.kode || 'null',
        nama_item: e.item.name || 'null',
        stok: e.stok || 'null',
        jumlah_retur: e.jumlah_retur || 'null',
        alasan: e.alasan || 'null',
        id: e,
      };
    });
    return result;
  };

  const handleIsEditingMode = (e) => {
    setIsEditingMode(e.target.checked);
  };

  const returInitialValues = !isEditType
    ? {
        nomor_retur: null,
        nomor_faktur: null,
        tanggal_retur: null,
        supplier: {id: '', name: ''},
        retur_detail: [],
      }
    : prePopulatedDataForm;

  const createReturSchema = Yup.object({
    nomor_retur: stringSchema('Nomor retur'),
    nomor_faktur: stringSchema('Nomor faktur'),
    tanggal_retur: Yup.date()
      .transform(function (value, originalValue) {
        if (this.isType(value)) {
          return value;
        }
        const result = parse(originalValue, 'dd/MM/yyyy', new Date());
        return result;
      })
      .typeError('Tanggal retur tidak valid')
      .min('2023-01-01', 'Tanggal retur tidak valid')
      .required('Tanggal retur wajib diisi'),
    supplier: Yup.object({
      id: stringSchema('Supplier', true),
    }),
    retur_detail: Yup.array(),
  });

  const createReturValidation = useFormik({
    initialValues: returInitialValues,
    validationSchema: createReturSchema,
    enableReinitialize: true,
    onSubmit: async (values, {resetForm, setFieldError}) => {
      let messageContext = isEditType ? 'diperbarui' : 'ditambahkan';
      let data = {...values};
      data = {
        ...data,
        nomor_retur: data.nomor_retur,
        nomor_faktur: data.nomor_faktur,
        tanggal_retur: formatIsoToGen(data.tanggal_retur),
        supplier: data.supplier.id,
      };
      try {
        let response;
        if (!isEditType) {
          const formattedData = filterFalsyValue({...data});
          response = await createRetur(formattedData);
          resetForm();
        } else {
          await updateRetur({
            ...formattedData,
            id: detailPrePopulatedData.id,
          });
          response = await getDetailRetur({
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
    let tempData = [...createReturValidation.values.receive_detail];
    const isAvailable = tempData.some(
      (data) =>
        data.item.id !== payload.item.id &&
        data.sediaan.id !== payload.sediaan.id
    );
    if (isAvailable) {
      createReturValidation.setFieldValue(
        'retur_detail',
        tempData.filter((e) => e.item.id !== payload.item.id)
      );
    } else {
      createReturValidation.setFieldValue('retur_detail', [
        ...tempData,
        payload,
      ]);
    }
    console.log(createReturValidation.values.retur_detail);
    setDataDetail(
      dataDetailFormatHandler(createReturValidation.values.retur_detail)
    );
  };

  const deleteDetailDataHandler = (payload) => {
    let tempData = dataDetail.filter((data) => data.id == payload);
    // const result = dataDetailFormatHandler(createReturValidation.values.receive_detail);
    // createReturValidation.setFieldValue("receive_detail", ...tempData);
    // console.log(result);
    setDataDetail(tempData);
  };

  //   useEffect(() => {
  //     if (!isEditType) {
  //       const nomor_po = "";
  //       if(createReturValidation.values.potype.kode != "" && createReturValidation.values.tanggal_po != null){
  //         const year = formatIsoToGen(createReturValidation.values.tanggal_po).substring(0,4);
  //         const potype = createReturValidation.values.potype;
  //         nomor_po = `${potype.kode}${year}${String(potype.state_number + 1).padStart(6, '0')}`;
  //       }
  //       createReturValidation.setFieldValue('nomor_po', nomor_po);
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [createReturValidation.values.potype, createReturValidation.values.tanggal_po]);

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
        <form onSubmit={createReturValidation.handleSubmit}>
          <FocusError formik={createReturValidation} />
          <div className='p-16'>
            <Grid container spacing={0}>
              <Grid item xs={12} md={6}>
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <Typography variant='h1 font-w-600'>Nomor Retur</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <div className='mb-16'>
                      <TextField
                        fullWidth
                        id='nomor_retur'
                        name='nomor_retur'
                        label='Nomor Retur'
                        value={createReturValidation.values.nomor_retur}
                        onChange={createReturValidation.handleChange}
                        error={
                          createReturValidation.touched.nomor_retur &&
                          Boolean(createReturValidation.errors.nomor_retur)
                        }
                        helperText={
                          createReturValidation.touched.nomor_retur &&
                          createReturValidation.errors.nomor_retur
                        }
                        disabled={isEditType && !isEditingMode}
                      />
                    </div>
                  </Grid>
                </Grid>
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
                        value={createReturValidation.values.nomor_faktur}
                        onChange={createReturValidation.handleChange}
                        error={
                          createReturValidation.touched.nomor_faktur &&
                          Boolean(createReturValidation.errors.nomor_faktur)
                        }
                        helperText={
                          createReturValidation.touched.nomor_faktur &&
                          createReturValidation.errors.nomor_faktur
                        }
                        disabled={isEditType && !isEditingMode}
                      />
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <Typography variant='h1 font-w-600'>
                      Tanggal Retur
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <div className='mb-16'>
                      <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            id='tanggal_retur'
                            name='tanggal_retur'
                            label='Tanggal Pembelian'
                            inputFormat='dd-MM-yyyy'
                            mask='__-__-____'
                            value={
                              createReturValidation.values.tanggal_retur
                                ? formatGenToIso(
                                    createReturValidation.values.tanggal_retur
                                  )
                                : null
                            }
                            onChange={(newValue) => {
                              createReturValidation.setFieldValue(
                                'tanggal_retur',
                                newValue
                              );
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                error={
                                  createReturValidation.touched.tanggal_retur &&
                                  Boolean(
                                    createReturValidation.errors.tanggal_retur
                                  )
                                }
                                helperText={
                                  createReturValidation.touched.tanggal_retur &&
                                  createReturValidation.errors.tanggal_retur
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
                        handlerRef={createReturValidation}
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
              tableHead={detailReturTableHead}
              data={dataDetail}
              // isUpdatingData={isUpdatingDataRawatJalan}
              deleteData={deleteDetailDataHandler}
              // createData={createDetailDataHandler}
            />

            <DialogAddItem
              state={isDialogItem}
              setState={setIsDialogItem}
              // createData={createDetailDataHandler}
            />

            <div className='flex justify-end items-center mt-16'>
              <Button
                type='button'
                variant='outlined'
                startIcon={<BackIcon />}
                sx={{marginRight: 2}}
                onClick={() => router.push('/gudang/retur')}
              >
                Kembali
              </Button>
              {isEditType ? (
                <LoadingButton
                  type='submit'
                  variant='contained'
                  sx={{marginBottom: 1, marginRight: 2}}
                  disabled={
                    JSON.stringify(createReturValidation.initialValues) ===
                      JSON.stringify(createReturValidation.values) ||
                    !isActionPermitted('pasien:update') ||
                    (isEditType && !isEditingMode)
                  }
                  startIcon={<SaveIcon />}
                  loadingPosition='start'
                  loading={createReturValidation.isSubmitting}
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
                  loading={createReturValidation.isSubmitting}
                >
                  Simpan Retur
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

export default FormRetur;
