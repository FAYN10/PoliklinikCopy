import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { formatGenToIso } from "utils/formatTime";

const DatePickerComp = ({ label, id, handlerRef }) => {
  return (
    <FormControl fullWidth>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
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
        />
      </LocalizationProvider>
    </FormControl>
  );
};

export default DatePickerComp;
