import {useState, useEffect, useRef, forwardRef} from 'react';
import {useRouter} from 'next/router';
import Image from 'next/image';
import LoaderOnLayout from 'components/LoaderOnLayout';
import FormPasien from 'components/modules/pasien/form';
import {formatGenToIso} from 'utils/formatTime';
import getStaticData from 'utils/getStaticData';
import {getDetailPurchaseOrder} from 'api/gudang/purchase-order';
import TableLayout from 'pages/pasien/TableLayout';
import {formatReadable} from 'utils/formatTime';
import {parse} from 'date-fns';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import useClientPermission from 'custom-hooks/useClientPermission';
import BackIcon from '@material-ui/icons/ArrowBack';
import DoneIcon from '@mui/icons-material/Done';
import FormControl from '@mui/material/FormControl';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import {
  Grid,
  Card,
  Avatar,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
} from '@mui/material';
import ReactToPrint from 'react-to-print';
import {Paper} from '@material-ui/core';

const Detail = ({
  isEditType = false,
  prePopulatedDataForm = {},
  detailPrePopulatedData = {},
  updatePrePopulatedData = () => 'update data',
  handleClose = () => {},
}) => {
  const router = useRouter();
  const {isActionPermitted} = useClientPermission();
  const {slug} = router.query;
  // const [dataPurchaseOrder, setDataPurchaseOrder] = useState({});
  const [detailDataPurchaseOrder, setDetailDataPurchaseOrder] = useState({});
  const [isLoadingDataPurchaseOrder, setIsLoadingDataPurchaseOrder] =
    useState(true);
  const [rows, setRows] = useState(
    detailDataPurchaseOrder?.purchase_order_detail || []
  );
  const generalConsentPrintRef = useRef();

  const receiveConfirmInitialValues = !isEditType
    ? {
        tanggal_pembelian: null,
        tanggal_jatuh_tempo: null,
        ppn: null,
        nomor_faktur: null,
      }
    : prePopulatedDataForm;

  const createReceiveConfirmSchema = Yup.object({
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
    ppn: Yup.string().required('PPN item wajib diisi'),
    nomor_faktur: Yup.string().required('Nomor faktur wajib diisi'),
  });

  const createReceiveConfirmValidation = useFormik({
    initialValues: receiveConfirmInitialValues,
    validationSchema: createReceiveConfirmSchema,
    enableReinitialize: true,
    onSubmit: async (values, {resetForm, setFieldError}) => {
      let messageContext = isEditType ? 'diperbarui' : 'ditambahkan';
      let data = {...values};
      try {
        let response;
        // Simulasikan response
        response = {success: true};

        if (response.success) {
          setSnackbar({
            state: true,
            type: 'success',
            message: `"${data.nomor_faktur}" berhasil ${messageContext}!`,
          });

          // Reset form fields
          resetForm();
        } else {
          setSnackbar({
            state: true,
            type: 'error',
            message: `Terjadi kesalahan, "${data.nomor_faktur}" gagal ${messageContext}!`,
          });
        }
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

  useEffect(() => {
    if (router.isReady) {
      (async () => {
        try {
          const response = await getDetailPurchaseOrder(slug[0]);
          const data = response.data.data;
          setDetailDataPurchaseOrder(data); // setDetailPO pakai data dari resnpose API
          // const formattedData = dataFormatter(data); // format data untuk error handling
          // setDataPurchaseOrder(formattedData); // setDataPO pakai data yang diformat di atas
          console.log('Fetched Data:', data);
          const purchaseOrderDetails = data.purchase_order_detail || []; // ambil data detail PO jika nggak ada maka array kosong
          console.log('Purchase Order Details:', purchaseOrderDetails);
          setRows(purchaseOrderDetails);
        } catch (error) {
          console.log('Error fetching data:', error);
        } finally {
          setIsLoadingDataPurchaseOrder(false);
        }
      })();
    }
  }, [router.isReady, slug]);

  return (
    <>
      {isLoadingDataPurchaseOrder ? (
        <LoaderOnLayout />
      ) : (
        <>
          <Paper>
            <Card className='py-12 mb-16'>
              <div className='px-14 flex justify-between items-start'>
                <div className='flex items-start'>
                  <div className='ml-8 mt-8'>
                    <Grid container spacing={1}>
                      <Grid item xs={2}>
                        <Typography variant='h1 font-w-700'>
                          Nomor Purchase Order
                        </Typography>
                      </Grid>
                      <Grid item md={10} sm={12}>
                        <div>
                          {' : '}
                          {detailDataPurchaseOrder?.nomor_po}
                        </div>
                      </Grid>
                      {/* <Grid item xs={3}>
                        <Typography variant='h1 font-w-700'>
                          Tanggal Purchase Order
                        </Typography>
                      </Grid>
                      <Grid item md={7} sm={12}>
                        <div>
                          {' : '}
                          {formatReadable(detailDataPurchaseOrder?.tanggal_po)}
                        </div>
                      </Grid> */}
                      <Grid item xs={2}>
                        <Typography variant='h1 font-w-700'>
                          Nama Supplier
                        </Typography>
                      </Grid>
                      <Grid item md={10} sm={12}>
                        <div>
                          {' : '}
                          {detailDataPurchaseOrder?.supplier.name}
                        </div>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant='h1 font-w-600'>
                          Tanggal Pembelian
                        </Typography>
                      </Grid>
                      <Grid item md={4} sm={12}>
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
                                  createReceiveConfirmValidation.values
                                    .tanggal_pembelian
                                    ? formatGenToIso(
                                        createReceiveConfirmValidation.values
                                          .tanggal_pembelian
                                      )
                                    : null
                                }
                                onChange={(newValue) => {
                                  createReceiveConfirmValidation.setFieldValue(
                                    'tanggal_pembelian',
                                    newValue
                                  );
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    error={
                                      createReceiveConfirmValidation.touched
                                        .tanggal_pembelian &&
                                      Boolean(
                                        createReceiveConfirmValidation.errors
                                          .tanggal_pembelian
                                      )
                                    }
                                    helperText={
                                      createReceiveConfirmValidation.touched
                                        .tanggal_pembelian &&
                                      createReceiveConfirmValidation.errors
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
                      <Grid item xs={2}>
                        <Typography variant='h1 font-w-600'>
                          Tanggal Jatuh Tempo
                        </Typography>
                      </Grid>
                      <Grid item md={4} sm={12}>
                        <div className='mb-16'>
                          <FormControl fullWidth>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                id='tanggal_jatuh_tempo'
                                name='tanggal_jatuh_tempo'
                                label='Tanggal Jatuh Tempo'
                                inputFormat='dd-MM-yyyy'
                                mask='__-__-____'
                                value={
                                  createReceiveConfirmValidation.values
                                    .tanggal_jatuh_tempo
                                    ? formatGenToIso(
                                        createReceiveConfirmValidation.values
                                          .tanggal_jatuh_tempo
                                      )
                                    : null
                                }
                                onChange={(newValue) => {
                                  createReceiveConfirmValidation.setFieldValue(
                                    'tanggal_jatuh_tempo',
                                    newValue
                                  );
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    error={
                                      createReceiveConfirmValidation.touched
                                        .tanggal_jatuh_tempo &&
                                      Boolean(
                                        createReceiveConfirmValidation.errors
                                          .tanggal_jatuh_tempo
                                      )
                                    }
                                    helperText={
                                      createReceiveConfirmValidation.touched
                                        .tanggal_jatuh_tempo &&
                                      createReceiveConfirmValidation.errors
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
                      <Grid item xs={2}>
                        <Typography variant='h1 font-w-600'>
                          Nomor Faktur
                        </Typography>
                      </Grid>
                      <Grid item md={4} sm={12}>
                        <div className='mb-16'>
                          <TextField
                            fullWidth
                            id='nomor_faktur'
                            name='nomor_faktur'
                            label='Nomor Faktur'
                            value={
                              createReceiveConfirmValidation.values.nomor_faktur
                            }
                            onChange={
                              createReceiveConfirmValidation.handleChange
                            }
                            error={
                              createReceiveConfirmValidation.touched.nomor_faktur &&
                              Boolean(
                                createReceiveConfirmValidation.errors.nomor_faktur
                              )
                            }
                            helperText={
                              createReceiveConfirmValidation.touched.nomor_faktur &&
                              createReceiveConfirmValidation.errors.nomor_faktur
                            }
                            disabled={isEditType && !isEditingMode}
                          />
                        </div>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant='h1 font-w-600'>
                          PPN
                        </Typography>
                      </Grid>
                      <Grid item md={4} sm={12}>
                        <div className='mb-16'>
                          <TextField
                            fullWidth
                            id='ppn'
                            name='ppn'
                            label='PPN'
                            value={
                              createReceiveConfirmValidation.values.ppn
                            }
                            onChange={
                              createReceiveConfirmValidation.handleChange
                            }
                            error={
                              createReceiveConfirmValidation.touched.ppn &&
                              Boolean(
                                createReceiveConfirmValidation.errors.ppn
                              )
                            }
                            helperText={
                              createReceiveConfirmValidation.touched.ppn &&
                              createReceiveConfirmValidation.errors.ppn
                            }
                            disabled={isEditType && !isEditingMode}
                          />
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </div>
              <Divider sx={{borderWidth: '1px', marginTop: 2}} />
              <div className='mt-32 p-16'>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{fontWeight: 'bold'}}>No</TableCell>
                        <TableCell sx={{fontWeight: 'bold'}}>
                          Kode Item
                        </TableCell>
                        <TableCell sx={{fontWeight: 'bold'}}>
                          Nama Item
                        </TableCell>
                        <TableCell sx={{fontWeight: 'bold'}}>Jumlah</TableCell>
                        <TableCell sx={{fontWeight: 'bold'}}>Harga Beli</TableCell>
                        <TableCell sx={{fontWeight: 'bold'}}>Harga Jual</TableCell>
                        <TableCell sx={{fontWeight: 'bold'}}>Diskon</TableCell>
                        <TableCell sx={{fontWeight: 'bold'}}>Margin</TableCell>
                        <TableCell sx={{fontWeight: 'bold'}}>Total</TableCell>
                        <TableCell sx={{fontWeight: 'bold'}}>Nomor Batch</TableCell>
                        <TableCell sx={{fontWeight: 'bold'}}>Expired Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{row.item.kode}</TableCell>
                          <TableCell>{row.item.name}</TableCell>
                          <TableCell>{row.jumlah}</TableCell>
                          <TableCell>{''}</TableCell>
                          <TableCell>{''}</TableCell>
                          <TableCell>{''}</TableCell>
                          <TableCell>{''}</TableCell>
                          <TableCell>{''}</TableCell>
                          <TableCell>{''}</TableCell>
                          <TableCell>{''}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <div className='flex justify-end'>
                <Button
                  type='button'
                  variant='outlined'
                  startIcon={<BackIcon />}
                  sx={{marginBottom: 1, marginRight: 2}}
                  onClick={() => router.push('/gudang/purchase-order')}
                >
                  Kembali
                </Button>
                <Button
                  type='button'
                  variant='contained'
                  startIcon={<DoneIcon />}
                  sx={{marginBottom: 1, marginRight: 2}}
                  onClick={() => router.push('/gudang/pembelian')}
                >
                  Simpan
                </Button>
              </div>
            </Card>
          </Paper>
        </>
      )}
    </>
  );
};

export default Detail;
