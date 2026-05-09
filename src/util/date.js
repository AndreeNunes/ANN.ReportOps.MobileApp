import moment from "moment-timezone";

export function getCurrentDate() {
  return moment().tz("America/Sao_Paulo").format("YYYY-MM-DDTHH:mm:ss");
}

export function formatDate(date) {
  if (!date) return null;
  
  const d = new Date(date);

  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

export function formatDateTime(date) {
  if (!date) return null;
  
  const d = new Date(date);
  
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  const hour = String(d.getUTCHours()).padStart(2, "0");
  const minute = String(d.getUTCMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hour}:${minute}`;
}

export function formatIsoDateTimeString(value) {
  if (value == null) return null;
  
  const s = String(value).trim();

  if (s.length < 16) return null;

  if (s.charAt(4) !== "-" || s.charAt(7) !== "-") return null;
  
  const t = s.charAt(10);
  
  if (t !== "T" && t !== "t") return null;

  const year = s.substring(0, 4);
  const month = s.substring(5, 7);
  const day = s.substring(8, 10);
  const hour = s.substring(11, 13);
  const minute = s.substring(14, 16);
  
  return `${day}/${month}/${year} ${hour}:${minute}`;
}

export function formatSendRequestDate(date) {
  if (!date) return null;
  
  const d = new Date(date);
  
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  const hour = String(d.getUTCHours()).padStart(2, "0");
  const minute = String(d.getUTCMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}:00.000Z`;
}
