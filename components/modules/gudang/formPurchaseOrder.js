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
import {filterFalsyValue, convertDataDetail} from 'utils/helper';
import {Divider, Typography, Button, Paper} from '@mui/material';
import {Add as AddIcon, Delete as DeleteIcon} from '@mui/icons-material';
import DialogAddItem from './dialogAddItemPurchaseOrder';
import TableLayoutDetail from 'components/TableLayoutDetailGudang';

const LabelToPrint = forwardRef(function LabelToPrint({data}, ref) {
  return (
    <div ref={ref} className='printableContent'>
      {/* 1cm = 37.8px */}
      {/* 1 mm: 3,78px  */}
      {/* def - w: 189px. h: 75.6px */}
      <div className='flex'>
        <div
          className='flex px-4 pb-6'
          style={{
            width: '189px',
            height: '75.2px',
            flexDirection: 'column',
            fontSize: '9px',
          }}
        >
          <div>
            {data.nomor_po.length > 28
              ? data.nomor_po.substring(0, 28) + '...'
              : data.nomor_po}
          </div>
          <div className='mt-auto'>
            <span className='font-w-600'>TGL PO: </span>
            {formatLabelDate(data.tanggal_po) || '-'}
          </div>
        </div>
        <div
          className='font-10 flex px-4 pb-6'
          style={{
            width: '189px',
            height: '75.2px',
            flexDirection: 'column',
            fontSize: '9px',
            marginLeft: '7.56px',
          }}
        >
          <div>
            {data.nomor_po.length > 28
              ? data.nomor_po.substring(0, 28) + '...'
              : data.nomor_po}
          </div>
          <div className='mt-auto'>
            <span className='font-w-600'>TGL PO: </span>
            {formatLabelDate(data.tanggal_po) || '-'}
          </div>
        </div>
      </div>
    </div>
  );
});

const CheckupToPrint = forwardRef(function CheckupToPrint({data}, ref) {
  return (
    <div ref={ref} className='printableContent'>
      <div className='m-8'>
        <div className='font-w-600'>
          <div className='font-18'>RSU MITRA PARAMEDIKA</div>
          <div style={{maxWidth: '250px'}}>
            Jl. Raya Ngemplak, Kemasan, Widodomartani, Ngemplak, Sleman
          </div>
        </div>
        <div className='font-w-600 mt-24'>{data.jenis_po || '-'}</div>
      </div>
    </div>
  );
});

