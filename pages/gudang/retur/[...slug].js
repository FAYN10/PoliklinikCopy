import {useState, useEffect, useRef, forwardRef} from 'react';
import {useRouter} from 'next/router';
import Image from 'next/image';
import LoaderOnLayout from 'components/LoaderOnLayout';
import FormPasien from 'components/modules/pasien/form';
import {formatGenToIso} from 'utils/formatTime';
import getStaticData from 'utils/getStaticData';
import {getDetailRetur} from 'api/gudang/retur';
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
  // const [dataRetur, setDataRetur] = useState({});
  const [detailDataRetur, setDetailDataRetur] = useState([]);
  const [dataRetur, setDataRetur] = useState({});
  const [isLoadingDataRetur, setIsLoadingDataRetur] = useState(true);
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
      id: 'jumlah_stok',
      label: 'Jumlah Stok',
    },
    {
      id: 'jumlah_retur',
      label: 'Jumlah Retur',
    },
    {
      id: 'sediaan',
      label: 'Sediaan',
    },
    {
      id: 'alasan',
      label: 'Alasan',
    },
  ];

  const dataDetailFormatHandler = (payload) => {
    const result = payload.map((e) => {
      return {
        kode_item: e.gudang.item.kode || 'null',
        nama_item: e.gudang.item.name || 'null',
        jumlah_stok: e.gudang.stok || 'null',
        jumlah_retur: e.jumlah || 'null',
        sediaan: e.gudang.item.sediaan.name || 'null',
        alasan: e.alasan || 'null',
        id: e,
      };
    });
    return result;
  };

  useEffect(() => {
    if (router.isReady) {
      (async () => {
        try {
          const response = await getDetailRetur({id: slug[0]});
          const data = response.data.data;
          setDataRetur(data); // setDataPO pakai data yang diformat di atas
          const formattedData = dataDetailFormatHandler(data.retur_detail); // format data untuk error handling
          setDetailDataRetur(formattedData); // setDetailPO pakai data dari resnpose API
          console.log('Fetched Data:', data);
          // const ReturDetails = data.retur_detail || []; // ambil data detail PO jika nggak ada maka array kosong
          // console.log('Retur Details:', ReturDetails);
          // setRows(ReturDetails);
        } catch (error) {
          console.log('Error fetching data:', error);
        } finally {
          setIsLoadingDataRetur(false);
        }
      })();
    }
  }, [router.isReady, slug]);

  return (
    <>
      {isLoadingDataRetur ? (
        <LoaderOnLayout />
      ) : (
        <>
          <Paper>
            <Card className='py-12 mb-16'>
              <div className='px-14 flex justify-between items-start'>
                <div className='flex items-start'>
                  <Avatar
                    src='/icons/retur.png'
                    variant='rounded'
                    sx={{width: 250, height: 250, marginRight: 2}}
                  />
                  <div className='ml-8 mt-8'>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant='h1 font-w-700'>
                          Nomor Retur
                        </Typography>
                      </Grid>
                      <Grid item md={7} sm={12}>
                        <div>
                          {' : '}
                          {dataRetur?.nomor_retur}
                        </div>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant='h1 font-w-700'>
                          Nomor Faktur
                        </Typography>
                      </Grid>
                      <Grid item md={7} sm={12}>
                        <div>
                          {' : '}
                          {dataRetur?.receive.nomor_faktur}
                        </div>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant='h1 font-w-700'>
                          Tanggal Retur
                        </Typography>
                      </Grid>
                      <Grid item md={7} sm={12}>
                        <div>
                          {' : '}
                          {formatReadable(dataRetur?.tanggal_retur)}
                        </div>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant='h1 font-w-700'>
                          Nama Supplier
                        </Typography>
                      </Grid>
                      <Grid item md={7} sm={12}>
                        <div>
                          {' : '}
                          {dataRetur?.receive.purchase_order.supplier.name}
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </div>

              <Divider sx={{borderWidth: '1px', marginTop: 2}} />

              <div className='mt-32 p-16'>
                <TableLayoutDetail
                  baseRoutePath={`${router.asPath}`}
                  title='Item'
                  tableHead={detailReturTableHead}
                  data={detailDataRetur}
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
                  onClick={() => router.push('/gudang/retur')}
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
