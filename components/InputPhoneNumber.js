import MuiPhoneNumber from "material-ui-phone-number";
import { useEffect } from "react";

const InputPhoneNumber = ({ id, labelField, handlerRef, disabled = false }) => {
  useEffect(() => {
    // 0 -> 62 === indonesia
    if (handlerRef.values[`${id}`][0] === "0") {
      handlerRef.setFieldValue(
        id,
        handlerRef.values[`${id}`].substring(0, 0) +
          "62" +
          handlerRef.values[`${id}`].substring(0 + 1)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MuiPhoneNumber
      disabled={disabled}
      fullWidth
      id={id}
      name={id}
      label={labelField}
      variant="outlined"
      countryCodeEditable={false}
      onlyCountries={["id", "my", "sg", "th"]}
      defaultCountry="id"
      autoFormat={false}
      value={handlerRef.values[`${id}`]}
      onChange={(value) =>
        value.length > 3
          ? handlerRef.setFieldValue(id, value)
          : handlerRef.setFieldValue(id, "")
      }
      error={handlerRef.touched[`${id}`] && Boolean(handlerRef.errors[`${id}`])}
      helperText={handlerRef.touched[`${id}`] && handlerRef.errors[`${id}`]}
    />
  );
};

export default InputPhoneNumber;
