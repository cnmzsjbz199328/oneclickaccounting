/**
 * Advanced One-Click Accounting Google Apps Script
 * Enhanced version with additional features and error handling
 */

// Configuration - Update these with your actual values
const CONFIG = {
  SPREADSHEET_ID: '', // Your Google Sheets ID
  AI_API_KEY: '', // Your AI API key
  AI_API_URL: 'https://api.openai.com/v1/chat/completions',
  SHEET_NAME: 'Expenses',
  BACKUP_CATEGORIES: true,
  ENABLE_NOTIFICATIONS: true,
  TIMEZONE: 'America/New_York'
};

// Predefined categories for fallback
const EXPENSE_CATEGORIES = {
  'food': 'Food & Dining',
  'restaurant': 'Food & Dining',
  'coffee': 'Food & Dining',
  'lunch': 'Food & Dining',
  'dinner': 'Food & Dining',
  'grocery': 'Food & Dining',
  'gas': 'Transportation',
  'uber': 'Transportation',
  'taxi': 'Transportation',
  'parking': 'Transportation',
  'movie': 'Entertainment',
  'netflix': 'Entertainment',
  'amazon': 'Shopping',
  'target': 'Shopping',
  'walmart': 'Shopping',
  'doctor': 'Healthcare',
  'pharmacy': 'Healthcare',
  'hotel': 'Travel',
  'flight': 'Travel'
};

/**
 * Enhanced expense addition with better error handling
 */
function addExpense(expenseData) {
  try {
    // Parse and validate input data
    const data = validateExpenseData(expenseData);
    if (!data.valid) {
      return { success: false, error: data.error };
    }
    
    // Get or create the spreadsheet
    const sheet = getOrCreateSheet();
    
    // Categorize the expense using AI with fallback
    const category = await categorizeExpenseEnhanced(data.description);
    
    // Prepare the row data with additional fields
    const timestamp = new Date();
    const row = [
      timestamp,
      parseFloat(data.amount) || 0,
      data.description || '',
      category,
      data.location || '',
      data.payment_method || 'Unknown',
      data.notes || '',
      data.merchant || extractMerchant(data.description),
      data.recurring || false
    ];
    
    // Add to spreadsheet
    sheet.appendRow(row);
    
    // Update summary statistics
    updateMonthlySummary(sheet, parseFloat(data.amount), category);
    
    // Send notification if enabled
    if (CONFIG.ENABLE_NOTIFICATIONS) {
      sendSlackNotification(data.amount, data.description, category);
    }
    
    return {
      success: true,
      message: 'Expense added successfully',
      category: category,
      amount: data.amount,
      timestamp: timestamp.toISOString(),
      row_number: sheet.getLastRow()
    };
    
  } catch (error) {
    Logger.log('Error in addExpense: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Validate expense data input
 */
function validateExpenseData(expenseData) {
  try {
    const data = typeof expenseData === 'string' ? JSON.parse(expenseData) : expenseData;
    
    // Required fields validation
    if (!data.amount && !data.description) {
      return { valid: false, error: 'Amount and description are required' };
    }
    
    if (data.amount && (isNaN(parseFloat(data.amount)) || parseFloat(data.amount) <= 0)) {
      return { valid: false, error: 'Amount must be a positive number' };
    }
    
    return { valid: true, ...data };
    
  } catch (error) {
    return { valid: false, error: 'Invalid JSON format: ' + error.toString() };
  }
}

/**
 * Enhanced sheet creation with better formatting
 */
function getOrCreateSheet() {
  let spreadsheet;
  
  try {
    if (CONFIG.SPREADSHEET_ID) {
      spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    } else {
      spreadsheet = SpreadsheetApp.create('One-Click Accounting');
      Logger.log('Created new spreadsheet: ' + spreadsheet.getId());
    }
  } catch (e) {
    spreadsheet = SpreadsheetApp.create('One-Click Accounting');
    Logger.log('Created new spreadsheet: ' + spreadsheet.getId());
  }
  
  let sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAME);
    setupAdvancedSheetHeaders(sheet);
  }
  
  return sheet;
}

/**
 * Setup advanced sheet headers with formatting
 */
function setupAdvancedSheetHeaders(sheet) {
  const headers = [
    'Timestamp',
    'Amount', 
    'Description',
    'Category',
    'Location',
    'Payment Method',
    'Notes',
    'Merchant',
    'Recurring'
  ];
  
  // Set headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('#ffffff');
  headerRange.setHorizontalAlignment('center');
  
  // Format columns
  sheet.setColumnWidth(1, 150); // Timestamp
  sheet.setColumnWidth(2, 80);  // Amount
  sheet.setColumnWidth(3, 200); // Description
  sheet.setColumnWidth(4, 120); // Category
  sheet.setColumnWidth(5, 150); // Location
  
  // Format amount column as currency
  sheet.getRange(2, 2, sheet.getMaxRows() - 1, 1).setNumberFormat('$#,##0.00');
  
  // Format timestamp column
  sheet.getRange(2, 1, sheet.getMaxRows() - 1, 1).setNumberFormat('mm/dd/yyyy hh:mm:ss');
  
  // Add data validation for categories
  const categoryRange = sheet.getRange(2, 4, sheet.getMaxRows() - 1, 1);
  const categoryValues = Object.values(EXPENSE_CATEGORIES).concat(['Other']);
  const rule = SpreadsheetApp.newDataValidation().requireValueInList(categoryValues).build();
  categoryRange.setDataValidation(rule);
}

/**
 * Enhanced AI categorization with fallback logic
 */
function categorizeExpenseEnhanced(description) {
  // First try AI categorization
  if (CONFIG.AI_API_KEY && description) {
    const aiCategory = categorizeWithAI(description);
    if (aiCategory && aiCategory !== 'Uncategorized') {
      return aiCategory;
    }
  }
  
  // Fallback to keyword matching
  if (CONFIG.BACKUP_CATEGORIES && description) {
    const category = categorizeWithKeywords(description.toLowerCase());
    if (category) {
      return category;
    }
  }
  
  return 'Other';
}

/**
 * AI-powered categorization
 */
function categorizeWithAI(description) {
  if (!CONFIG.AI_API_KEY) return null;
  
  try {
    const categories = Object.values(EXPENSE_CATEGORIES).join(', ');
    const prompt = `Categorize this expense into one of these categories: ${categories}

Expense: "${description}"

Respond with only the category name. If unsure, respond with "Other".`;

    const payload = {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 50,
      temperature: 0.1
    };
    
    const options = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + CONFIG.AI_API_KEY,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload)
    };
    
    const response = UrlFetchApp.fetch(CONFIG.AI_API_URL, options);
    const responseData = JSON.parse(response.getContentText());
    
    if (responseData.choices && responseData.choices[0]) {
      return responseData.choices[0].message.content.trim();
    }
    
  } catch (error) {
    Logger.log('AI categorization error: ' + error.toString());
  }
  
  return null;
}

