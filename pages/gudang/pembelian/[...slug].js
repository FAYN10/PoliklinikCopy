import {useState, useEffect, useRef, forwardRef} from 'react';
import {useRouter} from 'next/router';
import Image from 'next/image';
import LoaderOnLayout from 'components/LoaderOnLayout';
import FormPasien from 'components/modules/pasien/form';
import {formatGenToIso} from 'utils/formatTime';
import getStaticData from 'utils/getStaticData';
import {getDetailPembelian} from 'api/gudang/pembelian';
import TableLayout from 'pages/pasien/TableLayout';
import {formatReadable} from 'utils/formatTime';
import BackIcon from '@material-ui/icons/ArrowBack';
import {Grid, Card, Avatar, Typography, Divider, Button} from '@mui/material';
import ReactToPrint from 'react-to-print';
import {Paper} from '@material-ui/core';
import TableLayoutDetail from 'components/TableLayoutDetailGudang';
import DialogEditItem from 'components/modules/gudang/dialogEditItem';

const Detail = () => {
  const router = useRouter();
  const {slug} = router.query;
  // const [dataPembelian, setDataPembelian] = useState({});
  const [detailDataPembelian, setDetailDataPembelian] = useState([]);
  const [dataPembelian, setDataPembelian] = useState({});
  const [isLoadingDataPembelian, setIsLoadingDataPembelian] = useState(true);
  const generalConsentPrintRef = useRef();

  const [isEditingMode, setIsEditingMode] = useState(false);
  const [dataDetail, setDataDetail] = useState([]);
  const [isDialogItem, setIsDialogItem] = useState(false);

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
      id: 'total',
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
        sediaan: e.item.sediaan.name || 'null',
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

  useEffect(() => {
    if (router.isReady) {
      (async () => {
        try {
          const response = await getDetailPembelian({id: slug[0]});
          const data = response.data.data;
          setDataPembelian(data);
          const formattedData = dataDetailFormatHandler(data.gudang); // format data untuk error handling
          setDetailDataPembelian(formattedData); // setDataPO pakai data yang diformat di atas
          console.log('Fetched Data:', data);
          // setDetailDataPembelian(data); // setDetailPO pakai data dari resnpose API
          // const PembelianDetails = data.receive_detail || []; // ambil data detail PO jika nggak ada maka array kosong
          // console.log('Pembelian Details:', PembelianDetails);
          // setRows(PembelianDetails);
        } catch (error) {
          console.log('Error fetching data:', error);
        } finally {
          setIsLoadingDataPembelian(false);
        }
      })();
    }
  }, [router.isReady, slug]);

  return (
    <>
      {isLoadingDataPembelian ? (
        <LoaderOnLayout />
      ) : (
        <>
          <Paper>
            <Card className='py-12 mb-16'>
              <div className='px-14 flex justify-between items-start'>
                <div className='flex items-start'>
                  <Avatar
                    src='/icons/receive.png'
                    variant='rounded'
                    sx={{width: 250, height: 250, marginRight: 2}}
                  />
                  <div className='ml-8 mt-8'>
                    <Grid container spacing={2}>
                      <Grid item xs={3}>
                        <Typography variant='h1 font-w-700'>
                          Nomor Faktur
                        </Typography>
                      </Grid>
                      <Grid item md={7} sm={12}>
                        <div>
                          {' : '}
                          {dataPembelian?.nomor_faktur}
                        </div>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant='h1 font-w-700'>
                          Nomor Purchase Order
                        </Typography>
                      </Grid>
                      <Grid item md={7} sm={12}>
                        <div>
                          {' : '}
                          {dataPembelian?.purchase_order.nomor_po}
                        </div>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant='h1 font-w-700'>
                          Tanggal Pembelian
                        </Typography>
                      </Grid>
                      <Grid item md={7} sm={12}>
                        <div>
                          {' : '}
                          {formatReadable(dataPembelian?.tanggal_pembelian)}
                        </div>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant='h1 font-w-700'>
                          Jatuh Tempo Pembayaran
                        </Typography>
                      </Grid>
                      <Grid item md={7} sm={12}>
                        <div>
                          {' : '}
                          {formatReadable(dataPembelian?.tanggal_jatuh_tempo)}
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
                          {dataPembelian?.purchase_order.supplier.name}
                        </div>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant='h1 font-w-700'>Telepon</Typography>
                      </Grid>
                      <Grid item md={7} sm={12}>
                        <div>
                          {' : '}
                          {dataPembelian?.purchase_order.supplier.telp}
                        </div>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant='h1 font-w-700'>Alamat</Typography>
                      </Grid>
                      <Grid item md={7} sm={12}>
                        <div>
                          {' : '}
                          {dataPembelian?.purchase_order.supplier.address}
                        </div>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant='h1 font-w-700'>PPN</Typography>
                      </Grid>
                      <Grid item md={7} sm={12}>
                        <div>
                          {' : '}
                          {dataPembelian?.ppn}
                          {'%'}
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </div>
              <Divider sx={{borderWidth: '1px', marginTop: 2}} />

              <TableLayoutDetail
                baseRoutePath={`${router.asPath}`}
                title='Item'
                tableHead={detailPembelianTableHead}
                data={detailDataPembelian}
                btnEditHandler={setIsDialogItem}
                // isUpdatingData={isUpdatingDataRawatJalan}
                // deleteData={deleteDetailDataHandler}
                // createData={createDetailDataHandler}
              />

              <DialogEditItem
                state={isDialogItem}
                setState={setIsDialogItem}
                // createData={createDetailDataHandler}
              />

              <div className='flex justify-end'>
                <Button
                  type='button'
                  variant='outlined'
                  startIcon={<BackIcon />}
                  sx={{marginBottom: 1, marginRight: 2}}
                  onClick={() => router.push('/gudang/pembelian')}
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
