import {useState, useEffect, useRef, forwardRef} from 'react';
import {useRouter} from 'next/router';
import Image from 'next/image';
import LoaderOnLayout from 'components/LoaderOnLayout';
import FormPasien from 'components/modules/pasien/form';
import {convertNumberToWords} from 'utils/formatNumber';
import getStaticData from 'utils/getStaticData';
import {getDetailPurchaseOrder} from 'api/gudang/purchase-order';
import TableLayout from 'pages/pasien/TableLayout';
import {formatReadable, formatSuratDate} from 'utils/formatTime';
import BackIcon from '@material-ui/icons/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import {
  Grid,
  Card,
  Avatar,
  Typography,
  Divider,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import ReactToPrint from 'react-to-print';
import {Paper} from '@material-ui/core';
import TableLayoutDetail from 'components/TableLayoutDetailGudang';
import DialogEditItem from 'components/modules/gudang/dialogEditItem';

const Detail = () => {
  const router = useRouter();
  const {slug} = router.query;
  // const [dataPurchaseOrder, setDataPurchaseOrder] = useState({});
  const [detailDataPurchaseOrder, setDetailDataPurchaseOrder] = useState([]);
  const [dataPurchaseOrder, setDataPurchaseOrder] = useState({});
  const [isLoadingDataPurchaseOrder, setIsLoadingDataPurchaseOrder] =
    useState(true);

  const [isEditingMode, setIsEditingMode] = useState(false);
  const [dataDetail, setDataDetail] = useState([]);
  const [isDialogItem, setIsDialogItem] = useState(false);

  const generalConsentPrintRef = useRef();

  const handleIsEditingMode = (e) => {
    setIsEditingMode(e.target.checked);
  };

  const deleteDetailDataHandler = (payload) => {
    let tempData = dataDetail.filter((data) => data.id == payload);
    // const result = dataDetailFormatHandler(createPurchaseOrderValidation.values.purchase_order_detail);
    // createPurchaseOrderValidation.setFieldValue("purchase_order_detail", ...tempData);
    // console.log(result);
    setDataDetail(tempData);
  };

  const detailPurchaseOrderTableHead = [
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
        nama_item: e.item.name || 'null',
        jumlah: e.jumlah || 'null',
        sediaan: e.sediaan.name || 'null',
        id: e,
      };
    });
    return result;
  };

  const GeneralConsentToPrint = forwardRef(function GeneralConsentToPrint(
    {data},
    ref
  ) {
    return (
      <div ref={ref} className='printableContent'>
        <div className='m-8' style={{color: 'black'}}>
          <div className='full-width'>
            <div className='flex'>
              <div
                className='p-10 flex justify-center items-center'
                style={{width: '20%'}}
              >
                <Image
                  src='/icons/logo.png'
                  width={120}
                  height={120}
                  alt='rsmp'
                />
              </div>
              <div className='p-12' style={{width: '100%'}}>
                <div className='font-w-600'>
                  <div className='font-30'>RSU MITRA PARAMEDIKA</div>
                  <div className='font-20' style={{color: 'gray'}}>
                    Jln. Raya Ngemplak, Kemasan Widodomartani, Ngemplak, Sleman
                    55584 Telp. (0274) 4461098
                  </div>
                </div>
              </div>
            </div>
            <Divider sx={{borderWidth: '1px', borderColor: 'black'}} />
            <div className='flex mb-12 mt-12' style={{flexDirection: 'column'}}>
              <div className='flex'>
                <div className='pl-8' style={{flex: 0.8}}>
                  No. SP
                </div>
                <div style={{flex: 6.2}}>: {dataPurchaseOrder?.nomor_po}</div>
              </div>
            </div>
            <div
              className='py-12 font-w-700 font-22'
              style={{textAlign: 'center', textDecoration: 'underline'}}
            >
              SURAT PESANAN {dataPurchaseOrder?.potype.name.toUpperCase()}
            </div>
            <div className='py-4 pl-8'>Yang bertanda tangan di bawah ini :</div>
            <div className='flex mb-12' style={{flexDirection: 'column'}}>
              <div className='flex'>
                <div className='ml-40' style={{flex: 0.6}}>
                  Nama
                </div>
                <div style={{flex: 2.2}}>
                  : Marisza Tri Nugraheni, S.Farm., Apt.
                </div>
              </div>
              <div className='flex'>
                <div className='ml-40' style={{flex: 0.6}}>
                  Jabatan
                </div>
                <div style={{flex: 2.2}}>
                  : Ka. Instalasi Farmasi RSU Mitra Paramedika
                </div>
              </div>
              <div className='flex'>
                <div className='ml-40' style={{flex: 0.6}}>
                  No. SIPA
                </div>
                <div style={{flex: 2.2}}>: 446/0568/597/VII-24</div>
              </div>
              <div className='flex'>
                <div className='ml-40' style={{flex: 0.6}}>
                  Alamat
                </div>
                <div style={{flex: 2.2}}>
                  : Padasan, Pakembinangun, Pakem, Sleman, Yogyakarta
                </div>
              </div>
            </div>
            <div className='mt-10 py-4 pl-8'>
              Mengajukan pesanan {dataPurchaseOrder?.potype.name} kepada :
            </div>
            <div className='flex mb-12' style={{flexDirection: 'column'}}>
              <div className='flex'>
                <div className='ml-40' style={{flex: 0.6}}>
                  Nama Distributor
                </div>
                <div style={{flex: 2.2}}>
                  : {dataPurchaseOrder?.supplier.name}
                </div>
              </div>
              <div className='flex'>
                <div className='ml-40' style={{flex: 0.6}}>
                  Alamat dan No. Telp.
                </div>
                <div style={{flex: 2.2}}>
                  : {dataPurchaseOrder?.supplier.address}{' '}
                  {dataPurchaseOrder?.supplier.telp}
                </div>
              </div>
            </div>
            <div className='mt-10 py-4 pl-8'>Sebagai berikut :</div>
            <div className='p-16'>
              <TableContainer>
                <Table size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{fontWeight: 'bold'}}>No</TableCell>
                      {/* <TableCell sx={{fontWeight: 'bold'}}>Kode Item</TableCell> */}
                      <TableCell sx={{fontWeight: 'bold'}}>Nama Item</TableCell>
                      {/* <TableCell sx={{fontWeight: 'bold'}}>Sediaan</TableCell> */}
                      {dataPurchaseOrder?.potype.name === 'Prekusor' ? (
                        <TableCell sx={{fontWeight: 'bold'}}>
                          Zat Aktif
                        </TableCell>
                      ) : null}
                      {dataPurchaseOrder?.potype.name ===
                        'Obat Obat Tertentu' ||
                      dataPurchaseOrder?.potype.name === 'Psikotropika' ||
                      dataPurchaseOrder?.potype.name === 'Narkotika' ||
                      dataPurchaseOrder?.potype.name === 'Prekusor' ? (
                        <TableCell sx={{fontWeight: 'bold'}}>
                          Kekuatan/Potensi
                        </TableCell>
                      ) : null}
                      <TableCell sx={{fontWeight: 'bold'}}>Jumlah</TableCell>
                      <TableCell sx={{fontWeight: 'bold'}}>Satuan</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {detailDataPurchaseOrder.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        {/* <TableCell>{row.kode_item}</TableCell> */}
                        <TableCell>{row.nama_item}</TableCell>
                        {/* <TableCell>{row.sediaan}</TableCell> */}
                        {dataPurchaseOrder?.potype.name === 'Prekusor' ? (
                          <TableCell></TableCell>
                        ) : null}
                        {dataPurchaseOrder?.potype.name ===
                          'Obat Obat Tertentu' ||
                        dataPurchaseOrder?.potype.name === 'Psikotropika' ||
                        dataPurchaseOrder?.potype.name === 'Narkotika' ||
                        dataPurchaseOrder?.potype.name === 'Prekusor' ? (
                          <TableCell></TableCell>
                        ) : null}
                        <TableCell>
                          {row.jumlah}
                          {' ('}
                          {convertNumberToWords(row.jumlah)}
                          {')'}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <div className='mt-20 py-4 pl-8'>
              Yang akan digunakan untuk keperluan:
            </div>
            <div className='flex mb-20' style={{flexDirection: 'column'}}>
              <div className='flex'>
                <div className='ml-40' style={{flex: 0.6}}>
                  Nama Sarana
                </div>
                <div style={{flex: 2.2}}>: RSU Mitra Paramedika</div>
              </div>
              <div className='flex'>
                <div className='ml-40' style={{flex: 0.6}}>
                  Alamat Sarana
                </div>
                <div style={{flex: 2.2}}>
                  : Jln. Raya Ngemplak, Kemasan, Widodomartani, Ngemplak, Sleman
                </div>
              </div>
              <div className='flex'>
                <div className='ml-40' style={{flex: 0.6}}>
                  No. Ijin RS
                </div>
                <div style={{flex: 2.2}}>: 503/9839/37/DKS/2019</div>
              </div>
            </div>
            <div className='flex'>
              <div className='py-8' style={{flex: 1}}></div>
              <div className='py-8 pl-8 flex' style={{flex: 1}}>
                <div style={{flex: 1, textAlign: 'center'}}>
                  Sleman, {formatSuratDate(dataPurchaseOrder?.tanggal_po)}
                </div>
              </div>
            </div>
            <div className='flex'>
              <div className='py-8' style={{flex: 1}}>
                <div style={{textAlign: 'center'}}></div>
                <div style={{height: '120px'}}></div>
                <div className='px-8'></div>
              </div>
              <div className='pl-8 py-8' style={{flex: 1}}>
                <div style={{textAlign: 'center'}}>Pemesan,</div>
                <div style={{height: '120px'}}></div>
                <div className='px-8'>
                  <div style={{textAlign: 'center'}}>
                    Marisza Tri Nugraheni, S.Farm., Apt.
                  </div>
                  <div style={{borderBottom: '1px solid black'}}></div>
                  <div style={{textAlign: 'center'}}>
                    SIPA No. 446/0568/597/VII-24
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });

  const GeneralConsent = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginRight: '20px',
        marginTop: '20px',
      }}
    >
      <ReactToPrint
        trigger={() => (
          <Button
            variant='contained'
            startIcon={<PrintIcon />}
            sx={{marginTop: 1}}
            // disabled={!isPermitted('store')}
            // onClick={() => btnAddHandler(true)}
          >
            Cetak
          </Button>
        )}
        content={() => generalConsentPrintRef.current}
      />
      <GeneralConsentToPrint
        data={detailDataPurchaseOrder}
        ref={generalConsentPrintRef}
      />
    </div>
  );

  useEffect(() => {
    if (router.isReady) {
      (async () => {
        try {
          const response = await getDetailPurchaseOrder({id: slug[0]});
          const data = response.data.data;
          setDataPurchaseOrder(data); // setDetailPO pakai data dari resnpose API
          const formattedData = dataDetailFormatHandler(
            data.purchase_order_detail
          ); // format data untuk error handling
          setDetailDataPurchaseOrder(formattedData); // setDataPO pakai data yang diformat di atas
          console.log('Fetched Data:', data);
          // const purchaseOrderDetails = data.purchase_order_detail || []; // ambil data detail PO jika nggak ada maka array kosong
          // console.log('Purchase Order Details:', purchaseOrderDetails);
          // setRows(purchaseOrderDetails);
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
                  <Avatar
                    src='/icons/supplier.png'
                    variant='rounded'
                    sx={{width: 250, height: 250, marginRight: 2}}
                  />
                  <div className='ml-8 mt-8'>
                    <Grid container spacing={2}>
                      <Grid item xs={3}>
                        <Typography variant='h1 font-w-700'>
                          Nomor Purchase Order
                        </Typography>
                      </Grid>
                      <Grid item md={7} sm={12}>
                        <div>
                          {' : '}
                          {dataPurchaseOrder?.nomor_po}
                        </div>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant='h1 font-w-700'>
                          Jenis Surat
                        </Typography>
                      </Grid>
                      <Grid item md={7} sm={12}>
                        <div>
                          {' : '}
                          {dataPurchaseOrder?.potype.name}
                        </div>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant='h1 font-w-700'>
                          Tanggal Purchase Order
                        </Typography>
                      </Grid>
                      <Grid item md={7} sm={12}>
                        <div>
                          {' : '}
                          {formatReadable(dataPurchaseOrder?.tanggal_po)}
                        </div>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant='h1 font-w-700'>
                          Keterangan
                        </Typography>
                      </Grid>
                      <Grid item md={7} sm={12}>
                        <div>
                          {' : '}
                          {dataPurchaseOrder?.keterangan}
                        </div>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant='h1 font-w-700'>
                          Nama Supplier
                        </Typography>
                      </Grid>
                      <Grid item md={7} sm={12}>
                        <div>
                          {' : '}
                          {dataPurchaseOrder?.supplier.name}
                        </div>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant='h1 font-w-700'>Telepon</Typography>
                      </Grid>
                      <Grid item md={7} sm={12}>
                        <div>
                          {' : '}
                          {dataPurchaseOrder?.supplier.telp}
                        </div>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant='h1 font-w-700'>Alamat</Typography>
                      </Grid>
                      <Grid item md={7} sm={12}>
                        <div>
                          {' : '}
                          {dataPurchaseOrder?.supplier.address}
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </div>

              {GeneralConsent}

              <Divider sx={{borderWidth: '1px', marginTop: 2}} />

              <div className='mt-10 p-16'>
                <TableLayoutDetail
                  baseRoutePath={`${router.asPath}`}
                  title='Item'
                  // isBtnCetak
                  // customBtnCetakTitle = 'Cetak'
                  tableHead={detailPurchaseOrderTableHead}
                  data={detailDataPurchaseOrder}
                  // btnEditHandler={setIsDialogItem}
                  // isUpdatingData={isUpdatingDataRawatJalan}
                  // deleteData={deleteDetailDataHandler}
                  // createData={createDetailDataHandler}
                />

                <DialogEditItem
                  state={isDialogItem}
                  setState={setIsDialogItem}
                  // createData={createDetailDataHandler}
                />
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
              </div>
            </Card>
          </Paper>
        </>
      )}
    </>
  );
};

export default Detail;
