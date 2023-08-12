import { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function SelectStatic({
  id,
  handlerRef,
  label,
  options = [{ name: "example", value: "example" }],
  disabled = false,
}) {
  const [inputText, setInputText] = useState("");
  return (
    <Autocomplete
      id={id}
      name={id}
      sx={{ width: "100%" }}
      options={options}
      autoHighlight
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      inputValue={inputText}
      onInputChange={(_, newInputValue) => {
        setInputText(newInputValue);
      }}
      value={
        handlerRef.values[`${id}`]?.value === ""
          ? null
          : handlerRef.values[`${id}`]
      }
      onChange={(_, value) => {
        if (value) {
          handlerRef.setFieldValue(id, value);
          return;
        }
        handlerRef.setFieldValue(id, { value: "", name: "" });
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password", // disable autocomplete and autofill
          }}
          name={id}
          label={label}
          error={
            handlerRef.touched[`${id}`]?.value &&
            Boolean(handlerRef.errors[`${id}`]?.value)
          }
          helperText={
            handlerRef.touched[`${id}`]?.value &&
            handlerRef.errors[`${id}`]?.value
          }
        />
      )}
      disabled={disabled}
    />
  );
}
