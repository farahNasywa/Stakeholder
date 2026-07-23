import { google } from 'googleapis';

let sheetsClient;

const initSheets = () => {
  if (!sheetsClient) {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    sheetsClient = google.sheets({ version: 'v4', auth });
  }
  return sheetsClient;
};

const SHEET_NAME = 'All in One';
const SAFE_SHEET = `'${SHEET_NAME.replace(/'/g, "''")}'`;

const validateEnvironment = () => {
  const requiredVars = ['GOOGLE_PROJECT_ID', 'GOOGLE_PRIVATE_KEY', 'GOOGLE_CLIENT_EMAIL'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
};

// Ambil data dari Google Sheets
const getData = async (spreadsheetId, range = 'A1:Z1000') => {
  try {
    validateEnvironment();
    const sheets = initSheets();

    console.log(`[getData] Fetching data from ${spreadsheetId}, range: ${range}`);

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const values = res.data?.values || [];
    console.log(`[getData] Retrieved ${values.length} row(s)`);

    // Normalisasi: pastikan selalu array of array
    return values.map(row => Array.isArray(row) ? row : [row]);

  } catch (error) {
    console.error('[getData] Error:', error.message);
    throw new Error(`Failed to get data: ${error.message}`);
  }
};

// Tambah / update data ke Google Sheets
const addData = async (spreadsheetId, range, values) => {
  try {
    validateEnvironment();

    // Cegah overwrite range sensitif
    const protectedPattern = new RegExp(`^${SAFE_SHEET}!D\\d+:AH\\d+$`, 'i');
    if (protectedPattern.test(range)) {
      throw new Error('Write diblok: gunakan endpoint /save untuk menulis jawaban ke D..AH');
    }

    const sheets = initSheets();

    // Normalisasi input jadi array of array
    const rows = Array.isArray(values?.[0]) ? values : [values];

    console.log(`[addData] Adding ${rows.length} row(s) to ${spreadsheetId}, range: ${range}`);

    const res = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'RAW', // bisa ganti ke 'USER_ENTERED' kalau mau formulas
      requestBody: { values: rows },
    });

    console.log(`[addData] Successfully updated ${res.data.updatedRows || rows.length} row(s)`);
    return res.data;

  } catch (error) {
    console.error('[addData] Error:', error.message);
    throw new Error(`Failed to add data: ${error.message}`);
  }
};

const updateData = async (spreadsheetId, range, values) => {
  try {
    validateEnvironment();
    const sheets = initSheets();
    const rows = Array.isArray(values?.[0]) ? values : [values];

    console.log(`[updateData] Updating data in ${spreadsheetId}, range: ${range}`);

    const res = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: rows },
    });

    console.log(`[updateData] Successfully updated ${rows.length} rows`);
    return res.data;
  } catch (error) {
    console.error('[updateData] Error:', error);
    throw new Error(`Failed to update data: ${error.message}`);
  }
};

const clearData = async (spreadsheetId, range) => {
  try {
    validateEnvironment();
    const sheets = initSheets();

    console.log(`[clearData] Clearing data from ${spreadsheetId}, range: ${range}`);

    const res = await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range,
    });

    console.log(`[clearData] Successfully cleared range: ${range}`);
    return res.data;
  } catch (error) {
    console.error('[clearData] Error:', error);
    throw new Error(`Failed to clear data: ${error.message}`);
  }
};

const QUESTION_ORDER_AUTHORITY = [
  "Upstream Oil and Gas and Energy Regulation & Licensing-0",
  "Upstream Oil and Gas and Energy Regulation & Licensing-1",
  "Upstream Oil and Gas and Energy Regulation & Licensing-2",
  "Supervision, Compliance, and Law Enforcement-0",
  "Supervision, Compliance, and Law Enforcement-1",
  "Supervision, Compliance, and Law Enforcement-2",
  "Investment, Financing, and Asset Management-0",
  "Investment, Financing, and Asset Management-1",
  "Investment, Financing, and Asset Management-2",
  "Security and Protection of Strategic Assets-0",
  "Security and Protection of Strategic Assets-1",
  "Communication, Partnerships, and Social Responsibility-0",
  "Energy Transition and Sustainable Policy-0",
  "Energy Transition and Sustainable Policy-1",
  "Regional Policy and Government Synchronization-0",
  "Regional Policy and Government Synchronization-1",
  "Regional Policy and Government Synchronization-2",
  "Local Project Supervision and Facilitation-0",
  "Local Project Supervision and Facilitation-1",
  "Local Project Supervision and Facilitation-2",
  "Technical Standards and Industry Practices-0",
  "Technical Standards and Industry Practices-1",
  "Oversight and Investigation-0",
  "Oversight and Investigation-1",
  "Oversight and Investigation-2",
  "Advocacy and Public Participation-0",
  "Advocacy and Public Participation-1",
  "Advocacy and Public Participation-2",
  "Social and Environmental Coordination and Monitoring-0",
  "Social and Environmental Coordination and Monitoring-1",
  "Social and Environmental Coordination and Monitoring-2",
];

