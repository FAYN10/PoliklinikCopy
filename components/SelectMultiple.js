import { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const SelectMultiple = ({
  id,
  handlerRef,
  labelField,
  labelOptionRef,
  handlerFetchData = async () => {},
}) => {
  const [option, setOption] = useState([]);

  useEffect(() => {
    const getOptions = async () => {
      let response = await handlerFetchData();
      setOption(response.data.data);
    };
    getOptions();
  }, []);

  const handleChange = (_, values) => {
    handlerRef.setFieldValue(id, values);
  };

  return (
    <>
      <Autocomplete
        id={id}
        multiple
        limitTags={4}
        options={option}
        getOptionLabel={(option) => option[labelOptionRef]}
        filterSelectedOptions
        disabled={option.length === 0 ? true : false}
        value={handlerRef.values[`${id}`]}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            {...params}
            name={id}
            label={labelField}
            placeholder={`Pilih ${labelField}`}
            error={
              handlerRef.touched[`${id}`] && Boolean(handlerRef.errors[`${id}`])
            }
            helperText={
              handlerRef.touched[`${id}`] && handlerRef.errors[`${id}`]
            }
          />
        )}
      />
    </>
  );
};

export default SelectMultiple;
