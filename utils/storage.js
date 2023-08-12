const PREFIX = "rsmp_";
const ISSERVER = typeof window === "undefined";

export function setItem(key, data) {
  let formattedData = JSON.stringify(data);
  localStorage.setItem(PREFIX + key, formattedData);
}

export function removeItem(key) {
  localStorage.removeItem(PREFIX + key);
}

export function getItem(key) {
  if (!ISSERVER) {
    if (localStorage.getItem(key) !== null) {
      return JSON.parse(localStorage.getItem(key));
    } else if (localStorage.getItem(PREFIX + key) !== null) {
      return JSON.parse(localStorage.getItem(PREFIX + key));
    }
  }
  return null;
}