const QUESTION_ORDER_INFLUENCE = [
  "Stakeholders with Formal Authority-0",
  "Stakeholders with Formal Authority-1",
  "Regional Government-0",
  "Regional Government-1",
  "Community Leaders and Social Groups-0",
  "Community Leaders and Social Groups-1",
  "Business Partner / Project Implementer-0",
  "Business Partner / Project Implementer-1",
  "Financial Institutions and Investment Support Entities-0",
  "Financial Institutions and Investment Support Entities-1",
  "Technical Advisory and Data Coordination Agency-0",
  "Technical Advisory and Data Coordination Agency-1",
  "Technical Advisory and Data Coordination Agency-2",
  "The Local Government as a Social Facilitator-0",
  "The Local Government as a Social Facilitator-1",
  "Community as Social Mediator-0",
  "Community as Social Mediator-1",
  "Business Partners as [role/function to be specified]-0",
  "Financial Institutions: Working Capital and Operational Input-0",
  "Financial Institutions: Working Capital and Operational Input-1",
];

const QUESTION_ORDER_INTEREST = [
  "Government and Regulatory Authorities-0",
  "Government and Regulatory Authorities-1",
  "Investors & Capital Owners-0",
  "Investors & Capital Owners-1",
  "External Oversight & Balancing Bodies-0",
  "External Oversight & Balancing Bodies-1",
  "External Oversight & Balancing Bodies-2",
  " Workforce & Direct Partners-0",
  " Workforce & Direct Partners-1",
  " Workforce & Direct Partners-2",
  " Workforce & Direct Partners-3",
  "Local Communities & Social Groups-0",
  "Local Communities & Social Groups-1",
  "Local Communities & Social Groups-2",
  "Local Communities & Social Groups-3",
  "Local Communities & Social Groups-4",
  "Supporting Government & Regulators-0",
  "Supporting Government & Regulators-1",
  "Supporting Government & Regulators-2",
  "Consultants, Academics, & Professionals-0",
  "Consultants, Academics, & Professionals-1",
  "Consultants, Academics, & Professionals-2",
  "Media & Public Opinion-0",
  "Media & Public Opinion-1",
  "Civil Organizations & Social NGOs-0",
  "Civil Organizations & Social NGOs-1",
  "Business Partners & Supporting Services-0",
  "Business Partners & Supporting Services-1",
  "Customers & Financial Secto-0",
  "Customers & Financial Secto-1",
  "Customers & Financial Secto-2",
  "Customers & Financial Secto-3",
];

const QUESTION_ORDER_IMPACTEDBYPROJECT = [
  "Government & Regulatory Authorities-0",
  "Government & Regulatory Authorities-1",
  "Government & Regulatory Authorities-2",
  "Local Communities & Indigenous Peoples-0",
  "Local Communities & Indigenous Peoples-1",
  "Local Communities & Indigenous Peoples-2",
  "Landowners-0",
  "Landowners-1",
  "Landowners-2",
  "Workers & Labor Unions-0",
  "Workers & Labor Unions-1",
  "Workers & Labor Unions-2",
  "Investors & Capital Owners-0",
  "Investors & Capital Owners-1",
  "Investors & Capital Owners-2",
  "Main Contractors & Vendors-0",
  "Main Contractors & Vendors-1",
  "Main Contractors & Vendors-2",
  "Sub-District Government-0",
  "Sub-District Government-1",
  "Sub-District Government-2",
  "NGOs & Social NGOs-0",
  "NGOs & Social NGOs-1",
  "NGOs & Social NGOs-2",
  "Strategic Partners & Project Consultants-0",
  "Strategic Partners & Project Consultants-1",
  "Strategic Partners & Project Consultants-2",
  "Surrounding Communities-0",
  "Surrounding Communities-1",
  "Surrounding Communities-2",
];

