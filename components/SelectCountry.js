import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Image from "next/image";
import { countries } from "public/static/data";

export default function CountrySelect({
  id,
  name,
  handlerRef,
  handlerOnChange,
  labelField,
  disabled = false,
}) {
  const [inputText, setInputText] = useState("");
  return (
    <Autocomplete
      id={id}
      name={name}
      sx={{ width: "100%" }}
      options={countries}
      autoHighlight
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.label === value.label}
      inputValue={inputText}
      onInputChange={(_, newInputValue) => {
        setInputText(newInputValue);
      }}
      value={
        handlerRef.values[`${name}`]?.code === ""
          ? null
          : handlerRef.values[`${name}`]
      }
      onChange={(_, value) => {
        handlerOnChange(value);
      }}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          {/* <img
            loading="lazy"
            width="20"
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
            alt=""
          /> */}
          {/* {option.label} ({option.code}) +{option.phone}   */}
          <Image
            layout="fixed"
            width={20}
            height={15}
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            alt={`icon-${option.label}`}
          />
          <div className="mr-6"></div>
          {option.label} ({option.code})
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password", // disable autocomplete and autofill
          }}
          name={name}
          label={labelField}
          error={
            handlerRef.touched[`${name}`]?.code &&
            Boolean(handlerRef.errors[`${name}`]?.code)
          }
          helperText={
            handlerRef.touched[`${name}`]?.code &&
            handlerRef.errors[`${name}`]?.code
          }
        />
      )}
      disabled={disabled}
    />
  );
}
