# iPhone Shortcuts Setup Guide

## Quick Setup

1. **Install the Shortcut:**
   - Open this link on your iPhone: [Create Custom Shortcut]
   - Or manually create using the steps below

## Manual Shortcut Creation Steps

### Step 1: Create New Shortcut
1. Open the **Shortcuts** app on your iPhone
2. Tap the **"+"** to create a new shortcut
3. Name it **"Log Expense"**

### Step 2: Add Actions (in order)

#### Action 1: Ask for Input (Description)
- Search for **"Ask for Input"**
- Set **Input Type**: Text
- Set **Prompt**: "What did you spend money on?"
- **Variable Name**: expense_description

#### Action 2: Ask for Input (Amount)  
- Add another **"Ask for Input"**
- Set **Input Type**: Number
- Set **Prompt**: "How much did it cost? (numbers only)"
- **Variable Name**: expense_amount

#### Action 3: Get Current Location
- Search for **"Get Current Location"**
- **Variable Name**: current_location

#### Action 4: Choose from Menu (Payment Method)
- Search for **"Choose from Menu"**
- Set **Prompt**: "How did you pay?"
- Add options:
  - Cash
  - Credit Card  
  - Debit Card
  - Apple Pay
  - Other
- **Variable Name**: payment_method

#### Action 5: Text (Create JSON)
- Search for **"Text"** action
- Enter this exact text:
```json
{
  "amount": [expense_amount],
  "description": "[expense_description]", 
  "location": "[current_location]",
  "payment_method": "[payment_method]",
  "timestamp": "[current_date]"
}
```
- **Variable Name**: json_data

#### Action 6: Get Contents of URL
- Search for **"Get Contents of URL"**
- Set **URL**: `YOUR_APPS_SCRIPT_URL_HERE` (see Apps Script setup)
- Set **Method**: POST
- **Headers**: 
  - Content-Type: application/json
- **Request Body**: json_data (from previous step)
- **Variable Name**: api_response

#### Action 7: Show Notification
- Search for **"Show Notification"**  
- Set **Title**: "Expense Logged!"
- Set **Body**: "Successfully recorded $[expense_amount] for [expense_description]"

### Step 3: Configure Shortcut Settings
1. Tap the settings icon (gear) at the top
2. **Add to Home Screen** - for quick access
3. **Add to Siri** - say "Log my expense" or similar phrase
4. Set an **icon** and **color** you like

### Step 4: Test Your Shortcut
1. Run the shortcut from the Shortcuts app
2. Enter a test expense (e.g., "Coffee - $5.50")
3. Check your Google Sheet to confirm it appears

## Voice Commands
After adding to Siri, you can say:
- "Hey Siri, log my expense"  
- "Hey Siri, record spending"
- "Hey Siri, add expense"

## Tips for Best Results
- **Be specific**: "Lunch at McDonald's" vs just "food"
- **Include location details**: The AI uses location for better categorization  
- **Use consistent payment method names**: Helps with reporting
- **Round amounts**: $5.50 vs $5.47 for easier mental tracking

## Troubleshooting
- If the shortcut fails, check your internet connection
- Verify the Apps Script URL is correct
- Make sure the Google Sheet is accessible
- Check that location services are enabled for Shortcuts app