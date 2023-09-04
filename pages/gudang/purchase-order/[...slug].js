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

const Detail = () => {
  const router = useRouter();
  const {slug} = router.query;
  // const [dataPurchaseOrder, setDataPurchaseOrder] = useState({});
  const [detailDataPurchaseOrder, setDetailDataPurchaseOrder] = useState({});
  const [isLoadingDataPurchaseOrder, setIsLoadingDataPurchaseOrder] =
    useState(true);
  const [rows, setRows] = useState(
    detailDataPurchaseOrder?.purchase_order_detail || []
  );
  const generalConsentPrintRef = useRef();

  // const dataFormatter = (data) => {
  //   let tempData = {
  //     nomor_po: data.nomor_po || "null",
  //     tanggal_po: data.tanggal_po || "null",
  //     nama_supplier: data.supplier.name || "null",
  //     telepon_supplier: data.supplier.telp || "null",
  //     alamat_supplier: data.supplier.address || "null",
  //     po_type: data.po_type.name || "null",
  //   };
  //   return { ...tempData };
  // };

  useEffect(() => {
    if (router.isReady) {
      (async () => {
        try {
          const response = await getDetailPurchaseOrder({id: slug[0]});
          const data = response.data.data;
          // const formattedData = dataFormatter(data); // format data untuk error handling
          // setDataPurchaseOrder(formattedData); // setDataPO pakai data yang diformat di atas
          console.log('Fetched Data:', data);
          setDetailDataPurchaseOrder(data); // setDetailPO pakai data dari resnpose API
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
                          {detailDataPurchaseOrder?.nomor_po}
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
                          {detailDataPurchaseOrder?.po_type.name}
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
                          {formatReadable(detailDataPurchaseOrder?.tanggal_po)}
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
                          {detailDataPurchaseOrder?.supplier.name}
                        </div>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant='h1 font-w-700'>Telepon</Typography>
                      </Grid>
                      <Grid item md={7} sm={12}>
                        <div>
                          {' : '}
                          {detailDataPurchaseOrder?.supplier.telp}
                        </div>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant='h1 font-w-700'>Alamat</Typography>
                      </Grid>
                      <Grid item md={7} sm={12}>
                        <div>
                          {' : '}
                          {detailDataPurchaseOrder?.supplier.address}
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
                        <TableCell sx={{fontWeight: 'bold'}}>Sediaan</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{index+1}</TableCell>
                          <TableCell>{row.item.kode}</TableCell>
                          <TableCell>{row.item.name}</TableCell>
                          <TableCell>{row.jumlah}</TableCell>
                          <TableCell>{row.sediaan.sediaan}</TableCell>
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
              </div>
            </Card>
          </Paper>
        </>
      )}
    </>
  );
};

export default Detail;
