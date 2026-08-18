(() => {
  'use strict';

  const CURRENCY = new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 2 });
  const DATE = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' });
  const DEFAULT_TERMS = `• Quotation validity: 15 days from issue date.\n• Custom designs cannot be changed after approval and production start.\n• Advance payments and custom-made products are non-refundable.\n• Final measurements must be verified before production; customer-provided measurements remain the customer's responsibility.\n• Installation schedule depends on site readiness and access.\n• Fabric shade, texture and pattern alignment may vary slightly between batches.\n• Products remain the property of Curtivelle until full payment is received.`;
  const DB_KEY = 'curtivelle_crm_v1';
  const CONFIG_KEY = 'curtivelle_crm_config';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const uid = (prefix) => `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const n = (value) => Number(value) || 0;
  const money = (value) => CURRENCY.format(n(value)).replace('BDT', '৳');
  const dateText = (value) => value ? DATE.format(new Date(value)) : '—';
  const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const today = () => new Date().toISOString().slice(0, 10);

  const defaultDb = () => ({ customers: [], quotations: [], invoices: [], versions: [], counter: { customer: 0, quotation: 0, invoice: 0 } });
  const loadConfig = () => ({ apiUrl: '', businessName: 'Curtivelle', ...JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}') });
  const saveConfig = (config) => localStorage.setItem(CONFIG_KEY, JSON.stringify(config));

  class LocalStore {
    constructor() { this.db = { ...defaultDb(), ...JSON.parse(localStorage.getItem(DB_KEY) || '{}') }; }
    persist() { localStorage.setItem(DB_KEY, JSON.stringify(this.db)); }
    async list(type, includeDeleted = false) { return clone(this.db[type].filter(x => includeDeleted || !x.deletedAt)); }
    async get(type, id) { return clone(this.db[type].find(x => x.id === id)); }
    async save(type, record) {
      const now = new Date().toISOString();
      const index = this.db[type].findIndex(x => x.id === record.id);
      if (index >= 0) {
        this.db.versions.push({ id: uid('VER'), entityType: type, entityId: record.id, savedAt: now, snapshot: clone(this.db[type][index]) });
        this.db[type][index] = { ...this.db[type][index], ...clone(record), updatedAt: now };
      } else {
        this.db[type].push({ ...clone(record), createdAt: now, updatedAt: now, deletedAt: null });
      }
      this.persist();
      return clone(record);
    }
    async remove(type, id) { const record = await this.get(type, id); if (record) await this.save(type, { ...record, deletedAt: new Date().toISOString() }); }
    async restore(type, id) { const record = await this.get(type, id); if (record) await this.save(type, { ...record, deletedAt: null }); }
    async versions(type, id) { return clone(this.db.versions.filter(v => v.entityType === type && v.entityId === id).reverse()); }
    async nextNumber(type) {
      this.db.counter[type] = n(this.db.counter[type]) + 1;
      this.persist();
      const prefix = { customer: 'CUS', quotation: 'QT', invoice: 'INV' }[type];
      return `${prefix}-${new Date().getFullYear()}-${String(this.db.counter[type]).padStart(5, '0')}`;
    }
  }

  class ApiStore {
    constructor(url) { this.url = url; }
    async call(action, payload = {}) {
      const response = await fetch(this.url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action, ...payload }) });
      const result = await response.json();
      if (!result.ok) throw new Error(result.error || 'Server request failed');
      return result.data;
    }
    list(type, includeDeleted = false) { return this.call('list', { type, includeDeleted }); }
    get(type, id) { return this.call('get', { type, id }); }
    save(type, record) { return this.call('save', { type, record }); }
    remove(type, id) { return this.call('remove', { type, id }); }
    restore(type, id) { return this.call('restore', { type, id }); }
    versions(type, id) { return this.call('versions', { type, id }); }
    nextNumber(type) { return this.call('nextNumber', { type }); }
  }

  const state = { config: loadConfig(), store: null };
  const setStore = () => {
    state.store = state.config.apiUrl ? new ApiStore(state.config.apiUrl) : new LocalStore();
    $('#connectionDot').classList.toggle('online', Boolean(state.config.apiUrl));
    $('#connectionText').textContent = state.config.apiUrl ? 'Google Sheets connected' : 'Local demo mode';
  };
  const toast = (message) => { const el = $('#toast'); el.textContent = message; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 2600); };
  const setHeading = (title, subtitle = '') => { $('#pageTitle').textContent = title; $('#pageSubtitle').textContent = subtitle; };

  function statusBadge(status) {
    const className = ['paid', 'completed'].includes(status) ? 'paid' : ['pending', 'partial'].includes(status) ? 'due' : '';
    return `<span class="badge ${className}">${escapeHtml(status || 'draft')}</span>`;
  }

  async function dashboard() {
    setHeading('ড্যাশবোর্ড', 'Curtivelle business overview');
    const [customers, quotations, invoices] = await Promise.all(['customers', 'quotations', 'invoices'].map(x => state.store.list(x)));
    const sales = invoices.reduce((s, x) => s + n(x.grandTotal), 0);
    const due = invoices.reduce((s, x) => s + n(x.dueAmount), 0);
    const completed = invoices.filter(x => x.status === 'completed' || x.status === 'paid').length;
    const months = [...Array(6)].map((_, i) => { const d = new Date(); d.setMonth(d.getMonth() - (5 - i)); return { key: d.toISOString().slice(0, 7), label: d.toLocaleString('en', { month: 'short' }), total: 0 }; });
    invoices.forEach(inv => { const month = months.find(m => m.key === String(inv.date || '').slice(0, 7)); if (month) month.total += n(inv.grandTotal); });
    const max = Math.max(...months.map(m => m.total), 1);
    const recent = [...quotations].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))).slice(0, 6);
    $('#app').innerHTML = `
      <div class="stats">
        <div class="stat"><span>মোট কাস্টমার</span><strong>${customers.length}</strong></div>
        <div class="stat"><span>মোট কোটেশন</span><strong>${quotations.length}</strong></div>
        <div class="stat"><span>মোট ইনভয়েস</span><strong>${invoices.length}</strong></div>
        <div class="stat accent"><span>মোট সেলস</span><strong>${money(sales)}</strong></div>
        <div class="stat"><span>পেন্ডিং / সম্পন্ন</span><strong>${money(due)} / ${completed}</strong></div>
      </div>
      <div class="dashboard-grid">
        <div class="card"><div class="card-head"><h2>সাম্প্রতিক কোটেশন</h2><a class="btn btn-secondary" href="#quotations">সব দেখুন</a></div>${recordTable('quotations', recent)}</div>
        <div class="card"><div class="card-head"><h2>মাসিক সেলস</h2></div><div class="chart">${months.map(m => `<div class="bar-wrap" title="${money(m.total)}"><div class="bar" style="height:${Math.max(2, m.total / max * 100)}%"></div><small>${m.label}</small></div>`).join('')}</div></div>
      </div>`;
  }

  function recordTable(type, rows) {
    if (!rows.length) return '<div class="empty">এখনও কোনো রেকর্ড নেই</div>';
    const isCustomers = type === 'customers';
    return `<div class="table-wrap"><table><thead><tr>${isCustomers ? '<th>Customer ID</th><th>নাম</th><th>ফোন</th>' : '<th>নম্বর</th><th>কাস্টমার</th><th>তারিখ</th><th>টোটাল</th><th>স্ট্যাটাস</th>'}<th class="no-print">অ্যাকশন</th></tr></thead><tbody>${rows.map(row => `<tr>${isCustomers
      ? `<td>${escapeHtml(row.customerNo)}</td><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.phone)}</td>`
      : `<td>${escapeHtml(row.number)}</td><td>${escapeHtml(row.customer?.name)}</td><td>${dateText(row.date)}</td><td>${money(row.grandTotal)}</td><td>${statusBadge(row.status)}</td>`}
      <td class="actions no-print">${type === 'quotations' ? `<a class="btn btn-secondary" href="#quotation/${row.id}">খুলুন</a>` : ''}${type === 'invoices' ? `<button class="btn btn-secondary" data-print="${row.id}">প্রিন্ট</button>` : ''}<button class="btn btn-danger" data-delete="${type}:${row.id}">ডিলিট</button></td></tr>`).join('')}</tbody></table></div>`;
  }

  async function listPage(type) {
    const labels = { customers: ['কাস্টমার', 'Central customer database'], quotations: ['কোটেশন', 'Search, filter and manage quotations'], invoices: ['ইনভয়েস', 'Sales and payment tracking'] }[type];
    setHeading(...labels);
    const rows = await state.store.list(type);
    $('#app').innerHTML = `<div class="card"><div class="card-head"><h2>${labels[0]} লিস্ট</h2><div class="actions no-print"><button class="btn btn-secondary" id="exportCsv">CSV</button><button class="btn btn-secondary" id="printList">PDF / Print</button></div></div><div class="searchbar"><input id="recordSearch" type="search" placeholder="নাম, ফোন, ID, নম্বর, স্ট্যাটাস বা তারিখ দিয়ে খুঁজুন"><input id="fromDate" type="date" aria-label="From date"><input id="toDate" type="date" aria-label="To date"></div><div id="records">${recordTable(type, rows)}</div></div>`;
    const render = () => {
      const q = $('#recordSearch').value.toLowerCase(); const from = $('#fromDate').value; const to = $('#toDate').value;
      const filtered = rows.filter(row => {
        const haystack = JSON.stringify(row).toLowerCase(); const date = row.date || row.createdAt?.slice(0, 10) || '';
        return haystack.includes(q) && (!from || date >= from) && (!to || date <= to);
      });
      $('#records').innerHTML = recordTable(type, filtered);
      bindRecordActions();
      $('#exportCsv').onclick = () => exportCsv(type, filtered);
    };
    ['recordSearch', 'fromDate', 'toDate'].forEach(id => $(`#${id}`).addEventListener('input', render));
    $('#printList').onclick = () => window.print();
    render();
  }

  function bindRecordActions() {
    $$('[data-delete]').forEach(btn => btn.onclick = async () => {
      const [type, id] = btn.dataset.delete.split(':');
      if (!confirm('রেকর্ডটি রিসাইকেল বিনে পাঠাবেন?')) return;
      await state.store.remove(type, id); toast('রেকর্ড soft-delete করা হয়েছে'); route();
    });
    $$('[data-print]').forEach(btn => btn.onclick = async () => showInvoice(await state.store.get('invoices', btn.dataset.print)));
  }

  async function trashPage() {
    setHeading('রিসাইকেল বিন', 'Restore soft-deleted records');
    const groups = await Promise.all(['customers', 'quotations', 'invoices'].map(t => state.store.list(t, true).then(rows => [t, rows.filter(x => x.deletedAt)])));
    $('#app').innerHTML = groups.map(([type, rows]) => `<div class="card" style="margin-bottom:16px"><div class="card-head"><h2>${type}</h2></div>${rows.length ? `<div class="table-wrap"><table><tbody>${rows.map(x => `<tr><td>${escapeHtml(x.number || x.customerNo)}</td><td>${escapeHtml(x.name || x.customer?.name)}</td><td>${dateText(x.deletedAt)}</td><td><button class="btn btn-secondary" data-restore="${type}:${x.id}">Restore</button></td></tr>`).join('')}</tbody></table></div>` : '<div class="empty">কোনো deleted record নেই</div>'}</div>`).join('');
    $$('[data-restore]').forEach(btn => btn.onclick = async () => { const [type, id] = btn.dataset.restore.split(':'); await state.store.restore(type, id); toast('রেকর্ড restore হয়েছে'); trashPage(); });
  }

  const blankLine = () => ({ modelCode: '', height: '', width: '', pleatCount: '', fabric: '', design: '', pieces: 1, unitPrice: '', total: 0 });
  const blankExtra = () => ({ description: '', quantity: 1, unit: '', unitPrice: '', total: 0 });
  const blankRoom = (name = 'Master Bedroom') => ({ id: uid('ROOM'), name, curtains: [blankLine()], sheers: [blankLine()], extraFabric: [blankExtra()], fittings: [blankExtra()], accessories: [blankExtra()], total: 0 });
  const blankQuote = async () => ({ id: uid('QUOTE'), number: await state.store.nextNumber('quotation'), date: today(), validUntil: new Date(Date.now() + 15 * 86400000).toISOString().slice(0,10), status: 'draft', customer: { id: '', customerNo: '', name: '', phone: '', profession: '', address: '' }, rooms: [blankRoom()], discount: 0, advanceReceived: 0, subtotal: 0, grandTotal: 0, dueAmount: 0, paymentTerms: '30% advance, remaining payment before/at installation.', terms: DEFAULT_TERMS, notes: '' });

  async function quotationPage(id) {
    const quote = id ? await state.store.get('quotations', id) : await blankQuote();
    if (!quote) { toast('কোটেশন পাওয়া যায়নি'); location.hash = '#quotations'; return; }
    setHeading(id ? quote.number : 'নতুন কোটেশন', 'Room-wise curtain quotation builder');
    $('#app').innerHTML = `<form id="quotationForm" class="quotation-layout">
      <div class="quotation-main">
        <section class="card"><div class="card-head"><h2>কাস্টমার ও কোটেশন তথ্য</h2></div><div class="form-grid">
          <label>নাম<input name="customerName" required value="${escapeHtml(quote.customer.name)}"></label>
          <label>ফোন<input name="customerPhone" required value="${escapeHtml(quote.customer.phone)}"></label>
          <label>প্রফেশন<input name="customerProfession" value="${escapeHtml(quote.customer.profession)}"></label>
          <label>Customer ID<input name="customerNo" value="${escapeHtml(quote.customer.customerNo)}" readonly placeholder="Auto"></label>
          <label class="span-2">অ্যাড্রেস<textarea name="customerAddress">${escapeHtml(quote.customer.address)}</textarea></label>
          <label>কোটেশন নম্বর<input value="${escapeHtml(quote.number)}" readonly></label>
          <label>তারিখ<input name="date" type="date" value="${quote.date}"></label>
          <label>Valid until<input name="validUntil" type="date" value="${quote.validUntil}"></label>
          <label>Status<select name="status">${['draft','sent','approved','rejected'].map(x => `<option ${quote.status === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
        </div></section>
        <div><div class="section-title"><h2>রুমসমূহ</h2><button class="btn btn-secondary no-print" type="button" id="addRoom">+ রুম যোগ করুন</button></div><div id="rooms"></div></div>
        <section class="card"><div class="card-head"><h2>পেমেন্ট ও শর্তাবলি</h2></div><div class="form-grid">
          <label>Discount<input name="discount" type="number" min="0" step="0.01" value="${n(quote.discount)}"></label>
          <label>Advance received<input name="advanceReceived" type="number" min="0" step="0.01" value="${n(quote.advanceReceived)}"></label>
          <label class="span-2">Payment terms<textarea name="paymentTerms">${escapeHtml(quote.paymentTerms)}</textarea></label>
          <label class="span-4">Terms & conditions<textarea name="terms" rows="8">${escapeHtml(quote.terms)}</textarea></label>
          <label class="span-4">Notes<textarea name="notes">${escapeHtml(quote.notes)}</textarea></label>
        </div></section>
      </div>
      <aside class="card quote-summary"><div class="card-head"><h2>Project Summary</h2></div><div id="roomSummary"></div><div class="summary-line"><span>Subtotal</span><strong id="subtotal">৳0</strong></div><div class="summary-line"><span>Discount</span><strong id="discountTotal">৳0</strong></div><div class="summary-line grand"><span>Grand total</span><strong id="grandTotal">৳0</strong></div><div class="summary-line"><span>Advance</span><strong id="advanceTotal">৳0</strong></div><div class="summary-line due"><span>Due amount</span><strong id="dueTotal">৳0</strong></div><div class="actions no-print" style="margin-top:18px"><button class="btn btn-primary" type="submit">সেভ করুন</button>${id ? '<button class="btn btn-secondary" type="button" id="convertInvoice">Convert to Invoice</button><button class="btn btn-secondary" type="button" id="printQuote">PDF / Print</button>' : ''}</div></aside>
    </form>`;

    const roomsRoot = $('#rooms');
    const renderRooms = () => { roomsRoot.innerHTML = ''; quote.rooms.forEach((room, index) => roomsRoot.appendChild(roomElement(room, index, quote, renderRooms))); calculateQuote(quote); };
    $('#addRoom').onclick = () => { quote.rooms.push(blankRoom(`Room ${quote.rooms.length + 1}`)); renderRooms(); };
    $('#quotationForm').addEventListener('input', () => calculateQuote(quote));
    $('#quotationForm').onsubmit = async (event) => { event.preventDefault(); await saveQuotation(quote); };
    if ($('#convertInvoice')) $('#convertInvoice').onclick = async () => convertToInvoice(quote);
    if ($('#printQuote')) $('#printQuote').onclick = () => window.print();
    renderRooms();
  }

  function roomElement(room, index, quote, rerender) {
    const wrap = document.createElement('section'); wrap.className = 'room-card';
    wrap.innerHTML = `<div class="room-head"><input class="room-name" value="${escapeHtml(room.name)}" aria-label="Room name"><output>${money(room.total)}</output><button class="icon-btn danger no-print remove-room" type="button" title="Remove room">×</button></div><div class="room-body"></div>`;
    const body = $('.room-body', wrap);
    [['curtains','কার্টেন'], ['sheers','শিয়ার']].forEach(([key, label]) => body.appendChild(lineSection(room, key, label, quote)));
    [['extraFabric','এক্সট্রা ফেব্রিক'], ['fittings','ফিটিংস'], ['accessories','অ্যাক্সেসরিজ']].forEach(([key, label]) => body.appendChild(extraSection(room, key, label, quote)));
    $('.room-name', wrap).oninput = e => { room.name = e.target.value; calculateQuote(quote); };
    $('.remove-room', wrap).onclick = () => { if (quote.rooms.length === 1) return toast('কমপক্ষে একটি রুম রাখতে হবে'); quote.rooms.splice(index, 1); rerender(); };
    return wrap;
  }

  function lineSection(room, key, label, quote) {
    const el = document.createElement('div'); el.className = 'item-section';
    el.innerHTML = `<div class="item-section-head"><h3>${label}</h3><button type="button" class="btn btn-secondary no-print">+ আইটেম</button></div><div class="line-item column-labels"><span>মডেল</span><span>হাইট</span><span>উইডথ</span><span>কুচি</span><span>ফেব্রিক</span><span>ডিজাইন</span><span>পিস</span><span>ইউনিট মূল্য</span><span>টোটাল</span></div><div class="rows"></div>`;
    const render = () => {
      const rows = $('.rows', el); rows.innerHTML = '';
      room[key].forEach((item, index) => {
        const row = $('#lineItemTemplate').content.firstElementChild.cloneNode(true);
        $$('[data-field]', row).forEach(input => { const field = input.dataset.field; if (input.tagName === 'OUTPUT') input.textContent = money(item.total); else { input.value = item[field] ?? ''; input.oninput = () => { item[field] = input.value; calculateQuote(quote); }; } });
        $('.remove-row', row).onclick = () => { room[key].splice(index, 1); render(); calculateQuote(quote); };
        rows.appendChild(row);
      });
    };
    $('button', el).onclick = () => { room[key].push(blankLine()); render(); };
    el._refresh = render; render(); return el;
  }

  function extraSection(room, key, label, quote) {
    const el = document.createElement('div'); el.className = 'item-section';
    el.innerHTML = `<div class="item-section-head"><h3>${label}</h3><button type="button" class="btn btn-secondary no-print">+ আইটেম</button></div><div class="rows"></div>`;
    const render = () => {
      const rows = $('.rows', el); rows.innerHTML = '';
      room[key].forEach((item, index) => {
        const row = $('#extraItemTemplate').content.firstElementChild.cloneNode(true);
        $$('[data-field]', row).forEach(input => { const field = input.dataset.field; if (input.tagName === 'OUTPUT') input.textContent = money(item.total); else { input.value = item[field] ?? ''; input.oninput = () => { item[field] = input.value; calculateQuote(quote); }; } });
        $('.remove-row', row).onclick = () => { room[key].splice(index, 1); render(); calculateQuote(quote); };
        rows.appendChild(row);
      });
    };
    $('button', el).onclick = () => { room[key].push(blankExtra()); render(); };
    render(); return el;
  }

  function calculateQuote(quote) {
    quote.rooms.forEach((room, i) => {
      ['curtains','sheers'].forEach(key => room[key].forEach(item => item.total = n(item.pieces) * n(item.unitPrice)));
      ['extraFabric','fittings','accessories'].forEach(key => room[key].forEach(item => item.total = n(item.quantity) * n(item.unitPrice)));
      room.total = ['curtains','sheers','extraFabric','fittings','accessories'].flatMap(key => room[key]).reduce((s, item) => s + n(item.total), 0);
      const roomEl = $$('.room-card')[i]; if (roomEl) { $('.room-head output', roomEl).textContent = money(room.total); $$('[data-field="total"]', roomEl).forEach((out, idx) => { const items = ['curtains','sheers','extraFabric','fittings','accessories'].flatMap(key => room[key]); out.textContent = money(items[idx]?.total); }); }
    });
    const form = $('#quotationForm');
    quote.subtotal = quote.rooms.reduce((s, room) => s + n(room.total), 0);
    quote.discount = n(form?.elements.discount.value ?? quote.discount);
    quote.advanceReceived = n(form?.elements.advanceReceived.value ?? quote.advanceReceived);
    quote.grandTotal = Math.max(0, quote.subtotal - quote.discount);
    quote.dueAmount = Math.max(0, quote.grandTotal - quote.advanceReceived);
    $('#roomSummary').innerHTML = quote.rooms.map(room => `<div class="summary-line"><span>${escapeHtml(room.name)}</span><strong>${money(room.total)}</strong></div>`).join('');
    $('#subtotal').textContent = money(quote.subtotal); $('#discountTotal').textContent = money(quote.discount); $('#grandTotal').textContent = money(quote.grandTotal); $('#advanceTotal').textContent = money(quote.advanceReceived); $('#dueTotal').textContent = money(quote.dueAmount);
  }

  async function saveQuotation(quote) {
    const form = $('#quotationForm');
    if (!form.reportValidity()) return;
    const customer = { ...quote.customer, name: form.elements.customerName.value.trim(), phone: form.elements.customerPhone.value.trim(), profession: form.elements.customerProfession.value.trim(), address: form.elements.customerAddress.value.trim() };
    const customers = await state.store.list('customers');
    const existing = customers.find(x => x.id === customer.id || x.phone.replace(/\D/g,'') === customer.phone.replace(/\D/g,''));
    if (existing) Object.assign(customer, existing, customer); else { customer.id = uid('CUSTOMER'); customer.customerNo = await state.store.nextNumber('customer'); }
    await state.store.save('customers', customer);
    Object.assign(quote, { customer, date: form.elements.date.value, validUntil: form.elements.validUntil.value, status: form.elements.status.value, paymentTerms: form.elements.paymentTerms.value, terms: form.elements.terms.value, notes: form.elements.notes.value });
    calculateQuote(quote); await state.store.save('quotations', quote); toast('কোটেশন সেভ হয়েছে'); location.hash = `#quotation/${quote.id}`;
  }

  async function convertToInvoice(quote) {
    if (!confirm('এই কোটেশন থেকে ইনভয়েস তৈরি করবেন?')) return;
    const invoices = await state.store.list('invoices');
    const duplicate = invoices.find(x => x.quotationId === quote.id);
    if (duplicate) return showInvoice(duplicate);
    const invoice = { ...clone(quote), id: uid('INVOICE'), number: await state.store.nextNumber('invoice'), quotationId: quote.id, quotationNumber: quote.number, date: today(), status: quote.dueAmount <= 0 ? 'paid' : quote.advanceReceived > 0 ? 'partial' : 'pending' };
    await state.store.save('invoices', invoice); await state.store.save('quotations', { ...quote, status: 'approved', invoiceId: invoice.id }); toast('ইনভয়েস তৈরি হয়েছে'); showInvoice(invoice);
  }

  function showInvoice(invoice) {
    $('#modalRoot').innerHTML = `<div class="modal-backdrop"><div class="modal"><div class="card-head no-print"><h2>${escapeHtml(invoice.number)}</h2><button class="icon-btn" id="closeModal">×</button></div><div id="invoicePrint"><h2>${escapeHtml(state.config.businessName)}</h2><p><strong>Invoice:</strong> ${escapeHtml(invoice.number)} · <strong>Date:</strong> ${dateText(invoice.date)}</p><p><strong>Customer:</strong> ${escapeHtml(invoice.customer.name)} · ${escapeHtml(invoice.customer.phone)}<br>${escapeHtml(invoice.customer.address)}</p>${invoice.rooms.map(room => `<h3>${escapeHtml(room.name)} — ${money(room.total)}</h3>`).join('')}<hr><p><strong>Grand total:</strong> ${money(invoice.grandTotal)}<br><strong>Advance received:</strong> ${money(invoice.advanceReceived)}<br><strong>Due:</strong> ${money(invoice.dueAmount)}</p></div><div class="actions no-print"><button class="btn btn-primary" id="modalPrint">Print / Save PDF</button></div></div></div>`;
    $('#closeModal').onclick = () => $('#modalRoot').innerHTML = '';
    $('#modalPrint').onclick = () => window.print();
  }

  async function settingsPage() {
    setHeading('সেটিংস', 'Google Apps Script connection');
    $('#app').innerHTML = `<div class="card" style="max-width:760px"><div class="card-head"><h2>Backend configuration</h2></div><p>API URL ফাঁকা থাকলে browser localStorage-এ demo data থাকবে। Production-এ Apps Script Web App URL দিন।</p><form id="settingsForm" class="form-grid"><label class="span-4">Business name<input name="businessName" value="${escapeHtml(state.config.businessName)}"></label><label class="span-4">Apps Script Web App URL<input name="apiUrl" type="url" value="${escapeHtml(state.config.apiUrl)}" placeholder="https://script.google.com/macros/s/.../exec"></label><div class="span-4 actions"><button class="btn btn-primary">সেভ করুন</button><button class="btn btn-danger" type="button" id="disconnect">Local mode</button></div></form></div>`;
    $('#settingsForm').onsubmit = e => { e.preventDefault(); state.config = { businessName: e.target.elements.businessName.value, apiUrl: e.target.elements.apiUrl.value.trim() }; saveConfig(state.config); setStore(); toast('সেটিংস সেভ হয়েছে'); dashboard(); };
    $('#disconnect').onclick = () => { state.config.apiUrl = ''; saveConfig(state.config); setStore(); settingsPage(); };
  }

  function exportCsv(type, rows) {
    const data = rows.map(row => type === 'customers' ? { customer_id: row.customerNo, name: row.name, phone: row.phone, profession: row.profession, address: row.address, created_at: row.createdAt } : { number: row.number, customer_id: row.customer?.customerNo, customer: row.customer?.name, phone: row.customer?.phone, date: row.date, status: row.status, grand_total: row.grandTotal, advance: row.advanceReceived, due: row.dueAmount });
    if (!data.length) return toast('Export করার মতো data নেই');
    const headers = Object.keys(data[0]); const cell = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = '\ufeff' + [headers.join(','), ...data.map(row => headers.map(h => cell(row[h])).join(','))].join('\r\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); a.download = `curtivelle-${type}-${today()}.csv`; a.click(); URL.revokeObjectURL(a.href);
  }

  async function route() {
    try {
      const parts = location.hash.replace(/^#\/?/, '').split('/'); const page = parts[0] || 'dashboard';
      $$('.nav a').forEach(a => a.classList.toggle('active', a.dataset.route === (page === 'quotation' ? 'quotation' : page)));
      if (page === 'dashboard') await dashboard();
      else if (page === 'quotation') await quotationPage(parts[1] === 'new' ? null : parts[1]);
      else if (['customers','quotations','invoices'].includes(page)) await listPage(page);
      else if (page === 'trash') await trashPage();
      else if (page === 'settings') await settingsPage();
      else location.hash = '#dashboard';
      bindRecordActions(); $('#sidebar').classList.remove('open');
    } catch (error) { console.error(error); $('#app').innerHTML = `<div class="card"><h2>ডেটা লোড করা যায়নি</h2><p>${escapeHtml(error.message)}</p><p>Settings থেকে backend URL যাচাই করুন অথবা Local mode ব্যবহার করুন।</p></div>`; }
  }

  setStore();
  window.addEventListener('hashchange', route);
  $('#quickQuotation').onclick = () => location.hash = '#quotation/new';
  $('#menuToggle').onclick = () => $('#sidebar').classList.toggle('open');
  route();
})();
