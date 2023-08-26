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
import DialogAddItem from './dialogAddItemMutasi';
import TableLayoutDetail from 'components/TableLayoutDetailGudang';
import {getUnit} from 'api/unit';

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

const FormMutasi = ({
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

  const detailMutasiTableHead = [
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
      label: 'Jumlah Permintaan',
    },
    {
      id: 'jumlah_pengadaan',
      label: 'Jumlah Pengadaan',
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
        nomor_batch: e.nomor_batch || 'null',
        jumlah: e.jumlah || 'null',
        jumlah_pengadaan: e.jumlah_pengadaan || 'null',
        sediaan: e.sediaan.name || 'null',
        id: e,
      };
    });
    return result;
  };

  const handleIsEditingMode = (e) => {
    setIsEditingMode(e.target.checked);
  };

  const mutasiInitialValues = !isEditType
    ? {
        tanggal_permintaan: null,
        tanggal_mutasi: null,
        unit: {id: '', name: ''},
        mutation_detail: [],
      }
    : prePopulatedDataForm;

  const createMutasiSchema = Yup.object({
    tanggal_permintaan: Yup.date()
      .transform(function (value, originalValue) {
        if (this.isType(value)) {
          return value;
        }
        const result = parse(originalValue, 'dd/MM/yyyy', new Date());
        return result;
      })
      .typeError('Tanggal permintaan tidak valid')
      .min('2023-01-01', 'Tanggal permintaan tidak valid')
      .required('Tanggal permintaan wajib diisi'),
    unit: Yup.object({
      id: stringSchema('Unit', true),
    }),
    mutation_detail: Yup.array(),
  });

  const createMutasiValidation = useFormik({
    initialValues: mutasiInitialValues,
    validationSchema: createMutasiSchema,
    enableReinitialize: true,
    onSubmit: async (values, {resetForm, setFieldError}) => {
      let messageContext = isEditType ? 'diperbarui' : 'ditambahkan';
      let data = {...values};
      data.mutation_detail = convertDataDetail(data.mutation_detail);
      data = {
        ...data,
        tanggal_permintaan: formatIsoToGen(data.tanggal_permintaan),
        tanggal_mutasi: formatIsoToGen(data.tanggal_mutasi),
        unit: data.unit.id,
      };
      console.log(data);
      try {
        let response;
        if (!isEditType) {
          const formattedData = filterFalsyValue({...data});
          response = await createMutasi(formattedData);
          resetForm();
          router.push('/gudang/mutasi');
        } else {
          await updateMutasi({
            ...formattedData,
            id: detailPrePopulatedData.id,
          });
          response = await getDetailMutasi({
            id: detailPrePopulatedData.id,
          });
          updatePrePopulatedData({...response.data.data});
        }
        setSnackbar({
          state: true,
          type: 'success',
          message: `"${data.nomor_po}" berhasil ${messageContext}!`,
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
          message: `Terjadi kesalahan, "${data.unit.name}" gagal ${messageContext}!`,
        });
      }
    },
  });

  const createDetailDataHandler = (payload) => {
    let tempData = [...createMutasiValidation.values.mutation_detail];
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
    createMutasiValidation.setFieldValue('mutation_detail', tempData);
    setDataDetail(dataDetailFormatHandler(tempData));
  };

  const deleteDetailDataHandler = (index) => {
    let tempData = [...createMutasiValidation.values.mutation_detail];
    if (index >= 0 && index < tempData.length) {
      tempData.splice(index, 1);
      createMutasiValidation.setFieldValue('mutation_detail', tempData);
      setDataDetail(dataDetailFormatHandler(tempData));
    }
  };

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
        <form onSubmit={createMutasiValidation.handleSubmit}>
          <FocusError formik={createMutasiValidation} />
          <div className='p-16'>
            <Grid container spacing={0}>
              <Grid item xs={12} md={6}>
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <Typography variant='h1 font-w-600'>
                      Tanggal Permintaan
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <div className='mb-16'>
                      <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            id='tanggal_permintaan'
                            name='tanggal_permintaan'
                            label='Tanggal Permintaan'
                            inputFormat='dd-MM-yyyy'
                            mask='__-__-____'
                            value={
                              createMutasiValidation.values.tanggal_permintaan
                                ? formatGenToIso(
                                    createMutasiValidation.values
                                      .tanggal_permintaan
                                  )
                                : null
                            }
                            onChange={(newValue) => {
                              createMutasiValidation.setFieldValue(
                                'tanggal_permintaan',
                                newValue
                              );
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                error={
                                  createMutasiValidation.touched
                                    .tanggal_permintaan &&
                                  Boolean(
                                    createMutasiValidation.errors
                                      .tanggal_permintaan
                                  )
                                }
                                helperText={
                                  createMutasiValidation.touched
                                    .tanggal_permintaan &&
                                  createMutasiValidation.errors
                                    .tanggal_permintaan
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
                    <Typography variant='h1 font-w-600'>
                      Tanggal Mutasi
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <div className='mb-16'>
                      <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            id='tanggal_mutasi'
                            name='tanggal_mutasi'
                            label='Tanggal Mutasi'
                            inputFormat='dd-MM-yyyy'
                            mask='__-__-____'
                            value={
                              createMutasiValidation.values.tanggal_mutasi
                                ? formatGenToIso(
                                    createMutasiValidation.values.tanggal_mutasi
                                  )
                                : null
                            }
                            onChange={(newValue) => {
                              createMutasiValidation.setFieldValue(
                                'tanggal_mutasi',
                                newValue
                              );
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                error={
                                  createMutasiValidation.touched
                                    .tanggal_mutasi &&
                                  Boolean(
                                    createMutasiValidation.errors.tanggal_mutasi
                                  )
                                }
                                helperText={
                                  createMutasiValidation.touched
                                    .tanggal_mutasi &&
                                  createMutasiValidation.errors.tanggal_mutasi
                                }
                              />
                            )}
                            disabled
                          />
                        </LocalizationProvider>
                      </FormControl>
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <Typography variant='h1 font-w-600'>Unit</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <div className='mb-16'>
                      <SelectAsync
                        id='unit'
                        labelField='Unit'
                        labelOptionRef='name'
                        valueOptionRef='id'
                        handlerRef={createMutasiValidation}
                        handlerFetchData={getUnit}
                        handlerOnChange={(value) => {
                          if (value) {
                            createMutasiValidation.setFieldValue('unit', value);
                          } else {
                            createMutasiValidation.setFieldValue('unit', {
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
              tableHead={detailMutasiTableHead}
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
                onClick={() => router.push('/gudang/mutasi')}
              >
                Kembali
              </Button>
              {isEditType ? (
                <LoadingButton
                  type='submit'
                  variant='contained'
                  sx={{marginBottom: 1, marginRight: 2}}
                  disabled={
                    JSON.stringify(createMutasiValidation.initialValues) ===
                      JSON.stringify(createMutasiValidation.values) ||
                    !isActionPermitted('mutation:update') ||
                    (isEditType && !isEditingMode)
                  }
                  startIcon={<SaveIcon />}
                  loadingPosition='start'
                  loading={createMutasiValidation.isSubmitting}
                >
                  Simpan perubahan
                </LoadingButton>
              ) : (
                <LoadingButton
                  type='submit'
                  variant='contained'
                  disabled={!isActionPermitted('mutation:store')}
                  startIcon={<DoneIcon />}
                  loadingPosition='start'
                  loading={createMutasiValidation.isSubmitting}
                >
                  Simpan Mutasi
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

export default FormMutasi;
