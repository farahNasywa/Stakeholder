import googleSheetService from '../services/googleSheetService.js';
import Justification from "../models/justificationModel.js";


const getData = async (req, res) => {
  try {
    const { spreadsheetId } = req.params;
    const { range } = req.query;

    if (!spreadsheetId) {
      return res.status(400).json({ success: false, message: 'spreadsheetId wajib ada' });
    }
    if (!range) {
      return res.status(400).json({ success: false, message: 'range wajib ada' });
    }

    const data = await googleSheetService.getData(spreadsheetId, range);
    return res.json({ success: true, data });
  } catch (err) {
    console.error('getData error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const addData = async (req, res) => {
  try {
    const { spreadsheetId } = req.params;
    const { range, values } = req.body || {};

    if (!spreadsheetId) {
      return res.status(400).json({ success: false, message: 'spreadsheetId wajib ada' });
    }
    if (!range) {
      return res.status(400).json({ success: false, message: 'range wajib ada' });
    }
    if (!Array.isArray(values)) {
      return res.status(400).json({ success: false, message: 'values harus array of arrays' });
    }

    const result = await googleSheetService.addData(spreadsheetId, range, values);
    return res.json({ success: true, result });
  } catch (err) {
    console.error('addData error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const saveAnswers = async (req, res) => {
  try {
    const { spreadsheetId } = req.params;
    const { row, clusterId, answers } = req.body || {};

    console.log('REQ BODY:', JSON.stringify(req.body, null, 2));

    if (!spreadsheetId) {
      return res.status(400).json({ success: false, message: 'spreadsheetId wajib ada di params' });
    }
    if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'answers wajib object key->value' });
    }

    let rowNum = null;
    if (row !== undefined && row !== null && row !== '') {
      rowNum = Number(row);
      if (!Number.isFinite(rowNum) || rowNum <= 0 || Math.floor(rowNum) !== rowNum) {
        return res.status(400).json({ success: false, message: 'row harus angka baris valid jika dikirim (contoh: 3)' });
      }
    }

    const usedRow = await googleSheetService.saveAnswers(spreadsheetId, rowNum, answers, clusterId);
    return res.json({ success: true, message: `Jawaban disimpan ke D${usedRow}:AH${usedRow}` });
  } catch (err) {
    console.error('saveAnswers error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const saveForm = async (req, res) => {
  try {
    const { spreadsheetId } = req.params;
    const { formData } = req.body;

    if (!spreadsheetId) {
      return res.status(400).json({ success: false, message: 'spreadsheetId wajib ada' });
    }
    if (!formData) {
      return res.status(400).json({ success: false, message: 'formData wajib ada' });
    }

    console.log("[Controller] Data diterima dari frontend:", formData);

    const result = await googleSheetService.saveForm(spreadsheetId, formData);
    return res.json({ success: true, result });
  } catch (err) {
    console.error("Error in saveForm controller:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getLevels = async (req, res) => {
  try {
    const { spreadsheetId } = req.params;

    if (!spreadsheetId) {
      return res.status(400).json({ success: false, message: 'spreadsheetId wajib ada' });
    }

    const levels = await googleSheetService.getLevelsFromSheet(spreadsheetId);
    console.log('Levels retrieved:', levels);

    return res.json({ success: true, data: levels });
  } catch (err) {
    console.error("Error getLevels:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getJustification = async (req, res) => {
  try {
    const { spreadsheetId } = req.params;
    const { range = "'All in One'!D91:G" } = req.query;


    if (!spreadsheetId) {
      return res.status(400).json({ success: false, message: "spreadsheetId wajib ada" });
    }

    const values = await googleSheetService.getData(spreadsheetId, range);
    return res.json({ success: true, data: values });
  } catch (err) {
    console.error("Error getJustification:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const saveJustification = async (req, res) => {
  try {
    const { spreadsheetId } = req.params;
    const { stakeholderId, range = "'All in One'!D91:G" } = req.body;

    if (!spreadsheetId) {
      return res.status(400).json({ success: false, message: "spreadsheetId wajib ada" });
    }
    if (!stakeholderId) {
      return res.status(400).json({ success: false, message: "stakeholderId wajib ada di body" });
    }

    const values = await googleSheetService.getData(spreadsheetId, range);

    const justificationText = values.map(row => row.join(" ").trim()).join("\n");

    if (!justificationText.trim()) {
      return res.status(400).json({ success: false, message: "Tidak ada data justification untuk disimpan" });
    }

    const saved = await Justification.findOneAndUpdate(
      { stakeholder: stakeholderId },
      {
        text: justificationText, 
        source: `${range}`,   
        createdAt: new Date()
      },
      { upsert: true, new: true }
    );

    return res.json({ success: true, message: "Justification saved to DB", data: saved });

  } catch (err) {
    console.error("Error saveJustification:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};


const updateData = async (req, res) => {
  try {
    const { spreadsheetId } = req.params;
    const { range, values } = req.body || {};

    if (!spreadsheetId) {
      return res.status(400).json({ success: false, message: 'spreadsheetId wajib ada' });
    }
    if (!range) {
      return res.status(400).json({ success: false, message: 'range wajib ada' });
    }
    if (!Array.isArray(values)) {
      return res.status(400).json({ success: false, message: 'values harus array of arrays' });
    }

    const result = await googleSheetService.updateData(spreadsheetId, range, values);
    return res.json({ success: true, result });
  } catch (err) {
    console.error('updateData error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Delete data function - missing in original
const deleteData = async (req, res) => {
  try {
    const { spreadsheetId } = req.params;
    const { range } = req.body || {};

    if (!spreadsheetId) {
      return res.status(400).json({ success: false, message: 'spreadsheetId wajib ada' });
    }
    if (!range) {
      return res.status(400).json({ success: false, message: 'range wajib ada' });
    }

    const result = await googleSheetService.clearData(spreadsheetId, range);
    return res.json({ success: true, result });
  } catch (err) {
    console.error('deleteData error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export {
  getData,
  addData,
  updateData,
  deleteData,
  saveAnswers,
  saveForm,
  getLevels,
  getJustification,
  saveJustification,
};

// Default export for backward compatibility
export default {
  getData,
  addData,
  updateData,
  deleteData,
  saveAnswers,
  saveForm,
  getLevels,
  getJustification,
  saveJustification,
};