/**
 * One-Click Accounting Google Apps Script
 * Handles expense data from iPhone Shortcuts and integrates with AI for categorization
 */

// Configuration - Update these with your actual values
const CONFIG = {
  SPREADSHEET_ID: '', // Your Google Sheets ID
  AI_API_KEY: '', // Your AI API key (OpenAI, Anthropic, etc.)
  AI_API_URL: 'https://api.openai.com/v1/chat/completions', // AI API endpoint
  SHEET_NAME: 'Expenses'
};

/**
 * Main function called by iPhone Shortcuts
 * Processes expense data and adds it to the spreadsheet
 */
function addExpense(expenseData) {
  try {
    // Parse the expense data
    const data = typeof expenseData === 'string' ? JSON.parse(expenseData) : expenseData;
    
    // Get or create the spreadsheet
    const sheet = getOrCreateSheet();
    
    // Categorize the expense using AI
    const category = categorizeExpense(data.description || data.item);
    
    // Prepare the row data
    const timestamp = new Date();
    const row = [
      timestamp,
      data.amount || 0,
      data.description || data.item || '',
      category,
      data.location || '',
      data.payment_method || 'Unknown',
      data.notes || ''
    ];
    
    // Add to spreadsheet
    sheet.appendRow(row);
    
    // Return success response
    return {
      success: true,
      message: 'Expense added successfully',
      category: category,
      amount: data.amount,
      timestamp: timestamp.toISOString()
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
 * Get or create the expenses spreadsheet
 */
function getOrCreateSheet() {
  let spreadsheet;
  
  if (CONFIG.SPREADSHEET_ID) {
    try {
      spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    } catch (e) {
      // If spreadsheet doesn't exist, create a new one
      spreadsheet = SpreadsheetApp.create('One-Click Accounting');
      Logger.log('Created new spreadsheet: ' + spreadsheet.getId());
    }
  } else {
    spreadsheet = SpreadsheetApp.create('One-Click Accounting');
    Logger.log('Created new spreadsheet: ' + spreadsheet.getId());
  }
  
  let sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAME);
    setupSheetHeaders(sheet);
  }
  
  return sheet;
}

/**
 * Setup the header row for the expenses sheet
 */
function setupSheetHeaders(sheet) {
  const headers = [
    'Timestamp',
    'Amount',
    'Description',
    'Category',
    'Location',
    'Payment Method',
    'Notes'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.getRange(1, 1, 1, headers.length).setBackground('#e6f3ff');
  
  // Format the amount column as currency
  sheet.getRange(2, 2, sheet.getMaxRows() - 1, 1).setNumberFormat('$#,##0.00');
}

/**
 * Categorize expense using AI API
 */
function categorizeExpense(description) {
  if (!CONFIG.AI_API_KEY || !description) {
    return 'Uncategorized';
  }
  
  try {
    const prompt = `Categorize this expense into one of these categories: Food & Dining, Transportation, Shopping, Entertainment, Bills & Utilities, Healthcare, Travel, Education, Other. 

Expense: "${description}"

Respond with only the category name.`;

    const payload = {
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: prompt
      }],
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
  
  return 'Uncategorized';
}

/**
 * Web app entry point for HTTP requests from iPhone Shortcuts
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

/**
 * Web app entry point for GET requests (for testing)
 */
function doGet(e) {
  const testData = {
    amount: 15.50,
    description: 'Coffee at Starbucks',
    location: 'Downtown',
    payment_method: 'Credit Card'
  };
  
  const result = addExpense(testData);
  
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Generate monthly spending report
 */
function generateMonthlyReport() {
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
  
  // Calculate totals by category
  const categoryTotals = {};
  let totalAmount = 0;
  
  monthlyData.forEach(row => {
    const amount = parseFloat(row[1]) || 0;
    const category = row[3] || 'Uncategorized';
    
    categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    totalAmount += amount;
  });
  
  return {
    month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
    totalAmount: totalAmount,
    transactionCount: monthlyData.length,
    categoryTotals: categoryTotals
  };
}