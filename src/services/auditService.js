const fs = require('fs');
const os = require('os');
const path = require('path');

const CACHE_FILE = path.join(os.tmpdir(), 'inventory-report-cache.json');

function writeReportCache(report) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(report), 'utf8');
  return CACHE_FILE;
}

function readReportCache() {
  if (!fs.existsSync(CACHE_FILE)) {
    return null;
  }
  const raw = fs.readFileSync(CACHE_FILE, 'utf8');
  return JSON.parse(raw);
}

function clearReportCache() {
  if (fs.existsSync(CACHE_FILE)) {
    fs.unlinkSync(CACHE_FILE);
  }
}

module.exports = {
  CACHE_FILE,
  writeReportCache,
  readReportCache,
  clearReportCache
};