const QUESTION_ORDER_DEPENDENCY = [
  "Government & Regulatory Authorities-0",
  "Government & Regulatory Authorities-1",
  "Indigenous Peoples Groups & Local Communities-0",
  "Indigenous Peoples Groups & Local Communities-1",
  "Vulnerable Groups & Poor Communities-0",
  "Vulnerable Groups & Poor Communities-1",
  "Local Economic Actors & MSMEs-0",
  "Local Economic Actors & MSMEs-1",
  "Local Economic Actors & MSMEs-2",
  "Local Workers, Projects, & Companies-0",
  "Local Workers, Projects, & Companies-1",
  "Local Workers, Projects, & Companies-2",
  "Service Providers & Project Business Partners-0",
  "Service Providers & Project Business Partners-1",
  "Supporting Business Partners & Medium SMEs-0",
  "Supporting Business Partners & Medium SMEs-1",
  "Traditional & Independent Local Business Actors-0",
  "Traditional & Independent Local Business Actors-1",
  "Traditional & Independent Local Business Actors-2",
  "Non-Permanent Workers & Freelancers-0",
  "Non-Permanent Workers & Freelancers-1",
  "Secondary Suppliers & Goods Providers-0",
  "Secondary Suppliers & Goods Providers-1",
  "Educational Institutions-0",
  "Educational Institutions-1",
  "NGOs & Community Social Organizations-0",
  "NGOs & Community Social Organizations-1",
  "NGOs & Community Social Organizations-2",
];

const QUESTION_ORDER_ALIGNMENT = [
  "Government and Regulatory Authorities-0",
  "Government and Regulatory Authorities-1",
  "Government and Regulatory Authorities-2",
  "Oil and Gas Regulators (Upstream/Downstream)-0",
  "Oil and Gas Regulators (Upstream/Downstream)-1",
  "Oil and Gas Regulators (Upstream/Downstream)-2",
  "Industry Stakeholders-0",
  "Industry Stakeholders-1",
  "Industry Stakeholders-2",
  "Industry Stakeholders-3",
  "Industry Stakeholders-4",
  "Civil Society / Local Communities-0",
  "Civil Society / Local Communities-1",
  "Civil Society / Local Communities-2",
  "Employee Representatives / Labor Unions-0",
  "Employee Representatives / Labor Unions-1",
  "Employee Representatives / Labor Unions-2",
  "Stakeholders on Social Issues and Conflicts-0",
  "Stakeholders on Social Issues and Conflicts-1",
  "Media, NGOs, and Public Advocacy-0",
  "Media, NGOs, and Public Advocacy-1",
  "Media, NGOs, and Public Advocacy-2",
  "Professionals, Technical Experts, and Operational Partners-0",
  "Professionals, Technical Experts, and Operational Partners-1",
  "Professionals, Technical Experts, and Operational Partners-2",
  "Religious Leaders, Traditional Authorities, and Custodians of Socio-Cultural Values-0",
  "Religious Leaders, Traditional Authorities, and Custodians of Socio-Cultural Values-1",
  "Religious Leaders, Traditional Authorities, and Custodians of Socio-Cultural Values-2",
];

const QUESTION_ORDER_OPPORTUNITY = [
  "Government & Regulatory Authorities-0",
  "Government & Regulatory Authorities-1",
  "Community Leader / Village Head-0",
  "Community Leader / Village Head-1",
  "Oil and Gas Industry Operators / State-Owned Enterprises / Regionally-Owned Enterprises-0",
  "Oil and Gas Industry Operators / State-Owned Enterprises / Regionally-Owned Enterprises-1",
  "Local Communities & Community Groups-0",
  "Local Communities & Community Groups-1",
  "Oil and Gas Technical Regulator / BPMA / SKK MIGAS / Related Agencies-0",
  "Oil and Gas Technical Regulator / BPMA / SKK MIGAS / Related Agencies-1",
  "Workers & Employees Union-0",
  "Workers & Employees Union-1",
  "Academics & Educational Institutions-0",
  "Academics & Educational Institutions-1",
  "Media & Public Communications-0",
  "Media & Public Communications-1",
  "NGOs & Social Organizations-0",
  "NGOs & Social Organizations-1",
  "Business & Industry Association-0",
  "Business Partners & Service Providers-0",
  "Religious & Cultural Groups-0",
];

