# One-Click Accounting Setup Guide

## Complete Step-by-Step Setup

### Phase 1: Google Sheets & Apps Script Setup (15 minutes)

#### Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Click **"+ Blank"** to create a new spreadsheet
3. Rename it to **"One-Click Accounting"**
4. Copy the Spreadsheet ID from the URL:
   - URL: `https://docs.google.com/spreadsheets/d/`**`1A2B3C4D5E6F7G8H9I0J`**`/edit`
   - ID is the long string between `/d/` and `/edit`

#### Step 2: Create Apps Script Project  
1. Go to [Google Apps Script](https://script.google.com)
2. Click **"+ New Project"**
3. Delete the default code in `Code.gs`
4. Copy and paste the entire contents of `/apps-script/Code.gs` from this repo
5. Update the CONFIG section at the top:
   ```javascript
   const CONFIG = {
     SPREADSHEET_ID: 'YOUR_SHEET_ID_FROM_STEP_1',
     AI_API_KEY: 'YOUR_AI_API_KEY', // Get from OpenAI/Anthropic/etc
     AI_API_URL: 'https://api.openai.com/v1/chat/completions',
     SHEET_NAME: 'Expenses'
   };
   ```

#### Step 3: Get AI API Key
Choose one AI provider:

**Option A: OpenAI (Recommended)**
1. Go to [OpenAI API](https://platform.openai.com/api-keys)
2. Create account and add payment method
3. Click **"+ Create new secret key"**
4. Copy the key (starts with `sk-`)

**Option B: Anthropic Claude**
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create account and get API key

**Option C: Google Gemini (Free tier available)**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key

#### Step 4: Deploy Apps Script as Web App
1. In Apps Script, click **"Deploy"** → **"New Deployment"**
2. Click the gear icon, select **"Web app"**
3. Set **Execute as**: "Me"  
4. Set **Who has access**: "Anyone"
5. Click **"Deploy"**
6. **Copy the Web App URL** (you'll need this for iPhone setup)
7. Click **"Authorize access"** and grant permissions

#### Step 5: Test Apps Script
1. In Apps Script, select the `doGet` function
2. Click **"Run"** to test
3. Check your Google Sheet - you should see a test expense appear

### Phase 2: iPhone Shortcuts Setup (10 minutes)

#### Step 1: Install Shortcuts App
- Download **"Shortcuts"** from App Store (usually pre-installed)

#### Step 2: Create the Shortcut
Follow the detailed guide in `/shortcuts/SETUP_GUIDE.md`

**Quick version:**
1. Open Shortcuts app → **"+"** → Create new shortcut
2. Add these actions in order:
   - Ask for Input (text) → "What did you spend money on?"
   - Ask for Input (number) → "How much did it cost?"
   - Get Current Location
   - Choose from Menu → Payment methods
   - Text → Create JSON with expense data
   - Get Contents of URL → POST to your Apps Script URL
   - Show Notification → Success message

#### Step 3: Configure Shortcut
1. Name it **"Log Expense"**
2. **Add to Siri**: "Hey Siri, log my expense"
3. **Add to Home Screen** for quick access
4. Choose an icon and color

#### Step 4: Test End-to-End
1. Run the shortcut
2. Enter: "Coffee at Starbucks", "$5.50", choose payment method
3. Check your Google Sheet for the new entry
4. Verify AI categorization worked (should show "Food & Dining")

### Phase 3: Customization & Advanced Features

#### Customize Categories
Edit the AI prompt in Apps Script to use your preferred categories:
```javascript
const prompt = `Categorize this expense into one of these categories: 
Your, Custom, Categories, Here

Expense: "${description}"
Respond with only the category name.`;
```

#### Add Monthly Reports
The Apps Script includes a `generateMonthlyReport()` function:
1. In Apps Script, select `generateMonthlyReport`
2. Click **"Run"** to see current month summary
3. Set up time-driven triggers for automatic monthly reports

#### Voice-Only Mode
For hands-free logging:
1. Replace text input with "Ask for Spoken Text"  
2. Enable dictation for amounts: "five dollars fifty"
3. Add text processing to convert spoken numbers

### Phase 4: Usage & Tips

#### Daily Usage
1. **Voice**: "Hey Siri, log my expense"
2. **Widget**: Add shortcut to Today view
3. **Home Screen**: Tap the shortcut icon

#### Best Practices
- **Be descriptive**: "Lunch at McDonald's" vs "food"
- **Include merchant names**: Helps with location/category detection
- **Use consistent payment methods**: Better for reporting
- **Log immediately**: Don't wait until end of day

#### Monthly Review
1. Open your Google Sheet
2. Use filters to view by category, date, or amount
3. Create charts for visual spending analysis
4. Export data for tax/budget software

### Troubleshooting

#### Shortcut Issues
- **"Unable to Load"**: Check internet connection
- **"Invalid Response"**: Verify Apps Script URL is correct
- **No AI categorization**: Check API key and quota

#### Google Sheets Issues  
- **No data appearing**: Check Apps Script permissions
- **Wrong timezone**: Update timezone in Apps Script settings
- **Currency format**: Adjust in `setupSheetHeaders()` function

#### Apps Script Issues
- **Quota exceeded**: AI API usage limits reached
- **Permission denied**: Re-authorize the script
- **Execution timeout**: Simplify the categorization logic

### Cost Estimation

#### AI API Costs (Monthly)
- **OpenAI GPT-3.5**: ~$0.10 for 1000 transactions  
- **Anthropic Claude**: ~$0.25 for 1000 transactions
- **Google Gemini**: Free tier available

#### Total Monthly Cost
- **Light usage** (100 expenses): ~$0.01-$0.03
- **Heavy usage** (1000 expenses): ~$0.10-$0.25

### Security & Privacy

#### Data Handling
- Expenses stored in your personal Google Sheet
- AI provider sees expense descriptions (for categorization)
- No financial account access required
- Location data optional (can be disabled)

#### Recommended Privacy Settings
- Use specific AI API account just for this project
- Don't include sensitive info in expense descriptions
- Regularly review Google Sheet sharing permissions
- Enable two-factor authentication on Google account

### Support & Updates

#### Getting Help
- Check the troubleshooting section above
- Review Apps Script execution logs
- Test each component individually
- Create GitHub issues for bugs

#### Staying Updated
- Watch this repository for updates
- New AI models and improved categorization
- Additional shortcut actions and features
- Better reporting and analytics

---

**Total setup time**: ~30 minutes  
**Monthly cost**: ~$0.01-$0.25  
**Maintenance**: Minimal (just use it!)

Happy expense tracking! 📱💰📊