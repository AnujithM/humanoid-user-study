// ═══════════════════════════════════════════════════════════
//  Google Apps Script — User Study Response Logger
//  Paste this into Google Sheets > Extensions > Apps Script
// ═══════════════════════════════════════════════════════════
//
//  SETUP INSTRUCTIONS:
//  ───────────────────
//  1. Go to https://sheets.google.com → Create a new spreadsheet
//     Name it: "User Study Responses"
//
//  2. Click Extensions → Apps Script
//
//  3. Delete all existing code and paste THIS entire file
//
//  4. Click Deploy → New Deployment
//     - Type: Web app
//     - Execute as: Me
//     - Who has access: Anyone
//     - Click Deploy
//
//  5. Copy the Web App URL (looks like:
//     https://script.google.com/macros/s/AKfycb.../exec)
//
//  6. Paste that URL into user_study.html at line:
//     const GOOGLE_SCRIPT_URL = 'YOUR_URL_HERE';
//
//  That's it! Every form submission will now log to your sheet.
// ═══════════════════════════════════════════════════════════

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // If sheet is empty, write headers first
    if (sheet.getLastRow() === 0) {
      var headers = Object.keys(data);
      sheet.appendRow(headers);
    }

    // Get existing headers to ensure column order
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var row = headers.map(function(h) { return data[h] || ''; });

    // If new keys exist that aren't in headers, add them
    var newKeys = Object.keys(data).filter(function(k) { return headers.indexOf(k) === -1; });
    if (newKeys.length > 0) {
      newKeys.forEach(function(k) {
        headers.push(k);
        row.push(data[k] || '');
      });
      // Rewrite header row
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Allow GET requests to test the endpoint
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'User Study Logger is running.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