const QUESTION_ORDER_RISK = [
  "Government & Regulatory Authorities-0",
  "Government & Regulatory Authorities-1",
  "Government & Regulatory Authorities-2",
  "Oil and Gas Industry Operators / State-Owned Enterprises (SOEs) / Regional-Owned Enterprises (ROEs)-0",
  "Oil and Gas Industry Operators / State-Owned Enterprises (SOEs) / Regional-Owned Enterprises (ROEs)-1",
  "Oil and Gas Industry Operators / State-Owned Enterprises (SOEs) / Regional-Owned Enterprises (ROEs)-2",
  "Oil and Gas Industry Operators / State-Owned Enterprises (SOEs) / Regional-Owned Enterprises (ROEs)-3",
  "Oil and Gas Industry Operators / State-Owned Enterprises (SOEs) / Regional-Owned Enterprises (ROEs)-4",
  "Technical Oil and Gas Regulators / BPMA / SKK MIGAS / Relevant Agencies-0",
  "Technical Oil and Gas Regulators / BPMA / SKK MIGAS / Relevant Agencies-1",
  "Technical Oil and Gas Regulators / BPMA / SKK MIGAS / Relevant Agencies-2",
  "Local Leaders / Communities & Community Groups-0",
  "Local Leaders / Communities & Community Groups-1",
  "Local Leaders / Communities & Community Groups-2",
  "Labor Unions & Employees-0",
  "Labor Unions & Employees-1",
  "Labor Unions & Employees-2",
  "Academics & Educational Institutions-0",
  "Academics & Educational Institutions-1",
  "Media & Public Communication-0",
  "Media & Public Communication-1",
  "NGOs & Social Organizations-0",
  "NGOs & Social Organizations-1",
  "NGOs & Social Organizations-2",
  "Business & Industry Associations-0",
  "Business & Industry Associations-1",
  "Business Partners & Service Providers-0",
  "Business Partners & Service Providers-1",
  "Religious & Cultural Groups-0",
  "Religious & Cultural Groups-1",
  "Religious & Cultural Groups-2",
];

const QUESTION_ORDER_BENEFIT = [
  "Government & Regulatory Authorities-0",
  "Government & Regulatory Authorities-1",
  "Government & Regulatory Authorities-2",
  "Community, Traditional, and Religious Leaders-0",
  "Community, Traditional, and Religious Leaders-1",
  "Local Business and Economic Actors-0",
  "Local Business and Economic Actors-1",
  "Social, Academic, and NGO/CSO Organizations-0",
  "Social, Academic, and NGO/CSO Organizations-1",
  "Social, Academic, and NGO/CSO Organizations-2",
];
const QUESTION_ORDER_CATEGORY = [
  "Government & Regulatory Authorities-0",
  "Government & Regulatory Authorities-1",
  "Government & Regulatory Authorities-2",
  "Government & Regulatory Authorities-3",
  "Community / Traditional / Religious Leaders-0",
  "Community / Traditional / Religious Leaders-1",
  "Social Risk Stakeholders-0",
  "Social Risk Stakeholders-1",
  "Stakeholders with Social & Economic Influence-0",
  "Stakeholders with Social & Economic Influence-1",
  "Stakeholders with Social & Economic Influence-2",
];

// Mapping cluster ke question order
const QUESTION_ORDER_BY_CLUSTER = {
  authority: QUESTION_ORDER_AUTHORITY,
  influence: QUESTION_ORDER_INFLUENCE,
  interest: QUESTION_ORDER_INTEREST,
  impactedbyproject: QUESTION_ORDER_IMPACTEDBYPROJECT,
  dependency: QUESTION_ORDER_DEPENDENCY,
  alignment: QUESTION_ORDER_ALIGNMENT,
  opportunity: QUESTION_ORDER_OPPORTUNITY,
  risk: QUESTION_ORDER_RISK,
  benefit: QUESTION_ORDER_BENEFIT,
  category: QUESTION_ORDER_CATEGORY,
};