const FormPurchaseOrder = ({
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

  const detailPoTableHead = [
    {
      id: 'kode_item',
      label: 'Kode Item',
    },
    {
      id: 'nama_item',
      label: 'Nama Item',
    },
    {
      id: 'jumlah',
      label: 'Jumlah',
    },
    {
      id: 'sediaan',
      label: 'Sediaan',
    },
  ];

  const dataDetailFormatHandler = (payload) => {
    const result = payload.map((e) => {
      return {
        kode_item: e.item.kode || 'null',
        nama_item: e.item.name,
        jumlah: e.jumlah || 'null',
        sediaan: e.sediaan.name || 'null',
        id: e,
      };
    });
    return result;
  };

  const handleIsEditingMode = (e) => {
    setIsEditingMode(e.target.checked);
  };

  const purchaseOrderInitialValues = !isEditType
    ? {
        potype: {kode: '', name: ''},
        nomor_po: '',
        tanggal_po: null,
        supplier: {id: '', name: ''},
        gudang: {id: '', name: ''},
        keterangan: '',
        purchase_order_detail: [],
      }
    : prePopulatedDataForm;

  const createPurchaseOrderSchema = Yup.object({
    potype: Yup.object({
      kode: stringSchema('Jenis Surat', true),
    }),
    nomor_po: Yup.string(),
    tanggal_po: Yup.date()
      .transform(function (value, originalValue) {
        if (this.isType(value)) {
          return value;
        }
        const result = parse(originalValue, 'dd/MM/yyyy', new Date());
        return result;
      })
      .typeError('Tanggal PO tidak valid')
      .min('2023-01-01', 'Tanggal PO tidak valid')
      .required('Tanggal PO wajib diisi'),
    supplier: Yup.object({
      id: stringSchema('Supplier', true),
    }),
    gudang: Yup.object({
      id: stringSchema('Gudang', true),
    }),
    // keterangan: Yup.string(),
    purchase_order_detail: Yup.array(),
  });

  const createPurchaseOrderValidation = useFormik({
    initialValues: purchaseOrderInitialValues,
    validationSchema: createPurchaseOrderSchema,
    enableReinitialize: true,
    onSubmit: async (values, {resetForm, setFieldError}) => {
      let messageContext = isEditType ? 'diperbarui' : 'ditambahkan';
      let data = {...values};
      data.purchase_order_detail = convertDataDetail(
        data.purchase_order_detail
      );
      data = {
        ...data,
        potype: data.potype.kode,
        tanggal_po: formatIsoToGen(data.tanggal_po),
        supplier: data.supplier.id,
        gudang: data.gudang.name,
      };
      console.log(data);
      try {
        let response;
        if (!isEditType) {
          const formattedData = filterFalsyValue({...data});
          response = await createPurchaseOrder(formattedData);
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
          message: `"Pesanan ${data.potype.name}" berhasil ${messageContext}!`,
        });

        resetForm();
        router.push('/gudang/purchase-order');
      } catch (error) {
        if (Object.keys(error.errorValidationObj).length >= 1) {
          for (let key in error.errorValidationObj) {
            setFieldError(key, error.errorValidationObj[key][0]);
          }
        }
        setSnackbar({
          state: true,
          type: 'error',
          message: `Terjadi kesalahan, "Pesanan ${data.potype.name}" gagal ${messageContext}!`,
        });
      }
    },
  });

  const createDetailDataHandler = (payload) => {
    let tempData = [
      ...createPurchaseOrderValidation.values.purchase_order_detail,
    ];
    const isAvailable = tempData.findIndex(
      (data) =>
        data.item.id === payload.item.id &&
        data.sediaan.id === payload.sediaan.id
    );
    if (isAvailable !== -1) {
      tempData[isAvailable] = payload;
    } else {
      tempData.push(payload);
    }
    createPurchaseOrderValidation.setFieldValue(
      'purchase_order_detail',
      tempData
    );
    setDataDetail(dataDetailFormatHandler(tempData));
  };

  const deleteDetailDataHandler = (index) => {
    let tempData = [
      ...createPurchaseOrderValidation.values.purchase_order_detail,
    ];
    if (index >= 0 && index < tempData.length) {
      tempData.splice(index, 1);
      createPurchaseOrderValidation.setFieldValue(
        'purchase_order_detail',
        tempData
      );
      setDataDetail(dataDetailFormatHandler(tempData));
    }
  };

  useEffect(() => {
    if (!isEditType) {
      const nomor_po = '';
      if (
        createPurchaseOrderValidation.values.potype.kode != '' &&
        createPurchaseOrderValidation.values.tanggal_po != null
      ) {
        const year = formatIsoToGen(
          createPurchaseOrderValidation.values.tanggal_po
        ).substring(0, 4);
        const potype = createPurchaseOrderValidation.values.potype;
        nomor_po = `${potype.kode}${year}${String(
          potype.state_number + 1
        ).padStart(6, '0')}`;
      }
      createPurchaseOrderValidation.setFieldValue('nomor_po', nomor_po);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    createPurchaseOrderValidation.values.potype,
    createPurchaseOrderValidation.values.tanggal_po,
  ]);

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
        <form onSubmit={createPurchaseOrderValidation.handleSubmit}>
          <FocusError formik={createPurchaseOrderValidation} />
          <div className='p-16'>
            <Grid container spacing={0}>
              <Grid item xs={12} md={6}>
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <Typography variant='h1 font-w-600'>Jenis Surat</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <div className='mb-16'>
                      <SelectAsync
                        id='potype'
                        labelField='Jenis Surat'
                        labelOptionRef='name'
                        valueOptionRef='kode'
                        handlerRef={createPurchaseOrderValidation}
                        handlerFetchData={getPoType}
                        handlerOnChange={(value) => {
                          if (value) {
                            createPurchaseOrderValidation.setFieldValue(
                              'potype',
                              value
                            );
                          } else {
                            createPurchaseOrderValidation.setFieldValue(
                              'potype',
                              {
                                kode: '',
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
                    <Typography variant='h1 font-w-600'>Tanggal PO</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <div className='mb-16'>
                      <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            id='tanggal_po'
                            name='tanggal_po'
                            label='Tanggal PO'
                            inputFormat='dd-MM-yyyy'
                            mask='__-__-____'
                            value={
                              createPurchaseOrderValidation.values.tanggal_po
                                ? formatGenToIso(
                                    createPurchaseOrderValidation.values
                                      .tanggal_po
                                  )
                                : null
                            }
                            onChange={(newValue) => {
                              createPurchaseOrderValidation.setFieldValue(
                                'tanggal_po',
                                newValue
                              );
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                error={
                                  createPurchaseOrderValidation.touched
                                    .tanggal_po &&
                                  Boolean(
                                    createPurchaseOrderValidation.errors
                                      .tanggal_po
                                  )
                                }
                                helperText={
                                  createPurchaseOrderValidation.touched
                                    .tanggal_po &&
                                  createPurchaseOrderValidation.errors
                                    .tanggal_po
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
                    <Typography variant='h1 font-w-600'>Nomor PO</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <div className='mb-16'>
                      <TextField
                        fullWidth
                        id='nomor_po'
                        name='nomor_po'
                        label='Nomor PO'
                        value={createPurchaseOrderValidation.values.nomor_po}
                        onChange={createPurchaseOrderValidation.handleChange}
                        error={
                          createPurchaseOrderValidation.touched.nomor_po &&
                          Boolean(createPurchaseOrderValidation.errors.nomor_po)
                        }
                        helperText={
                          createPurchaseOrderValidation.touched.nomor_po &&
                          createPurchaseOrderValidation.errors.nomor_po
                        }
                        disabled
                      />
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <Typography variant='h1 font-w-600'>Supplier</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <div className='mb-16'>
                      <SelectAsync
                        id='supplier'
                        labelField='Supplier'
                        labelOptionRef='name'
                        valueOptionRef='id'
                        handlerRef={createPurchaseOrderValidation}
                        handlerFetchData={getSupplier}
                        handlerOnChange={(value) => {
                          if (value) {
                            createPurchaseOrderValidation.setFieldValue(
                              'supplier',
                              value
                            );
                          } else {
                            createPurchaseOrderValidation.setFieldValue(
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
                    <Typography variant='h1 font-w-600'>Gudang</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <div className='mb-16'>
                      <SelectAsync
                        id='gudang'
                        labelField='Gudang'
                        labelOptionRef='name'
                        valueOptionRef='id'
                        handlerRef={createPurchaseOrderValidation}
                        handlerFetchData={jenisGudang}
                        handlerOnChange={(value) => {
                          if (value) {
                            createPurchaseOrderValidation.setFieldValue(
                              'gudang',
                              value
                            );
                          } else {
                            createPurchaseOrderValidation.setFieldValue(
                              'gudang',
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
                    <Typography variant='h1 font-w-600'>Keterangan</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <div className='mb-16'>
                      <TextField
                        fullWidth
                        id='keterangan'
                        name='keterangan'
                        label='Keterangan'
                        multiline
                        rows={3}
                        value={createPurchaseOrderValidation.values.keterangan}
                        onChange={createPurchaseOrderValidation.handleChange}
                        error={
                          createPurchaseOrderValidation.touched.keterangan &&
                          Boolean(
                            createPurchaseOrderValidation.errors.keterangan
                          )
                        }
                        helperText={
                          createPurchaseOrderValidation.touched.keterangan &&
                          createPurchaseOrderValidation.errors.keterangan
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
              isDelete
              btnAddHandler={setIsDialogItem}
              tableHead={detailPoTableHead}
              data={dataDetail}
              // isUpdatingData={isUpdatingDataRawatJalan}
              deleteData={deleteDetailDataHandler}
              // createData={createDetailDataHandler}
            />

            <DialogAddItem
              state={isDialogItem}
              setState={setIsDialogItem}
              createData={createDetailDataHandler}
            />

            <div className='flex justify-end items-center mt-16'>
              {isEditType && (
                <>
                  <div className='mr-auto text-grey-text'>
                    <p className='font-14 font-w-600 m-0 p-0'>
                      {detailPrePopulatedData?.nomor_po},{' '}
                    </p>
                    <p className='font-12 font-w-600 m-0 p-0'>
                      Nomor PO:{' '}
                      {detailPrePopulatedData?.nomor_po || 'Tidak tersedia'}
                    </p>
                    <p className='font-12 font-w-600 m-0 p-0'>
                      Dibuat pada:
                      {formatReadable(detailPrePopulatedData?.updated_at)}
                    </p>
                    <p className='font-12 font-w-600 m-0 p-0'>
                      Perubahan terakhir:
                      {formatReadable(detailPrePopulatedData?.updated_at)}
                    </p>
                  </div>
                  <div className='mr-auto flex'>
                    <div className='mr-8'>
                      <ReactToPrint
                        trigger={() => (
                          <Button variant='outlined' startIcon={<PrintIcon />}>
                            Cetak Label
                          </Button>
                        )}
                        content={() => labelPrintRef.current}
                      />
                      <LabelToPrint
                        data={{
                          nomor_po: detailPrePopulatedData.nomor_po,
                          tanggal_po: detailPrePopulatedData.tanggal_po,
                        }}
                        ref={labelPrintRef}
                      />
                    </div>
                    <div>
                      <ReactToPrint
                        trigger={() => (
                          <Button variant='outlined' startIcon={<PrintIcon />}>
                            Cetak Kartu Periksa
                          </Button>
                        )}
                        content={() => checkupPrintRef.current}
                      />
                      <CheckupToPrint
                        data={{
                          no_rm: detailPrePopulatedData.nomor_po,
                        }}
                        ref={checkupPrintRef}
                      />
                    </div>
                  </div>
                </>
              )}
              <Button
                type='button'
                variant='outlined'
                startIcon={<BackIcon />}
                sx={{marginRight: 2}}
                onClick={() => router.push('/gudang/purchase-order')}
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
                      createPurchaseOrderValidation.initialValues
                    ) ===
                      JSON.stringify(createPurchaseOrderValidation.values) ||
                    !isActionPermitted('purchaseOrder:update') ||
                    (isEditType && !isEditingMode)
                  }
                  startIcon={<SaveIcon />}
                  loadingPosition='start'
                  loading={createPurchaseOrderValidation.isSubmitting}
                >
                  Simpan perubahan
                </LoadingButton>
              ) : (
                <LoadingButton
                  type='submit'
                  variant='contained'
                  disabled={!isActionPermitted('purchaseOrder:store')}
                  startIcon={<DoneIcon />}
                  loadingPosition='start'
                  loading={createPurchaseOrderValidation.isSubmitting}
                >
                  Simpan Purchase Order
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

export default FormPurchaseOrder;
