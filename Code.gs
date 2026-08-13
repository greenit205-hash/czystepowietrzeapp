/**
 * Smart Energy — Kalkulator Czyste Powietrze
 * Backend Google Apps Script: prosty magazyn klucz-wartość oparty o arkusz Google Sheets.
 * Odtwarza API window.storage (get/set/delete/list) używane w aplikacji.
 *
 * WDROŻENIE:
 * 1) Utwórz nowy arkusz Google Sheets (pusty, dowolna nazwa np. "SE Czyste Powietrze - dane").
 * 2) Rozszerzenia -> Apps Script. Wklej całą zawartość tego pliku, zapisz.
 * 3) Wdróż -> Nowe wdrożenie -> typ: Aplikacja internetowa (Web app).
 *    - Wykonaj jako: Ja (Twoje konto)
 *    - Kto ma dostęp: Każdy (Anyone) — wymagane, aby aplikacja z Netlify mogła się połączyć.
 * 4) Skopiuj adres URL wdrożenia (kończy się na /exec) i wklej go w aplikacji: ⚙ Cennik -> Synchronizacja.
 * 5) Przy każdej zmianie tego kodu trzeba zrobić "Zarządzaj wdrożeniami" -> edytuj -> nowa wersja.
 */

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var sheet = getSheet_();
    var action = body.action;

    if (action === 'set') {
      upsert_(sheet, body.key, JSON.stringify(body.value));
      return json_({ ok: true });
    }
    if (action === 'delete') {
      deleteKey_(sheet, body.key);
      return json_({ ok: true });
    }
    if (action === 'get') {
      var v = getValue_(sheet, body.key);
      return json_({ ok: true, value: v !== null ? JSON.parse(v) : null });
    }
    if (action === 'list') {
      return json_({ ok: true, keys: listKeys_(sheet, body.prefix || '') });
    }
    return json_({ ok: false, error: 'Nieznana akcja: ' + action });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  try {
    var sheet = getSheet_();
    var action = e.parameter.action;
    if (!action) return json_({ ok: true, info: 'Smart Energy — magazyn danych działa.' });
    if (action === 'get') {
      var v = getValue_(sheet, e.parameter.key);
      return json_({ ok: true, value: v !== null ? JSON.parse(v) : null });
    }
    if (action === 'list') {
      return json_({ ok: true, keys: listKeys_(sheet, e.parameter.prefix || '') });
    }
    return json_({ ok: false, error: 'Nieznana akcja: ' + action });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/* ---------- pomocnicze ---------- */

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('KV');
  if (!sh) {
    sh = ss.insertSheet('KV');
    sh.appendRow(['key', 'value', 'updatedAt']);
    sh.setFrozenRows(1);
  }
  return sh;
}

function findRow_(sheet, key) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === key) return i + 1;
  }
  return -1;
}

function upsert_(sheet, key, value) {
  var row = findRow_(sheet, key);
  var now = new Date().toISOString();
  if (row > 0) {
    sheet.getRange(row, 2).setValue(value);
    sheet.getRange(row, 3).setValue(now);
  } else {
    sheet.appendRow([key, value, now]);
  }
}

function getValue_(sheet, key) {
  var row = findRow_(sheet, key);
  if (row < 0) return null;
  return sheet.getRange(row, 2).getValue();
}

function deleteKey_(sheet, key) {
  var row = findRow_(sheet, key);
  if (row > 0) sheet.deleteRow(row);
}

function listKeys_(sheet, prefix) {
  var data = sheet.getDataRange().getValues();
  var out = [];
  for (var i = 1; i < data.length; i++) {
    var k = String(data[i][0]);
    if (k.indexOf(prefix) === 0) out.push(k);
  }
  return out;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
