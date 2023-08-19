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
  Card,
  CardHeader,
  CardContent,
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
  const [isCardMinimized, setIsCardMinimized] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const LabelToPrint = forwardRef(function LabelToPrint({ data }, ref) {
    return (
      <div ref={ref} className="printableContent">
        {/* ... (printing logic remains the same) */}
      </div>
    );
  });

  const initialValues = {
    images: [],
    expertises: [],
  };
  const handleDeleteImage = (index) => {
    const images = [...formik.values.images];
    images.splice(index, 1);
    formik.setFieldValue("images", images);
  };


  const handleEditImage = (index) => {
    setSelectedImageIndex(index);
    setIsEditing(true);
  };

  const handleUpdateImage = (newImage) => {
    if (newImage instanceof File) {
      const images = [...formik.values.images];
  
      const reader = new FileReader();
      reader.onload = () => {
        images[selectedImageIndex] = reader.result;
        formik.setFieldValue("images", images);
        setSelectedImageIndex(null);
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

  const handleAddImage = (event) => {
    const images = [...formik.values.images];
    images.push(URL.createObjectURL(event.target.files[0]));
    formik.setFieldValue("images", images);
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
              <div className="mr-8" style={{ display: "flex", justifyContent: "flex-end" }}>
                <ReactToPrint
                  trigger={() => (
                    <Button variant="contained" color="secondary" startIcon={<PrintIcon />}>
                      EXPORT HASIL
                    </Button>
                  )}
                  content={() => labelPrintRef.current}
                />
                <LabelToPrint
                  data={{
                    // ... (printing data remains the same)
                  }}
                  ref={labelPrintRef}
                />
              </div>
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
                          {selectedImageIndex === index ? (
                            <div>
                              <img src={image} alt={`expertise ${index + 1}`} height={200} />
                              <div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleUpdateImage(e.target.files[0])}
                                />
                                <Button variant="outlined" onClick={() => setIsEditing(false)}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div onClick={() => handleImageClick(image)} style={{ cursor: "pointer" }}>
                              <img src={image} alt={`expertise ${index + 1}`} height={200} />
                              <Typography variant="body2">
                                {formik.values.expertises[index] || "-"}
                              </Typography>
                            </div>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {isEditing && selectedImageIndex === index ? (
                            <input
                              type="text"
                              value={formik.values.expertises[index] || ""}
                              onChange={(e) => {
                                const expertises = [...formik.values.expertises];
                                expertises[index] = e.target.value;
                                formik.setFieldValue("expertises", expertises);
                              }}
                              style={{ width: "100%", height: "100px" }}
                            />
                          ) : (
                            <Typography variant="body2">
                              {formik.values.expertises[index] || "-"}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton onClick={() => handleDeleteImage(index)}>
                            <DeleteIcon />
                          </IconButton>
                          {!isEditing && selectedImageIndex !== index && (
                            <IconButton onClick={() => handleEditImage(index)}>
                              <EditIcon />
                            </IconButton>
                          )}
                          {isEditing && selectedImageIndex === index && (
                            <IconButton onClick={() => handleUpdateImage(/* pass new image here */)}>
                              <SaveIcon />
                            </IconButton>
                          )}
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
              <LoadingButton
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                loading={formik.isSubmitting}
                onClick={formik.handleSubmit}
                style={{ marginLeft: "16px" }}
              >
                SIMPAN
              </LoadingButton>
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
