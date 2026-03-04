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
//  2. Create two sheets (tabs) in the spreadsheet:
//     - Sheet 1: rename to "Form 1"
//     - Sheet 2: rename to "Form 2"
//
//  3. Click Extensions → Apps Script
//
//  4. Delete all existing code and paste THIS entire file
//
//  5. Click Deploy → New Deployment
//     - Type: Web app
//     - Execute as: Me
//     - Who has access: Anyone
//     - Click Deploy
//
//  6. Copy the Web App URL and paste into BOTH user_study1.html and user_study2.html
//
//  Routing:
//   - user_study1.html sends { study: 'form1', ... } → logged to "Form 1" sheet
//   - user_study2.html sends { study: 'form2', ... } → logged to "Form 2" sheet
//
//  Both forms contain mixed Ours vs OmniControl and Ours vs MaskedMimic comparisons.
//
//  URLs:
//   - https://anujithm.github.io/humanoid-user-study/user_study1.html (Part 1)
//   - https://anujithm.github.io/humanoid-user-study/user_study2.html (Part 2)
// ═══════════════════════════════════════════════════════════

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);

    // Route to the correct sheet based on the "study" field
    var sheetName;
    if (data.study === 'form2') {
      sheetName = 'Form 2';
    } else {
      sheetName = 'Form 1';  // default
    }

    // Get or create the target sheet
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }

    // Remove the "study" key from data so it doesn't clutter the sheet
    delete data.study;

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
      .createTextOutput(JSON.stringify({ status: 'success', sheet: sheetName }))
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
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'User Study Logger is running. Routes: form1 → Form 1, form2 → Form 2.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
