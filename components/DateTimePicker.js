import { useState, useEffect } from "react";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
// import AdapterDateFns from "@mui/lab/AdapterDateFns";
// import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { formatGenToIso } from "utils/formatTime";

const DateTimePickerComp = ({ label, id, handlerRef }) => {
  // useEffect(() => {
  //   console.log(value);
  // }, [value]);
  // const [value, setValue] = useState(null);
  return (
    <FormControl fullWidth>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {/* <DatePicker
          id={`${id}`}
          name={`${id}`}
          label={`${label}`}
          inputFormat="dd-MM-yyyy"
          mask="__-__-____"
          value={
            handlerRef.values[`${id}`]
              ? formatGenToIso(handlerRef.values[`${id}`])
              : null
          }
          onChange={(newValue) => {
            handlerRef.setFieldValue(id, newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              error={
                handlerRef.touched[`${id}`] &&
                Boolean(handlerRef.errors[`${id}`])
              }
              helperText={
                handlerRef.touched[`${id}`] && handlerRef.errors[`${id}`]
              }
            />
          )}
        /> */}
        <DateTimePicker
          id={`${id}`}
          name={`${id}`}
          label={`${label}`}
          inputFormat="dd-MM-yyyy HH:mm a"
          mask="__-__-____ __:__ _M"
          value={
            handlerRef.values[`${id}`]
              ? formatGenToIso(handlerRef.values[`${id}`])
              : null
          }
          onChange={(newValue) => {
            handlerRef.setFieldValue(id, newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              error={
                handlerRef.touched[`${id}`] &&
                Boolean(handlerRef.errors[`${id}`])
              }
              helperText={
                handlerRef.touched[`${id}`] && handlerRef.errors[`${id}`]
              }
            />
          )}
        />
      </LocalizationProvider>
    </FormControl>
  );
};

export default DateTimePickerComp;
