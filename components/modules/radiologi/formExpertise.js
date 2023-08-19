import { useState } from "react";
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
import FormAssessmentPetugas from "./formAssessmentPetugas";

const FormExpertise = () => {
  const [isCardMinimized, setIsCardMinimized] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // Untuk gambar yang dipilih di-klik
  const [openDialog, setOpenDialog] = useState(false);

  const initialValues = {
    images: [],
    expertises: [],
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

  const handleDeleteImage = (index) => {
    const images = [...formik.values.images];
    images.splice(index, 1);
    formik.setFieldValue("images", images);
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
                          <div onClick={() => handleImageClick(image)} style={{ cursor: "pointer" }}>
                            <img src={image} alt={`expertise ${index + 1}`} height={200} />
                          </div>
                        </TableCell>
                        <TableCell align="center">
                          <input
                            type="text"
                            value={formik.values.expertises[index] || ""}
                            onChange={(e) => {
                              const expertises = [...formik.values.expertises];
                              expertises[index] = e.target.value;
                              formik.setFieldValue("expertises", expertises);
                            }}
                            style={{ width: "100%", height: "100px" }} // Perbesar teks area
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton onClick={() => handleDeleteImage(index)}>
                            <DeleteIcon />
                          </IconButton>
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
                  color="primary"
                  component="span"
                  startIcon={<AddCircleOutlineIcon />}
                >
                  Tambah Gambar
                </Button>
              </label>
              <LoadingButton
                type="submit"
                variant="contained"
                color="success"
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
