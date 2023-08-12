const PREFIX = "rsmp_";
const ISSERVER = typeof window === "undefined";

export function setItem(key, data) {
  let formattedData = JSON.stringify(data);
  document.cookie = `${PREFIX}${key}=${formattedData}`;
}

export function removeItem(key) {
  // delete cookie by set the expires to past date
  document.cookie = `${PREFIX}${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
}

export function getItem(key) {
  if (!ISSERVER) {
    let name = `${PREFIX}${key}=`;
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return JSON.parse(c.substring(name.length, c.length));
      }
    }
  }
  return null;
}
