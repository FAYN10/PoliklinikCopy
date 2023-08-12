import { useState } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { FocusError } from "focus-formik-error";
import * as Yup from "yup";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import PlusIcon from "@material-ui/icons/Add";
import BackIcon from "@material-ui/icons/ArrowBack";
import SaveIcon from "@material-ui/icons/Save";
import Snackbar from "components/SnackbarMui";
import { createRole, updateRole, getDetailRole } from "api/role";
import dataPermission from "public/static/permissionData";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Card from "@mui/material/Card";
import useClientPermission from "custom-hooks/useClientPermission";
import Collapse from "@mui/material/Collapse";

const FormRole = ({
  isEditType = false,
  prePopulatedDataForm = {},
  detailPrePopulatedData = {},
  updatePrePopulatedData = () => "update data",
}) => {
  const router = useRouter();
  const { isActionPermitted } = useClientPermission();
  const [snackbar, setSnackbar] = useState({
    state: false,
    type: null,
    message: "",
  });
  const [formattedDataPermission, setFormattedDataPermission] = useState(() =>
    dataPermission.map((e) => ({ ...e, isCollapsed: true }))
  );

  const roleInitialValue = !isEditType
    ? {
        name: "",
        permissions: [],
      }
    : prePopulatedDataForm;

  const roleSchema = Yup.object({
    name: Yup.string().required("Nama role wajib diisi"),
    permission: Yup.array(),
  });

  const roleValidation = useFormik({
    initialValues: roleInitialValue,
    validationSchema: roleSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      let messageContext = isEditType ? "diperbarui" : "ditambahkan";
      let data = {
        ...values,
      };
      try {
        if (!isEditType) {
          await createRole(data);
          resetForm();
        } else {
          await updateRole({ ...data, id: detailPrePopulatedData.id });
          const response = await getDetailRole({
            id: detailPrePopulatedData.id,
          });
          updatePrePopulatedData({ ...response.data.data });
        }
        setSnackbar({
          state: true,
          type: "success",
          message: `"${data.name}" berhasil ${messageContext}!`,
        });
      } catch (error) {
        console.log(error);
        setSnackbar({
          state: true,
          type: "error",
          message: `Terjadi kesalahan, "${data.name}" gagal ${messageContext}!`,
        });
      }
    },
  });

  const handleChange = (payload) => {
    let tempData = [...roleValidation.values.permissions];
    const isAvailable = roleValidation.values.permissions.includes(payload);
    if (isAvailable) {
      roleValidation.setFieldValue(
        "permissions",
        tempData.filter((e) => e !== payload)
      );
    } else {
      roleValidation.setFieldValue("permissions", [...tempData, payload]);
    }
  };

  return (
    <>
      <Paper sx={{ width: "100%", padding: 2, paddingTop: 3 }}>
        <form onSubmit={roleValidation.handleSubmit}>
          <FocusError formik={roleValidation} />
          <div className="mb-24">
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Nama role"
              value={roleValidation.values.name}
              onChange={roleValidation.handleChange}
              error={
                roleValidation.touched.name &&
                Boolean(roleValidation.errors.name)
              }
              helperText={
                roleValidation.touched.name && roleValidation.errors.name
              }
            />
          </div>
          <Card className="px-14 py-12">
            <p className="m-0 p-0 mb-12 font-18 font-w-600 text-grey-text">
              HAK AKSES
            </p>
            {formattedDataPermission.map((role, roleIdx) => {
              return (
                <Card key={roleIdx} className="mb-16 p-12">
                  <FormControl component="fieldset" className="w-fit">
                    <FormLabel
                      component="legend"
                      className="flex justify-between w-fit pointer pointer--active-primary"
                      onClick={() => {
                        const tempData = [...formattedDataPermission];
                        tempData[roleIdx].isCollapsed =
                          !tempData[roleIdx].isCollapsed;
                        setFormattedDataPermission(tempData);
                      }}
                    >
                      <span>{`Fitur ${role.label}`}</span>
                      {role.isCollapsed ? (
                        <ExpandMoreIcon />
                      ) : (
                        <ExpandLessIcon />
                      )}
                    </FormLabel>
                    <Collapse in={!role.isCollapsed}>
                      <FormGroup
                        aria-label="position"
                        className="pl-4"
                        sx={{ width: "fit-content" }}
                      >
                        {role.data.map((perm, permIdx) => {
                          return (
                            <FormControlLabel
                              key={permIdx}
                              value={perm.permission}
                              control={
                                <Checkbox
                                  checked={roleValidation.values.permissions.includes(
                                    perm.permission
                                  )}
                                  onChange={() => handleChange(perm.permission)}
                                />
                              }
                              label={perm.label}
                              labelPlacement="end"
                            />
                          );
                        })}
                      </FormGroup>
                    </Collapse>
                  </FormControl>
                </Card>
              );
            })}
          </Card>
          <div className="mt-16 flex justify-end items-center">
            <Button
              type="button"
              variant="outlined"
              startIcon={<BackIcon />}
              sx={{ marginRight: 2 }}
              onClick={() => router.push("/role")}
            >
              Kembali
            </Button>
            {isEditType ? (
              <LoadingButton
                type="submit"
                variant="contained"
                disabled={
                  JSON.stringify(roleValidation.initialValues) ===
                    JSON.stringify(roleValidation.values) ||
                  !isActionPermitted("role:update")
                }
                startIcon={<SaveIcon />}
                loadingPosition="start"
                loading={roleValidation.isSubmitting}
              >
                Simpan perubahan
              </LoadingButton>
            ) : (
              <LoadingButton
                type="submit"
                variant="contained"
                disabled={!isActionPermitted("role:store")}
                startIcon={<PlusIcon />}
                loadingPosition="start"
                loading={roleValidation.isSubmitting}
              >
                Tambah Role
              </LoadingButton>
            )}
          </div>
        </form>
      </Paper>
      <Snackbar
        state={snackbar.state}
        setState={setSnackbar}
        message={snackbar.message}
        isSuccessType={snackbar.type === "success"}
        isErrorType={snackbar.type === "error"}
      />
    </>
  );
};

export default FormRole;
