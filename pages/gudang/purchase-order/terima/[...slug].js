import { useState, useEffect, useRef, forwardRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import LoaderOnLayout from "components/LoaderOnLayout";
import FormPasien from "components/modules/pasien/form";
import { formatGenToIso } from "utils/formatTime";
import getStaticData from "utils/getStaticData";
import { getDetailPurchaseOrder } from "api/gudang/purchase-order";
import TableLayout from "pages/pasien/TableLayout";
import { formatReadable } from "utils/formatTime";
import BackIcon from "@material-ui/icons/ArrowBack";
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
  Checkbox,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ReactToPrint from "react-to-print";
import { Paper } from "@material-ui/core";

const Detail = () => {
  const router = useRouter();
  const { slug } = router.query;
  // const [dataPurchaseOrder, setDataPurchaseOrder] = useState({});
  const [detailDataPurchaseOrder, setDetailDataPurchaseOrder] = useState({});
  const [isLoadingDataPurchaseOrder, setIsLoadingDataPurchaseOrder] =
    useState(true);
  const [rows, setRows] = useState(
    detailDataPurchaseOrder?.purchase_order_detail || []
  );
  const generalConsentPrintRef = useRef();

  const [selectedItems, setSelectedItems] = useState([]);
  const [confirmedItems, setConfirmedItems] = useState([]);

  const handleCheckboxChange = (event, item) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedItems((prevItems) => [...prevItems, item]);
    } else {
      setSelectedItems((prevItems) =>
        prevItems.filter((prevItem) => prevItem !== item)
      );
    }
  };

  const confirmItems = () => {
    setConfirmedItems((prevItems) => [...prevItems, ...selectedItems]);
    setSelectedItems([]);
  };

  const removeConfirmedItem = (itemToRemove) => {
    setConfirmedItems((prevItems) =>
      prevItems.filter((item) => item !== itemToRemove)
    );
  };

  useEffect(() => {
    if (router.isReady) {
      (async () => {
        try {
          const response = await getDetailPurchaseOrder({ id: slug[0] });
          const data = response.data.data;
          // const formattedData = dataFormatter(data); // format data untuk error handling
          // setDataPurchaseOrder(formattedData); // setDataPO pakai data yang diformat di atas
          console.log("Fetched Data:", data);
          setDetailDataPurchaseOrder(data); // setDetailPO pakai data dari resnpose API
          const purchaseOrderDetails = data.purchase_order_detail || []; // ambil data detail PO jika nggak ada maka array kosong
          console.log("Purchase Order Details:", purchaseOrderDetails);
          setRows(purchaseOrderDetails);
        } catch (error) {
          console.log("Error fetching data:", error);
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
            <Card className="py-12 mb-16">
              <div className="px-14 flex justify-between items-start">
                <div className="flex items-start">
                  <div className="ml-8 mt-8">
                    <Grid container spacing={2}>
                      <Grid item xs={3}>
                        <Typography variant="h1 font-w-700">
                          Nomor Purchase Order
                        </Typography>
                      </Grid>
                      <Grid item md={7} sm={12}>
                        <div>
                          {" : "}
                          {detailDataPurchaseOrder?.nomor_po}
                        </div>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="h1 font-w-700">
                          Tanggal Purchase Order
                        </Typography>
                      </Grid>
                      <Grid item md={7} sm={12}>
                        <div>
                          {" : "}
                          {formatReadable(detailDataPurchaseOrder?.tanggal_po)}
                        </div>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="h1 font-w-700">
                          Nama Supplier
                        </Typography>
                      </Grid>
                      <Grid item md={7} sm={12}>
                        <div>
                          {" : "}
                          {detailDataPurchaseOrder?.supplier.name}
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </div>
              <Divider
                sx={{ borderWidth: "1px", marginTop: 2, marginBottom: 5 }}
              />
              <Grid
                container
                spacing={2}
                className="mt-32 p-16"
                alignItems="center"
                justifyContent="center"
              >
                <Grid item xs={5}>
                  <Typography variant="h1" fontWeight="bold" fontSize="2rem">
                    Purchase Order
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>No</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Kode Item
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Nama Item
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{row.item.kode}</TableCell>
                            <TableCell>{row.item.name}</TableCell>
                            <TableCell>
                              <Checkbox
                                checked={selectedItems.includes(row)}
                                onChange={(event) =>
                                  handleCheckboxChange(event, row)
                                }
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={0}>
                  <Button
                    type="button"
                    variant="contained"
                    startIcon={<ArrowCircleRightIcon />}
                    onClick={confirmItems}
                  ></Button>
                </Grid>
                <Grid item xs={5}>
                  <Typography variant="h1" fontWeight="bold" fontSize="2rem">
                    Konfirmasi
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>No</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Kode Item
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Nama Item
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {confirmedItems.map((confirmedItem, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{confirmedItem.item.kode}</TableCell>
                            <TableCell>{confirmedItem.item.name}</TableCell>
                            <TableCell>
                              <IconButton
                                aria-label="delete"
                                onClick={() =>
                                  removeConfirmedItem(confirmedItem)
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
              <div className="flex"></div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<BackIcon />}
                  sx={{ marginBottom: 1, marginRight: 2 }}
                  onClick={() => router.push("/gudang/purchase-order")}
                >
                  Kembali
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<ArrowForwardIcon />}
                  sx={{ marginBottom: 1, marginRight: 2 }}
                  onClick={() =>
                    router.push(
                      {
                        pathname: "/gudang/purchase-order/terima/confirm",
                      },
                      `/gudang/purchase-order/terima/confirm/${slug[0]}`
                    )
                  }
                >
                  Lanjut
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
