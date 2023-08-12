import {
  gender,
  maritalStatus,
  maritalStatusDeep,
  bloodType,
  bank,
  countries,
  statusAktif,
  statusPPA,
} from "public/static/data";

export default function getData(type, value) {
  switch (type) {
    case "gender":
      const genderType = gender.find((e) => e.value === value);
      if (genderType) {
        return genderType;
      } else {
        return { value: "", name: "" };
      }
    case "maritalStatus":
      const maritalStatusType = maritalStatus.find((e) => e.value === value);
      if (maritalStatusType) {
        return maritalStatusType;
      } else {
        return { value: "", name: "" };
      }
    case "maritalStatusDeep":
      const maritalStatusDeepType = maritalStatusDeep.find(
        (e) => e.value === value
      );
      if (maritalStatusDeepType) {
        return maritalStatusDeepType;
      } else {
        return { value: "", name: "" };
      }
    case "bloodType":
      const blood = bloodType.find((e) => e.value === value);
      if (blood) {
        return blood;
      } else {
        return { value: "", name: "" };
      }
    case "countries":
      const citizenship = countries.find((e) => e.label === value);
      if (citizenship) {
        return citizenship;
      } else {
        return { code: "", label: "" };
      }
    case "statusPPA":
      const statusppa = statusPPA.find((e) => e.value === value);
      if (statusppa) {
        return statusppa;
      } else {
        return { value: "", name: "" };
      }
    case "bank":
      const bankType = bank.find((e) => e.value === value);
      if (bankType) {
        return bankType;
      } else {
        return { value: "", name: "" };
      }
    case "statusAktif":
      const status = statusAktif.find((e) => e.value === value);
      if (status) {
        return status;
      } else {
        return { value: "", name: "" };
      }
    default:
      return "type is not defined";
  }
}
