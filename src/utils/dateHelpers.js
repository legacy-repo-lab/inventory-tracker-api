function toIsoDay(dateInput) {
  const d = dateInput ? new Date(dateInput) : new Date();
  return d.toISOString().slice(0, 10);
}

function daysBetween(startIso, endIso) {
  const a = new Date(startIso).getTime();
  const b = new Date(endIso).getTime();
  return Math.round(Math.abs(b - a) / (1000 * 60 * 60 * 24));
}

module.exports = {
  toIsoDay,
  daysBetween
};
