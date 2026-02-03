import moment from "moment-timezone";

export function getCurrentDate() {
  return moment().tz("America/Sao_Paulo").toDate();
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