// Mapping cluster ke row number
const CLUSTER_ROW_MAP = {
  authority: 6,
  influence: 14,
  interest: 22,
  impactedbyproject: 30,
  dependency: 38,
  alignment: 46,
  opportunity: 54,
  risk: 62,
  benefit: 70,
  category: 78,
};

// Helper function untuk mencari row kosong berikutnya
const findNextEmptyRow = async (sheets, spreadsheetId, startRow = 3) => {
  try {
    const range = `${SAFE_SHEET}!D${startRow}:D`;
    const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    const rows = res.data.values || [];

    let offset = 0;
    for (const r of rows) {
      const val = (r?.[0] ?? '').toString().trim();
      if (val === '') break;
      offset++;
    }

    const nextRow = startRow + offset;
    console.log(`[findNextEmptyRow] Next empty row: ${nextRow}`);
    return nextRow;
  } catch (error) {
    console.error('[findNextEmptyRow] Error:', error);
    throw new Error(`Failed to find next empty row: ${error.message}`);
  }
};

const getLevelsFromSheet = async (spreadsheetId) => {
  try {
    validateEnvironment();
    const sheets = initSheets();

    const ranges = [
      `'All in One'!AI14`, // Influence
      `'All in One'!AI22`, // Interest
      `'All in One'!AI54`, // Opportunity
      `'All in One'!AI62`, // Risk
      `'All in One'!AI70`, // Benefit
    ];

    console.log(`[getLevelsFromSheet] Fetching levels from ${spreadsheetId}`);

    const res = await sheets.spreadsheets.values.batchGet({
      spreadsheetId,
      ranges,
    });

    const values = res.data.valueRanges.map(r => r.values ? r.values[0][0] : null);
    console.log('[getLevelsFromSheet] Raw values:', values);

    const levels = {
      influenceLevel: values[0]?.toLowerCase() || null,
      interestLevel: values[1]?.toLowerCase() || null,
      opportunityLevel: values[2]?.toLowerCase() || null,
      riskLevel: values[3]?.toLowerCase() || null,
      benefitLevel: values[4]?.toLowerCase() || null,
    };

    console.log('[getLevelsFromSheet] Processed levels:', levels);
    return levels;
  } catch (error) {
    console.error('[getLevelsFromSheet] Error:', error);
    throw new Error(`Failed to get levels: ${error.message}`);
  }
};

const saveForm = async (spreadsheetId, formData) => {
  try {
    validateEnvironment();
    const sheets = initSheets();

    const requests = [
      {
        range: `'All in One'!B6`,
        values: [[formData?.name || ""]],
      },
      {
        range: `'All in One'!C6`,
        values: [[formData?.role || ""]],
      },
      {
        range: `'All in One'!D90`,
        values: [[formData?.category || ""]],
      },
      {
        range: `'All in One'!E90`,
        values: [[formData?.relevance || ""]],
      },
    ];

    console.log("[saveForm] Data yang akan ditulis:", JSON.stringify(requests, null, 2));

    const response = await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      resource: {
        valueInputOption: "USER_ENTERED",
        data: requests,
      },
    });

    console.log("[saveForm] Response dari Google Sheets:", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('[saveForm] Error:', error);
    throw new Error(`Failed to save form: ${error.message}`);
  }
};

const normalizeYesNo = (val) => {
  if (val == null) return "";
  const normalized = String(val).trim().toLowerCase();
  if (normalized === 'ya' || normalized === 'yes') return 'Yes';
  if (normalized === 'tidak' || normalized === 'no') return 'No';
  return String(val);
};

