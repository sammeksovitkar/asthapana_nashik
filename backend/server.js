require('dotenv').config(); 
const express = require('express');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const cors = require('cors');
const dns = require('dns');

dns.setDefaultResultOrder('ipv4first');

const app = express();
app.use(cors());
app.use(express.json());

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

const auth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  // Added a check: if key is missing, use empty string instead of crashing
  key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const doc = new GoogleSpreadsheet(SPREADSHEET_ID, auth);

async function getSheet() {
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['asthapana'];
    if (!sheet) throw new Error("Sheet 'asthapana' not found");
    return sheet;
}

// Helper function to handle data conversion
// Google Sheets cannot store Arrays, so we convert them to JSON strings
const prepareDataForSheet = (data) => {
    const prepared = { ...data };
    if (prepared.EL_Dates && Array.isArray(prepared.EL_Dates)) {
        prepared.EL_Dates = JSON.stringify(prepared.EL_Dates);
    }
    return prepared;
};

// Helper function to parse data coming FROM the sheet
const parseDataFromSheet = (obj) => {
    const parsed = { ...obj };
    if (parsed.EL_Dates) {
        try {
            // Convert the JSON string back into a real JavaScript Array
            parsed.EL_Dates = JSON.parse(parsed.EL_Dates);
        } catch (e) {
            parsed.EL_Dates = []; // Fallback if data is messy
        }
    }
    return parsed;
};

// --- API ROUTES ---

// 1. GET: Fetch all staff
app.get('/api/staff', async (req, res) => {
  try {
    const sheet = await getSheet();
    const rows = await sheet.getRows();
    const data = rows.map(row => ({
      id: row.rowNumber, 
      ...parseDataFromSheet(row.toObject())
    }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. PUT: Update existing staff
app.put('/api/staff/:id', async (req, res) => {
  try {
    const sheet = await getSheet();
    const rows = await sheet.getRows();
    const row = rows.find(r => r.rowNumber == req.params.id);
    
    if (row) {
      const dataToSave = prepareDataForSheet(req.body);

      sheet.headerValues.forEach((header) => {
        if (dataToSave[header] !== undefined) {
          row.set(header, dataToSave[header]); 
        }
      });

      await row.save(); 
      res.json({ message: "Update Success" });
    } else {
      res.status(404).json({ error: "Row not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. POST: Add new record
app.post('/api/staff', async (req, res) => {
  try {
    const sheet = await getSheet();
    const dataToSave = prepareDataForSheet(req.body);
    await sheet.addRow(dataToSave);
    res.status(201).json({ message: "Added Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. DELETE: Remove record
app.delete('/api/staff/:id', async (req, res) => {
  try {
    const sheet = await getSheet();
    const rows = await sheet.getRows();
    const row = rows.find(r => r.rowNumber == req.params.id);
    if (row) {
      await row.delete();
      res.json({ message: "Deleted Successfully" });
    } else {
        res.status(404).json({ error: "Row not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
module.exports = app;
// app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
