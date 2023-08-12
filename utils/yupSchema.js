import { parse } from "date-fns";
import * as Yup from "yup";

export const stringSchema = (label, isReq = false) => {
  if (isReq) {
    return Yup.string("Tipe data wajib string").required(
      `${label} wajib diisi`
    );
  }
  return Yup.string("Tipe data wajib string");
};

export const phoneNumberSchema = (isReq = false) => {
  if (isReq) {
    return Yup.string()
      .required("Wajib diisi")
      .min(6, "Min 6 karakter")
      .max(15, "Max 15 karakter")
      .nullable()
      .transform((value) => (value.length > 3 ? value : ""));
  } else {
    return Yup.string()
      .notRequired()
      .min(6, "Min 6 karakter")
      .max(15, "Max 15 karakter")
      .nullable()
      .transform((value) => (value.length > 3 ? value : ""));
  }
};

export const stringNumberOnlySchema = (min = null, max = null) => {
  if (min && max) {
    return Yup.string("Tipe data wajib string")
      .matches(/^[0-9]+$/, "Wajib angka")
      .min(min, "Wajib 16 digit")
      .max(max, "Wajib 16 digit");
  } else if (min && !max) {
    Yup.string()
      .matches(/^[0-9]+$/, "Wajib angka")
      .min(min, "Wajib 16 digit");
  } else if (max && !min) {
    return Yup.string("Tipe data wajib string")
      .matches(/^[0-9]+$/, "Wajib angka")
      .max(max, "Wajib 16 digit");
  } else {
    return Yup.string("Tipe data wajib string").matches(
      /^[0-9]+$/,
      "Wajib angka"
    );
  }
};

export const dateSchema = (label) => {
  return Yup.date("Tipe data wajib date")
    .transform(function (value, originalValue) {
      if (this.isType(value)) {
        return value;
      }
      const result = parse(originalValue, "dd/MM/yyyy", new Date());
      return result;
    })
    .min("1900-01-01", `${label} tidak valid`)
    .typeError(`${label} tidak valid`)
    .required(`${label} wajib diisi`);
};