const saveAnswers = async (spreadsheetId, row, answers, clusterId) => {
  try {
    validateEnvironment();
    const sheets = initSheets();

    let targetRow = (row == null) ? null : Number(row);

    if (!Number.isFinite(targetRow) || targetRow <= 0 || Math.floor(targetRow) !== targetRow) {
      if (clusterId && CLUSTER_ROW_MAP[clusterId] != null) {
        targetRow = CLUSTER_ROW_MAP[clusterId];
      } else {
        targetRow = await findNextEmptyRow(sheets, spreadsheetId, 3);
      }
    }

    const order = QUESTION_ORDER_BY_CLUSTER[clusterId] || QUESTION_ORDER_AUTHORITY;

    let rowValues = order.map((key) => normalizeYesNo(answers?.[key]));

    if (rowValues.length < 31) {
      rowValues = rowValues.concat(Array(31 - rowValues.length).fill(""));
    } else if (rowValues.length > 31) {
      rowValues = rowValues.slice(0, 31);
    }
    const range = `${SAFE_SHEET}!D${targetRow}:AH${targetRow}`;

    console.log(`[saveAnswers] cluster=${clusterId} row=${targetRow} filled=${rowValues.filter(v => v !== "").length}/${order.length} -> ${range}`);
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: { values: [rowValues] },
    });

    await autoFillCategoryAndRelevance(spreadsheetId, clusterId, targetRow);
    
    return targetRow;
  } catch (error) {
    console.error('[saveAnswers] Error:', error);
    throw new Error(`Failed to save answers: ${error.message}`);
  }
};

const getClusterInfo = () => {
  return {
    clusters: Object.keys(QUESTION_ORDER_BY_CLUSTER),
    clusterRowMap: CLUSTER_ROW_MAP,
    questionCounts: Object.fromEntries(
      Object.entries(QUESTION_ORDER_BY_CLUSTER).map(([key, order]) => [key, order.length])
    ),
  };
};

const batchUpdateData = async (spreadsheetId, updates) => {
  try {
    validateEnvironment();
    const sheets = initSheets();

    console.log(`[batchUpdateData] Performing ${updates.length} batch updates`);

    const response = await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      resource: {
        valueInputOption: "USER_ENTERED",
        data: updates,
      },
    });

    console.log(`[batchUpdateData] Successfully updated ${response.data.totalUpdatedCells} cells`);
    return response.data;
  } catch (error) {
    console.error('[batchUpdateData] Error:', error);
    throw new Error(`Failed to batch update data: ${error.message}`);
  }
};

// ✅ Fungsi otomatis isi Category & Relevance
const autoFillCategoryAndRelevance = async (spreadsheetId, clusterId, targetRow) => {
  try {
    const sheets = initSheets();
    const order = QUESTION_ORDER_BY_CLUSTER[clusterId] || [];
    if (!order.length) return;

    // Ambil jawaban cluster dari sheet
    const range = `${SAFE_SHEET}!D${targetRow}:AH${targetRow}`;
    const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    const answers = res.data.values?.[0] || [];

    // Cek apakah semua jawaban sudah terisi
    const allAnswered = answers.length >= order.length && answers.every(a => a?.trim() !== "");
    if (!allAnswered) {
      console.log(`[autoFill] Cluster ${clusterId} belum lengkap, skip.`);
      return;
    }

    // Mapping Category otomatis
    const CATEGORY_MAP = {
      authority: "Regulatory",
      influence: "Power",
      interest: "Stakeholder Interest",
      impactedbyproject: "Impacted",
      dependency: "Dependency",
      alignment: "Alignment",
      opportunity: "Opportunity",
      risk: "Risk",
      benefit: "Benefit",
      category: "Category",
    };
    const category = CATEGORY_MAP[clusterId] || clusterId;

    // Hitung Relevance berdasarkan jumlah Yes
    const yesCount = answers.filter(a => a === "Yes").length;
    const ratio = yesCount / order.length;
    let relevance = "Low";
    if (ratio >= 0.7) relevance = "High";
    else if (ratio >= 0.4) relevance = "Medium";

    // ✅ Tulis hasil ke:
    // Category → E90
    // Relevance → D86
    const updates = [
      { range: `'All in One'!E90`, values: [[category]] },
      { range: `'All in One'!D86`, values: [[relevance]] },
    ];

    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      resource: { valueInputOption: "USER_ENTERED", data: updates },
    });

    console.log(`[autoFill] Category=${category}, Relevance=${relevance} sudah ditulis`);
  } catch (err) {
    console.error("[autoFill] Error:", err.message);
  }
};

export default {
  getData,
  addData,
  updateData,
  clearData,
  saveAnswers,
  saveForm,
  getLevelsFromSheet,
  getClusterInfo,
  batchUpdateData,
  QUESTION_ORDER_BY_CLUSTER,
  CLUSTER_ROW_MAP,
};