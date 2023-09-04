import {useState, useEffect, useRef, forwardRef} from 'react';
import {useRouter} from 'next/router';
import Image from 'next/image';
import LoaderOnLayout from 'components/LoaderOnLayout';
import FormPasien from 'components/modules/pasien/form';
import {formatGenToIso} from 'utils/formatTime';
import getStaticData from 'utils/getStaticData';
import {getDetailPembelian} from 'api/gudang/pembelian';
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
  // const [dataPembelian, setDataPembelian] = useState({});
  const [detailDataPembelian, setDetailDataPembelian] = useState({});
  const [isLoadingDataPembelian, setIsLoadingDataPembelian] =
    useState(true);
  const [rows, setRows] = useState(
    detailDataPembelian?.receive_detail || []
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
          const response = await getDetailPembelian({id: slug[0]});
          const data = response.data.data;
          // const formattedData = dataFormatter(data); // format data untuk error handling
          // setDataPembelian(formattedData); // setDataPO pakai data yang diformat di atas
          console.log('Fetched Data:', data);
          setDetailDataPembelian(data); // setDetailPO pakai data dari resnpose API
          const PembelianDetails = data.receive_detail || []; // ambil data detail PO jika nggak ada maka array kosong
          console.log('Pembelian Details:', PembelianDetails);
          setRows(PembelianDetails);
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
                          {detailDataPembelian?.nomor_faktur}
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
                          {detailDataPembelian?.nomor_po}
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
                          {formatReadable(detailDataPembelian?.tanggal_pembelian)}
                        </div>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant='h1 font-w-700'>
                          Tanggal Jatuh Tempo
                        </Typography>
                      </Grid>
                      <Grid item md={7} sm={12}>
                        <div>
                          {' : '}
                          {formatReadable(detailDataPembelian?.tanggal_jatuh_tempo)}
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
                          {detailDataPembelian?.supplier.name}
                        </div>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant='h1 font-w-700'>Telepon</Typography>
                      </Grid>
                      <Grid item md={7} sm={12}>
                        <div>
                          {' : '}
                          {detailDataPembelian?.supplier.telp}
                        </div>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant='h1 font-w-700'>Alamat</Typography>
                      </Grid>
                      <Grid item md={7} sm={12}>
                        <div>
                          {' : '}
                          {detailDataPembelian?.supplier.address}
                        </div>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant='h1 font-w-700'>PPN</Typography>
                      </Grid>
                      <Grid item md={7} sm={12}>
                        <div>
                          {' : '}
                          {detailDataPembelian?.ppn}
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
                        <TableCell sx={{fontWeight: 'bold'}}>Nomor Batch</TableCell>
                        <TableCell sx={{fontWeight: 'bold'}}>Stok</TableCell>
                        <TableCell sx={{fontWeight: 'bold'}}>Harga Beli</TableCell>
                        <TableCell sx={{fontWeight: 'bold'}}>Harga Jual</TableCell>
                        <TableCell sx={{fontWeight: 'bold'}}>Diskon</TableCell>
                        <TableCell sx={{fontWeight: 'bold'}}>Margin</TableCell>
                        <TableCell sx={{fontWeight: 'bold'}}>Total</TableCell>
                        <TableCell sx={{fontWeight: 'bold'}}>Expired Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{index+1}</TableCell>
                          <TableCell>{row.item.kode}</TableCell>
                          <TableCell>{row.item.name}</TableCell>
                          <TableCell>{row.nomor_batch}</TableCell>
                          <TableCell>{row.stok}</TableCell>
                          <TableCell>{row.harga_beli_satuan}</TableCell>
                          <TableCell>{row.harga_jual_satuan}</TableCell>
                          <TableCell>{row.diskon}</TableCell>
                          <TableCell>{row.margin}</TableCell>
                          <TableCell>{row.total_pembelian}</TableCell>
                          <TableCell>{row.tanggal_ed}</TableCell>
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
