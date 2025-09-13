# Troubleshooting Guide

## Common Issues and Solutions

### 🚫 Shortcut Fails to Run

#### Symptom
iPhone Shortcut shows error: "There was a problem running the shortcut"

#### Possible Causes & Solutions

**1. Network Connection**
- ✅ **Check**: Is your iPhone connected to WiFi or cellular?
- 🔧 **Fix**: Ensure stable internet connection

**2. Apps Script URL Incorrect**
- ✅ **Check**: Is the Apps Script URL in your shortcut correct?
- 🔧 **Fix**: Redeploy Apps Script, copy new URL to shortcut

**3. Apps Script Permissions**
- ✅ **Check**: Did you authorize the Apps Script to access Google Sheets?
- 🔧 **Fix**: In Apps Script, run any function manually and grant permissions

**4. JSON Format Error**
- ✅ **Check**: Is the Text action in your shortcut properly formatted?
- 🔧 **Fix**: Ensure JSON text uses proper quotes and brackets

### 🤖 AI Categorization Not Working

#### Symptom
All expenses show as "Uncategorized" or "Other"

#### Possible Causes & Solutions

**1. Missing API Key**
- ✅ **Check**: Did you add your AI API key to the CONFIG section?
- 🔧 **Fix**: Add valid OpenAI/Anthropic/Gemini API key

**2. API Quota Exceeded**
- ✅ **Check**: Have you exceeded your AI API usage limits?
- 🔧 **Fix**: Check your API provider dashboard for usage/billing

**3. API Key Invalid**
- ✅ **Check**: Is your API key correctly formatted and active?
- 🔧 **Fix**: Generate new API key from your provider

**4. AI Service Down**
- ✅ **Check**: Is your AI provider's service operational?
- 🔧 **Fix**: Check provider status page, wait for restoration

### 📊 Data Not Appearing in Google Sheets

#### Symptom
Shortcut runs successfully but no data appears in spreadsheet

#### Possible Causes & Solutions

**1. Wrong Spreadsheet ID**
- ✅ **Check**: Is the SPREADSHEET_ID in CONFIG correct?
- 🔧 **Fix**: Copy ID from Google Sheets URL, update CONFIG

**2. Sheet Permissions**
- ✅ **Check**: Does the Apps Script have permission to edit the sheet?
- 🔧 **Fix**: In Apps Script, manually run getOrCreateSheet() function

**3. Apps Script Execution Timeout**
- ✅ **Check**: Check Apps Script execution logs for errors
- 🔧 **Fix**: Simplify the categorization logic or increase timeout

**4. Sheet Name Mismatch**
- ✅ **Check**: Does the sheet name match CONFIG.SHEET_NAME?
- 🔧 **Fix**: Rename sheet to "Expenses" or update CONFIG

### 📍 Location Not Being Captured

#### Symptom
Location column shows empty or "undefined"

#### Possible Causes & Solutions

**1. Location Services Disabled**
- ✅ **Check**: Is location enabled for Shortcuts app?
- 🔧 **Fix**: Settings > Privacy > Location Services > Shortcuts > While Using App

**2. Location Permission Denied**
- ✅ **Check**: Did you allow location access when first running shortcut?
- 🔧 **Fix**: Delete and recreate shortcut, or check app permissions

**3. Poor GPS Signal**
- ✅ **Check**: Are you indoors or in area with poor GPS?
- 🔧 **Fix**: Step outside or try again later

**4. Location Action Missing**
- ✅ **Check**: Did you include "Get Current Location" action?
- 🔧 **Fix**: Add the action to your shortcut workflow

### 💰 Wrong Currency Format

#### Symptom
Amounts show in wrong currency or format

#### Possible Causes & Solutions

**1. Locale Settings**
- ✅ **Check**: Is your iPhone region/currency set correctly?
- 🔧 **Fix**: Settings > General > Language & Region

**2. Spreadsheet Format**
- ✅ **Check**: Is the Amount column formatted as currency?
- 🔧 **Fix**: In Google Sheets, format column B as currency

**3. Number Input Issues**
- ✅ **Check**: Are you entering numbers in correct format?
- 🔧 **Fix**: Use format like "12.50" not "$12.50"

### 🔧 Advanced Troubleshooting

#### Enable Apps Script Logging
1. In Apps Script editor, click "Execution" in the sidebar
2. Run your function and check for errors
3. Look at the "Logs" tab for detailed error messages

#### Test Apps Script Directly
1. In Apps Script, select the `doGet` function
2. Click "Run" to test with sample data
3. Check if test expense appears in your sheet

#### Validate JSON Data
Use an online JSON validator to check your shortcut's Text action:
```json
{
  "amount": 12.50,
  "description": "Test expense",
  "location": "Test location",
  "payment_method": "Credit Card"
}
```

#### Check Shortcut Variables
In your shortcut:
1. Add a "Show Notification" action after each input
2. Display the variable contents to verify data collection
3. Remove these test actions once debugging is complete

### 📞 Getting Additional Help

#### Self-Help Resources
1. **Apps Script Logs**: Check execution history for errors
2. **Google Sheets Activity**: View edit history to see if data was added
3. **Shortcut Testing**: Run shortcut step-by-step to isolate issues

#### Community Support
1. **GitHub Issues**: Create detailed issue report with:
   - iPhone model and iOS version
   - Error messages or screenshots
   - Steps to reproduce the problem
   - Your configuration (without API keys)

2. **Discussion Forums**: Ask questions in GitHub Discussions

#### Professional Support
For business use or complex customizations:
- Consider hiring a developer familiar with Google Apps Script
- Many freelancers available on platforms like Upwork or Fiverr

### 🛡️ Preventing Common Issues

#### Best Practices
1. **Test thoroughly** before daily use
2. **Keep backups** of your shortcut and Apps Script code
3. **Monitor API usage** to avoid quota issues
4. **Regular updates** to keep components current
5. **Simple descriptions** work better for AI categorization

#### Monthly Maintenance
- Check AI API usage and costs
- Verify Google Sheets access permissions
- Update shortcut if iOS changes affect functionality
- Review and clean up any duplicate or test entries

---

**Still having trouble?** Create a GitHub issue with:
- Detailed description of the problem
- Steps you've already tried
- Screenshots or error messages
- Your iOS version and iPhone model