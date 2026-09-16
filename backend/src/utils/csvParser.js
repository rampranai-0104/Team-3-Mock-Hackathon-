/**
 * Robust CSV parser for batch imports
 * Handles RFC-4180 standard, including quoted fields, escaped quotes, commas, newlines, and headers.
 */

function parseCSV(csvString) {
  if (!csvString || typeof csvString !== 'string') {
    return [];
  }

  const cleanString = csvString.replace(/^\uFEFF/, ''); // strip UTF-8 BOM
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < cleanString.length; i++) {
    const char = cleanString[i];
    const nextChar = cleanString[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote
          currentField += '"';
          i++;
        } else {
          // Closing quote
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\r') {
        if (nextChar === '\n') {
          i++;
        }
        currentRow.push(currentField.trim());
        if (currentRow.some(field => field.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else if (char === '\n') {
        currentRow.push(currentField.trim());
        if (currentRow.some(field => field.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  // Final field and row if any
  if (currentField.length > 0 || inQuotes) {
    currentRow.push(currentField.trim());
  }
  if (currentRow.length > 0 && currentRow.some(field => field.length > 0)) {
    rows.push(currentRow);
  }

  if (rows.length === 0) {
    return [];
  }

  // Parse header
  const headers = rows[0].map(h => h.trim().replace(/^"|"$/g, ''));
  const data = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const item = { _rowNumber: r + 1 };
    for (let c = 0; c < headers.length; c++) {
      const header = headers[c];
      const val = row[c] !== undefined ? row[c] : '';
      item[header] = val;
    }
    data.push(item);
  }

  return data;
}

module.exports = {
  parseCSV
};
