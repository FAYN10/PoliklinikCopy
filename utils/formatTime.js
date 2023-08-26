import { format as formatFns, parseISO } from "date-fns";
import { id } from 'date-fns/locale'

export const formatIsoToGen = (payload) => {
  if (payload) {
    return formatFns(payload, "yyyy-MM-dd");
  }
  return null;
};

export const formatIsoToGenTime = (payload) => {
  if (payload) {
    return formatFns(payload, "yyyy-MM-dd HH:mm:ss");
  }
  return null;
};

export const formatGenToIso = (payload) => {
  if (payload) {
    return new Date(payload);
  }
  return null;
};

export const formatReadable = (payload) => {
  if (payload) {
    return formatFns(parseISO(payload), " do MMMM yyyy, k:mm");
  }
  return null;
};

export const formatIndoDate = (payload) => {
  if (payload) {
    const temp = formatGenToIso(payload);
    return formatFns(temp, "dd-MM-yyyy");
  }
  return null;
};

export const formatLabelDate = (payload) => {
  if (payload) {
    const temp = formatGenToIso(payload);
    return formatFns(temp, "dd-MMM-yyyy", { locale: id });
  }
  return null;
};

export const formatSuratDate = (payload) => {
  if (payload) {
    const temp = formatGenToIso(payload);
    return formatFns(new Date(temp), "dd MMMM yyyy", { locale: id });
  }
  return null;
};