import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";

export default function SelectRegion({
  id,
  labelField,
  isDisabled = false,
  handlerRef,
  handlerFetchData = async () => {},
  handlerCleanup = () => {},
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [inputText, setInputText] = useState("");
  const loading = open && options.length === 0;

  useEffect(() => {
    let active = true;
    if (!loading) {
      return undefined;
    }
    (async () => {
      try {
        let response;
        response = await handlerFetchData();
        if (active) {
          setOptions([...response.data.data]);
        }
      } catch (error) {
        console.log(error);
        if (active) {
          setOptions([]);
        }
      }
    })();

    return () => {
      active = false;
    };
    // eslint-disable-next-line
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  useEffect(() => {
    setInputText(handlerRef.values[`${id}`]?.nama || "");
    // eslint-disable-next-line
  }, []);

  return (
    <Autocomplete
      id={id}
      name={id}
      sx={{ width: "100%" }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      options={options}
      loading={loading}
      getOptionLabel={(option) => option.nama}
      isOptionEqualToValue={(option, value) => option.nama === value.nama}
      disabled={isDisabled}
      inputValue={inputText}
      onInputChange={(_, newInputValue) => {
        setInputText(newInputValue);
      }}
      value={
        handlerRef.values[`${id}`]?.kode === ""
          ? null
          : handlerRef.values[`${id}`]
      }
      onChange={(_, value) => {
        if (value === null) {
          handlerCleanup();
          handlerRef.setFieldValue(id, { kode: "", nama: "" });
          return;
        } else if (value.kode !== handlerRef.values[`${id}`]?.kode) {
          handlerCleanup();
        }
        handlerRef.setFieldValue(id, { kode: value.kode, nama: value.nama });
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          name={id}
          label={labelField}
          error={
            handlerRef.touched[`${id}`]?.kode &&
            Boolean(handlerRef.errors[`${id}`]?.kode)
          }
          helperText={
            handlerRef.touched[`${id}`]?.kode &&
            handlerRef.errors[`${id}`]?.kode
          }
        />
      )}
    />
  );
}
