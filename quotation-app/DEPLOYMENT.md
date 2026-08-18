# Deployment

## Local review

Open `http://localhost/curtivelle/quotation-app/`. Without an API URL the app uses browser `localStorage`; use that mode only for UI testing.

## Google Sheets backend

1. Create a Google Sheet and open **Extensions → Apps Script**.
2. Copy `apps-script/Code.gs` and `apps-script/appsscript.json` into that project.
3. Run `setup()` once. It creates the customer, quotation, invoice, and version-log tabs.
4. Deploy as a Web App, copy its `/exec` URL, then save it under this app's **Settings**.

## Production security

A GitHub Pages app cannot safely hide an API key because its JavaScript is public. Do not connect real customer data to an Apps Script deployment open to **Anyone**.

For a small internal team, custom hosting is not required. The recommended production design is to serve the admin UI from Apps Script and restrict it to approved Google accounts, while the public Curtivelle website stays on GitHub Pages. Another valid route is adding Google Identity/OAuth allow-list verification before connecting this static frontend to production data.

Use a database-backed custom app when you need many users, granular roles, large volumes, advanced audit controls, or file storage.

## Pricing assumption

Curtain and sheer totals use `pieces × unit price`; measurements and pleat count are stored as details. Extra fabric, fittings, and accessories use `quantity × unit price`. Confirm and update this rule if Curtivelle prices by area or fabric consumption.