/**
 * Keyword-based categorization fallback
 */
function categorizeWithKeywords(description) {
  for (const [keyword, category] of Object.entries(EXPENSE_CATEGORIES)) {
    if (description.includes(keyword)) {
      return category;
    }
  }
  return null;
}

/**
 * Extract merchant name from description
 */
function extractMerchant(description) {
  if (!description) return '';
  
  // Common patterns for merchant extraction
  const patterns = [
    /at (.+)/i,
    /from (.+)/i,
    /^(.+?) - /i,
    /^(.+?) \$/i
  ];
  
  for (const pattern of patterns) {
    const match = description.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return description.split(' ')[0] || '';
}

/**
 * Update monthly summary statistics
 */
function updateMonthlySummary(sheet, amount, category) {
  try {
    const spreadsheet = sheet.getParent();
    let summarySheet = spreadsheet.getSheetByName('Monthly Summary');
    
    if (!summarySheet) {
      summarySheet = spreadsheet.insertSheet('Monthly Summary');
      setupSummarySheet(summarySheet);
    }
    
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    
    // Update category totals (simplified version)
    // In a full implementation, you'd search for existing rows and update them
    
  } catch (error) {
    Logger.log('Error updating monthly summary: ' + error.toString());
  }
}

/**
 * Setup monthly summary sheet
 */
function setupSummarySheet(sheet) {
  const headers = ['Month', 'Category', 'Total Amount', 'Transaction Count', 'Average Amount'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.getRange(1, 1, 1, headers.length).setBackground('#34a853');
  sheet.getRange(1, 1, 1, headers.length).setFontColor('#ffffff');
}

/**
 * Send Slack notification (optional)
 */
function sendSlackNotification(amount, description, category) {
  // Implement Slack webhook integration if desired
  // This is optional and can be customized based on user preferences
}

/**
 * Generate detailed monthly report
 */
function generateDetailedMonthlyReport() {
  const sheet = getOrCreateSheet();
  const data = sheet.getDataRange().getValues();
  
  // Remove header row
  data.shift();
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyData = data.filter(row => {
    const date = new Date(row[0]);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });
  
  // Calculate detailed statistics
  const categoryTotals = {};
  const merchantTotals = {};
  const paymentMethodTotals = {};
  let totalAmount = 0;
  
  monthlyData.forEach(row => {
    const amount = parseFloat(row[1]) || 0;
    const category = row[3] || 'Uncategorized';
    const merchant = row[7] || 'Unknown';
    const paymentMethod = row[5] || 'Unknown';
    
    categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    merchantTotals[merchant] = (merchantTotals[merchant] || 0) + amount;
    paymentMethodTotals[paymentMethod] = (paymentMethodTotals[paymentMethod] || 0) + amount;
    totalAmount += amount;
  });
  
  return {
    month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
    totalAmount: totalAmount,
    transactionCount: monthlyData.length,
    averageTransaction: totalAmount / monthlyData.length || 0,
    categoryTotals: categoryTotals,
    topMerchants: Object.entries(merchantTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5),
    paymentMethodBreakdown: paymentMethodTotals
  };
}

/**
 * Web app handlers remain the same
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const result = addExpense(data);
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    const errorResponse = {
      success: false,
      error: error.toString()
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Enhanced test with more realistic data
  const testData = {
    amount: 15.50,
    description: 'Coffee at Starbucks Downtown',
    location: 'Downtown Seattle',
    payment_method: 'Credit Card',
    notes: 'Team meeting'
  };
  
  const result = addExpense(testData);
  
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}