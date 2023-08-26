import {useState, useEffect} from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export default function SelectAsync({
  id,
  labelField,
  labelOptionRef,
  labelOptionSecondRef = null,
  valueOptionRef,
  isDisabled = false,
  handlerRef,
  handlerFetchData = async () => {},
  handlerOnChange = () => {},
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [inputText, setInputText] = useState('');
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
    setInputText(handlerRef.values[`${id}`]?.[labelOptionRef] || '');
    // eslint-disable-next-line
  }, []);

  return (
    <Autocomplete
      id={id}
      name={id}
      sx={{width: '100%'}}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      options={options}
      loading={loading}
      getOptionLabel={(option) => option[labelOptionRef]}
      isOptionEqualToValue={(option, value) =>
        option[valueOptionRef] === value[valueOptionRef]
      }
      disabled={isDisabled}
      inputValue={inputText}
      onInputChange={(_, newInputValue) => {
        setInputText(newInputValue);
      }}
      value={
        handlerRef.values[`${id}`]?.[valueOptionRef] === ''
          ? null
          : handlerRef.values[`${id}`]
      }
      onChange={(_, value) => {
        handlerOnChange(value);
      }}
      renderOption={(props, option) => (
        <Box component='li' {...props} key={option[valueOptionRef]}>
          {option[labelOptionRef]}{' '}
          {labelOptionSecondRef && `- ${option[labelOptionSecondRef]}`}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color='inherit' size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          name={id}
          label={labelField}
          error={
            handlerRef.touched[`${id}`]?.[valueOptionRef] &&
            Boolean(handlerRef.errors[`${id}`]?.[valueOptionRef])
          }
          helperText={
            handlerRef.touched[`${id}`]?.[valueOptionRef] &&
            handlerRef.errors[`${id}`]?.[valueOptionRef]
          }
        />
      )}
    />
  );
}
