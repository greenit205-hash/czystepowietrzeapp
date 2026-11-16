/**
 * Czyste Powietrze – synchronizacja z Dyskiem Google
 * Smart Energy Marcin Błądek
 *
 * 1. Wpisz poniżej własne hasło (to samo wpiszesz potem w aplikacji na każdym urządzeniu).
 * 2. Wdróż jako aplikację internetową: Wykonaj jako „Ja”, Dostęp „Każdy”.
 * Szczegóły: INSTRUKCJA-SYNCHRONIZACJA.md w repozytorium.
 */
const HASLO = 'WPISZ-SWOJE-HASLO';
const FOLDER = 'Czyste Powietrze';

function doGet() {
  return out({ ok: true, info: 'Czyste Powietrze – skrypt synchronizacji działa. Adres wklej w aplikacji.' });
}

function doPost(e) {
  let req;
  try { req = JSON.parse(e.postData.contents); } catch (err) { return out({ ok: false, error: 'Nieprawidłowe dane' }); }
  if (!HASLO || HASLO === 'WPISZ-SWOJE-HASLO') return out({ ok: false, error: 'Ustaw hasło w skrypcie (stała HASLO) i wdróż nową wersję' });
  if (req.haslo !== HASLO) return out({ ok: false, error: 'Nieprawidłowe hasło' });
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const res = handle(req);
    return out(Object.assign({ ok: true }, res));
  } catch (err) {
    return out({ ok: false, error: String((err && err.message) || err) });
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}

function out(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function root() {
  const it = DriveApp.getFoldersByName(FOLDER);
  return it.hasNext() ? it.next() : DriveApp.createFolder(FOLDER);
}
function sub(name) {
  const r = root();
  const it = r.getFoldersByName(name);
  return it.hasNext() ? it.next() : r.createFolder(name);
}
function findFile(folder, name) {
  const it = folder.getFilesByName(name);
  return it.hasNext() ? it.next() : null;
}
function writeJson(folder, name, obj) {
  const txt = JSON.stringify(obj);
  const ex = findFile(folder, name);
  if (ex) ex.setContent(txt); else folder.createFile(name, txt, 'application/json');
}
function readJson(file) {
  try { return JSON.parse(file.getBlob().getDataAsString('UTF-8')); } catch (e) { return null; }
}
function readTomb() {
  const f = findFile(sub('dane'), '_usuniete.json');
  return (f && readJson(f)) || {};
}

/* nazwa pliku bezpieczna dla Dysku */
function plik(id) {
  return String(id).replace(/[^A-Za-z0-9_\-]/g, '_') + '.json';
}

function handle(r) {
  switch (r.akcja) {
    case 'ping':
      return { folder: root().getUrl() };

    case 'lista': {
      const dane = sub('dane');
      const kalkulacje = [];
      let cennik = null, licznik = null;
      const it = dane.getFiles();
      while (it.hasNext()) {
        const f = it.next();
        const n = f.getName();
        if (!/\.json$/.test(n) || f.isTrashed()) continue;
        const o = readJson(f);
        if (!o) continue;
        if (n === '_cennik.json') cennik = o;
        else if (n === '_licznik.json') licznik = o;
        else if (n.charAt(0) !== '_') kalkulacje.push(o);
      }
      return { kalkulacje: kalkulacje, cennik: cennik, licznik: licznik, usuniete: readTomb() };
    }

    case 'zapiszKalkulacje':
      if (!r.kalkulacja || !r.kalkulacja.id) throw new Error('Brak kalkulacji');
      writeJson(sub('dane'), plik(r.kalkulacja.id), r.kalkulacja);
      return {};

    case 'usunKalkulacje': {
      const f = findFile(sub('dane'), plik(r.id));
      if (f) f.setTrashed(true); // trafia do kosza Dysku, można przywrócić
      const t = readTomb();
      t[r.id] = Date.now();
      writeJson(sub('dane'), '_usuniete.json', t);
      return {};
    }

    case 'zapiszCennik':
      writeJson(sub('dane'), '_cennik.json', r.cennik);
      return {};

    case 'zapiszLicznik':
      writeJson(sub('dane'), '_licznik.json', r.licznik);
      return {};
  }
  throw new Error('Nieznana akcja: ' + r.akcja);
}
