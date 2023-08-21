import {useState, useEffect, useRef, forwardRef} from 'react';
import {useRouter} from 'next/router';
import Image from 'next/image';
import LoaderOnLayout from 'components/LoaderOnLayout';
import FormPasien from 'components/modules/pasien/form';
import {formatGenToIso} from 'utils/formatTime';
import getStaticData from 'utils/getStaticData';
import {getDetailPurchaseOrder} from 'api/gudang/purchase-order';
import TableLayout from 'pages/pasien/TableLayout';
import { formatReadable } from "utils/formatTime";
import BackIcon from '@material-ui/icons/ArrowBack';
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
} from '@mui/material';
import ReactToPrint from 'react-to-print';
import {Paper} from '@material-ui/core';
import TableLayoutDetail from 'components/TableLayoutDetail';
import DialogEditItem from 'components/modules/gudang/dialogEditItem';

const Detail = () => {
  const router = useRouter();
  const {slug} = router.query;
  // const [dataPurchaseOrder, setDataPurchaseOrder] = useState({});
  const [detailDataPurchaseOrder, setDetailDataPurchaseOrder] = useState([]);
  const [dataPurchaseOrder, setDataPurchaseOrder] = useState({});
  const [isLoadingDataPurchaseOrder, setIsLoadingDataPurchaseOrder] = useState(true);
  const generalConsentPrintRef = useRef();

  const [isEditingMode, setIsEditingMode] = useState(false);
  const [dataDetail, setDataDetail] = useState([]);
  const [isDialogItem, setIsDialogItem] = useState(false);

  const handleIsEditingMode = (e) => {
    setIsEditingMode(e.target.checked);
  };

  const deleteDetailDataHandler = (payload) => {
    let tempData =dataDetail.filter(data => data.id == payload);
    // const result = dataDetailFormatHandler(createPurchaseOrderValidation.values.purchase_order_detail);
    // createPurchaseOrderValidation.setFieldValue("purchase_order_detail", ...tempData);
    // console.log(result);
    setDataDetail(tempData);
  };

  const detailPurchaseOrderTableHead = [
    {
      id: "kode_item",
      label: "Kode Item",
    },
    {
      id: "nama_item",
      label: "Nama Item",
    },
    {
      id: "jumlah",
      label: "Jumlah",
    },
    {
      id: "sediaan",
      label: "Sediaan",
    },
  ];

  const dataDetailFormatHandler = (payload) => {
    const result = payload.map((e) => {
      return {
        kode_item: e.item.kode || "null",
        nama_item: e.item.name || "null",
        jumlah: e.jumlah || "null",
        sediaan: e.sediaan.name || "null",
        id: e,
      };
    });
    return result;
  };

  useEffect(() => {
    if (router.isReady) {
      (async () => {
        try {
          const response = await getDetailPurchaseOrder({id: slug[0]});
          const data = response.data.data;
          setDataPurchaseOrder(data); // setDetailPO pakai data dari resnpose API
          const formattedData = dataDetailFormatHandler(data.purchase_order_detail); // format data untuk error handling
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

              <Divider sx={{borderWidth: '1px', marginTop: 2}} />

              <div className='mt-32 p-16'>
                <TableLayoutDetail
                  baseRoutePath={`${router.asPath}`}
                  title='Item'
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
