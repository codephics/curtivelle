/**
 * Curtivelle Quotation CRM - Google Apps Script backend.
 * Bind this project to a Google Sheet, run setup(), then deploy as a Web App.
 */
const SHEETS = {
  customers: ['id', 'customerNo', 'name', 'phone', 'createdAt', 'updatedAt', 'deletedAt', 'json'],
  quotations: ['id', 'number', 'customerId', 'customerName', 'customerPhone', 'date', 'status', 'grandTotal', 'advanceReceived', 'dueAmount', 'createdAt', 'updatedAt', 'deletedAt', 'json'],
  invoices: ['id', 'number', 'quotationId', 'customerId', 'customerName', 'customerPhone', 'date', 'status', 'grandTotal', 'advanceReceived', 'dueAmount', 'createdAt', 'updatedAt', 'deletedAt', 'json'],
  versions: ['id', 'entityType', 'entityId', 'savedAt', 'json']
};

function setup() {
  const ss = SpreadsheetApp.getActive();
  Object.keys(SHEETS).forEach(name => {
    let sheet = ss.getSheetByName(name);
    if (!sheet) sheet = ss.insertSheet(name);
    const headers = SHEETS[name];
    if (sheet.getLastRow() === 0) sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#173f35').setFontColor('#ffffff');
    sheet.autoResizeColumns(1, Math.min(headers.length, 8));
  });
  return 'Curtivelle CRM sheets are ready.';
}

function doGet() {
  return json_({ ok: true, data: { service: 'Curtivelle CRM API', version: 1 } });
}

function doPost(e) {
  try {
    const request = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const action = request.action;
    if (!action || typeof handlers_[action] !== 'function') throw new Error('Unknown action');
    const data = handlers_[action](request);
    return json_({ ok: true, data: data });
  } catch (error) {
    return json_({ ok: false, error: error.message || String(error) });
  }
}

const handlers_ = {
  list: function(req) {
    assertType_(req.type);
    const rows = readAll_(req.type);
    return rows.filter(row => req.includeDeleted || !row.deletedAt);
  },
  get: function(req) {
    assertType_(req.type);
    return readAll_(req.type).find(row => row.id === req.id) || null;
  },
  save: function(req) {
    assertType_(req.type);
    if (!req.record || !req.record.id) throw new Error('Record id is required');
    const lock = LockService.getDocumentLock(); lock.waitLock(20000);
    try { return save_(req.type, req.record); } finally { lock.releaseLock(); }
  },
  remove: function(req) {
    assertType_(req.type);
    const record = readAll_(req.type).find(row => row.id === req.id);
    if (!record) throw new Error('Record not found');
    record.deletedAt = new Date().toISOString();
    return save_(req.type, record);
  },
  restore: function(req) {
    assertType_(req.type);
    const record = readAll_(req.type).find(row => row.id === req.id);
    if (!record) throw new Error('Record not found');
    record.deletedAt = null;
    return save_(req.type, record);
  },
  versions: function(req) {
    return readAll_('versions').filter(row => row.entityType === req.type && row.entityId === req.id).reverse();
  },
  nextNumber: function(req) {
    if (!['customer', 'quotation', 'invoice'].includes(req.type)) throw new Error('Invalid counter type');
    const lock = LockService.getDocumentLock(); lock.waitLock(20000);
    try {
      const props = PropertiesService.getDocumentProperties();
      const key = 'counter_' + req.type;
      const next = Number(props.getProperty(key) || 0) + 1;
      props.setProperty(key, String(next));
      const prefix = { customer: 'CUS', quotation: 'QT', invoice: 'INV' }[req.type];
      return prefix + '-' + new Date().getFullYear() + '-' + String(next).padStart(5, '0');
    } finally { lock.releaseLock(); }
  }
};

function save_(type, incoming) {
  const sheet = sheet_(type);
  const records = readAll_(type);
  const old = records.find(row => row.id === incoming.id);
  const now = new Date().toISOString();
  const record = Object.assign({}, old || {}, incoming, { updatedAt: now });
  if (!record.createdAt) record.createdAt = now;
  if (old) {
    append_('versions', { id: Utilities.getUuid(), entityType: type, entityId: old.id, savedAt: now, snapshot: old });
    const rowIndex = records.findIndex(row => row.id === incoming.id) + 2;
    sheet.getRange(rowIndex, 1, 1, SHEETS[type].length).setValues([toRow_(type, record)]);
  } else {
    sheet.appendRow(toRow_(type, record));
  }
  return record;
}

function append_(type, record) {
  sheet_(type).appendRow(toRow_(type, record));
}

function readAll_(type) {
  const sheet = sheet_(type);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  const values = sheet.getRange(2, 1, lastRow - 1, SHEETS[type].length).getValues();
  const jsonIndex = SHEETS[type].indexOf('json');
  return values.map(row => {
    try { return JSON.parse(row[jsonIndex] || '{}'); } catch (_) { return {}; }
  }).filter(row => row.id);
}

function toRow_(type, record) {
  const customer = record.customer || {};
  const flat = Object.assign({}, record, {
    customerId: record.customerId || customer.id || '',
    customerName: record.customerName || customer.name || '',
    customerPhone: record.customerPhone || customer.phone || '',
    json: JSON.stringify(record)
  });
  if (type === 'versions') flat.json = JSON.stringify(Object.assign({}, record, { snapshot: record.snapshot }));
  return SHEETS[type].map(key => flat[key] == null ? '' : flat[key]);
}

function sheet_(type) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(type);
  if (!sheet) throw new Error('Missing sheet "' + type + '". Run setup() first.');
  return sheet;
}

function assertType_(type) {
  if (!['customers', 'quotations', 'invoices'].includes(type)) throw new Error('Invalid record type');
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
