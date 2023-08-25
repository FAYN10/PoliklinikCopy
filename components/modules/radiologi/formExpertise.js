import React, { useState, forwardRef, useRef } from "react";
import {
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Card,
  CardHeader,
  CardContent,
  DialogActions,
  IconButton,
  Collapse,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteIcon from "@material-ui/icons/Delete";
import { useFormik } from "formik";
import * as Yup from "yup";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@material-ui/icons/Save";
import { ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import EditIcon from "@material-ui/icons/Edit";
import PrintIcon from "@mui/icons-material/Print";
import ReactToPrint from "react-to-print";

const FormExpertise = () => {
  const labelPrintRef = useRef();
  const checkupPrintRef = useRef();
  const [isCardMinimized, setIsCardMinimized] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmationIndex, setDeleteConfirmationIndex] = useState(null);
  const [editedExpertises, setEditedExpertises] = useState({});
  const handleSaveRow = (index) => {
    setIsEditing(false);
    if (editedExpertises[index]) {
      const expertises = [...formik.values.expertises];
      expertises[index] = editedExpertises[index];
      formik.setFieldValue("expertises", expertises);
      setEditedExpertises((prev) => ({ ...prev, [index]: "" }));
    }
  };

  const LabelToPrint = forwardRef(function LabelToPrint({ data }, ref) {
    return (
      <div ref={ref} className="printableContent">
        <div className="flex p-4" style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="column">
            <div className="font-w-600">No. Pemeriksaan: {data.no_pemeriksaan || "-"}</div>
            <div className="font-w-600">No. RM: {data.no_rm || "-"}</div>
            <div className="font-w-600">Nama Pasien: {data.nama_pasien || "-"}</div>
            <div className="font-w-600">Tanggal Lahir: {data.tanggal_lahir || "-"}</div>
            <div className="font-w-600">Umur: {data.umur || "-"}</div>
          </div>
          <div className="column">
            <div className="font-w-600">Tanggal Pemeriksaan: {data.tanggal_pemeriksaan || "-"}</div>
            <div className="font-w-600">Diagnosa: {data.diagnosis_kerja || "-"}</div>
            <div className="font-w-600">Nama Pemeriksaan: {data.namaPemeriksaan || "-"}</div>
            <div className="font-w-600">Jenis Pemeriksaan: {data.jenis_pemeriksaan || "-"}</div>
            <div className="font-w-600">Dokter Pengirim: {data.dokter || "-"}</div>
            <div className="font-w-600">Pelayanan: {data.poli || "-"}</div>
          </div>
        </div>
        <div className="font-w-600">Hasil Expertise: {data.hasil_expertise || "-"}</div>
      </div>


    );
  });

  const CheckupToPrint = forwardRef(function CheckupToPrint({ data }, ref) {
    return (
      <div ref={ref} className="printableContent">
        <div className="m-8">
          <div className="font-w-600">
            <div className="font-18">RSU MITRA PARAMEDIKA</div>
            <div style={{ maxWidth: "250px" }}>
              Jl. Raya Ngemplak, Kemasan, Widodomartani, Ngemplak, Sleman
            </div>
          </div>
          <div className="font-w-600 mt-24">{data.no_rm || "-"}</div>
        </div>
      </div>
    );
  });

  const initialValues = {
    images: [],
    expertises: [],
  };
  const handleDeleteRow = (index) => {
    const images = [...formik.values.images];
    const expertises = [...formik.values.expertises];

    images.splice(index, 1);
    expertises.splice(index, 1);

    formik.setFieldValue("images", images);
    formik.setFieldValue("expertises", expertises);
  };

  const handleDeleteRowConfirmed = (index) => {
    handleDeleteRow(index);
    setDeleteConfirmationIndex(null);
  };

  const handleAddImage = (event) => {
    const images = [...formik.values.images];
    images.push({
      src: URL.createObjectURL(event.target.files[0]),
      expertise: "",
    });
    formik.setFieldValue("images", images);
    setSelectedImageIndex(images.length - 1); 
    setIsEditing(true);
  };

  const handleEditImage = (index) => {
    setSelectedImageIndex(index);
    setSelectedImage(formik.values.images[index].src);
    setIsEditing(true);
  };

  const handleUpdateImage = (newImage) => {
    if (newImage instanceof File) {
      const images = [...formik.values.images];

      const reader = new FileReader();
      reader.onload = () => {
        images[selectedImageIndex].src = reader.result;
        formik.setFieldValue("images", images);
        setSelectedImageIndex(null);
        setSelectedImage(null);
        setIsEditing(false);
      };
      reader.readAsDataURL(newImage);
    } else {
      console.error("Invalid file input for handleUpdateImage");
    }
  };

  const validationSchema = Yup.object({
    images: Yup.array().min(1, "Paling tidak harus ada satu gambar"),
    expertises: Yup.array().min(1, "Paling tidak harus ada satu hasil expertise"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  const handleToggleCard = () => {
    setIsCardMinimized(!isCardMinimized);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <Card>
          <CardHeader
            avatar={
              <IconButton onClick={handleToggleCard}>
                {isCardMinimized ? <ExpandMoreIcon /> : <ExpandLessIcon />}
              </IconButton>
            }
            title={
              <Typography variant="h6" component="div" fontWeight="bold">
                Hasil pemeriksaan {formik.values.assessmentPetugas} <hr />
              </Typography>
            }
          />
          <Collapse in={!isCardMinimized}>
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">No</TableCell>
                      <TableCell align="center">Foto</TableCell>
                      <TableCell align="center">Hasil Expertise</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formik.values.images.map((image, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell align="center">
                          {selectedImageIndex === index && isEditing ? (
                            <div>
                              <img src={image.src} alt={`expertise ${index + 1}`} height={200} align="center" />
                              <div>
                                {isEditing && (
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleUpdateImage(e.target.files[0])}
                                  />
                                )}
                              </div>
                            </div>
                          ) : (
                            <div onClick={() => handleImageClick(image.src)} style={{ cursor: "pointer" }}>
                              <img src={image.src} alt={`expertise ${index + 1}`} height={200} />
                            </div>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {isEditing && selectedImageIndex === index ? (
                            <TextField
                              type="text"
                              value={image.expertise}
                              onChange={(e) => {
                                const updatedImages = [...formik.values.images];
                                updatedImages[index].expertise = e.target.value;
                                formik.setFieldValue("images", updatedImages);
                              }}
                              multiline
                              rows={8}
                              fullWidth
                              style={{ textAlign: "left", marginTop: "8px" }}
                            />
                          ) : (
                            <Typography variant="body2">
                              {image.expertise || "-"}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton onClick={() => setDeleteConfirmationIndex(index)}>
                            <DeleteIcon />
                          </IconButton>
                          
                          {isEditing && selectedImageIndex === index ? (
                            <IconButton onClick={() => handleSaveRow(index)}>
                              <SaveIcon />
                            </IconButton>
                          ) : (
                            <IconButton
                              onClick={() => handleEditImage(index)}
                              disabled={isEditing}
                            >
                              <EditIcon />
                            </IconButton>
                          )}
                          <Dialog
                            open={deleteConfirmationIndex === index}
                            onClose={() => setDeleteConfirmationIndex(null)}
                          >
                            <DialogContent>
                              Apakah Anda yakin untuk menghapus data ini?
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={() => setDeleteConfirmationIndex(null)} color="primary">
                                Batal
                              </Button>
                              <Button onClick={() => handleDeleteRowConfirmed(index)} color="primary">
                                Hapus
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
            <div style={{ display: "flex", justifyContent: "flex-end", margin: "16px" }}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="image-upload-expertise"
                type="file"
                onChange={handleAddImage}
              />
              <label htmlFor="image-upload-expertise">
                <Button
                  variant="contained"
                  component="span"
                  color="success"
                  startIcon={<AddCircleOutlineIcon />}
                >
                  Tambah Gambar
                </Button>
              </label>

              <ReactToPrint
                      trigger={() => (
                        <Button variant="outlined" startIcon={<PrintIcon />}>
                          Cetak Kartu Periksa
                        </Button>
                      )}
                      content={() => checkupPrintRef.current}
                    />
                    <CheckupToPrint
                      data={{
                        no_rm: detailPrePopulatedData.no_rm,
                      }}
                      ref={checkupPrintRef}
                    />
            </div>

          </Collapse>
        </Card>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Hasil Scan</DialogTitle>
        <DialogContent>
          {selectedImage && <img src={selectedImage} alt="expertise" style={{ width: "100%" }} />}
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default FormExpertise;
