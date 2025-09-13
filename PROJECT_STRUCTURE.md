# 📁 Project Structure

```
oneclickaccounting/
├── 📄 README.md                    # Main project documentation
├── 📄 LICENSE                      # MIT license
├── 📄 .gitignore                   # Git ignore patterns
├── 🧪 test.sh                      # System testing script
│
├── 📂 apps-script/                 # Google Apps Script files
│   ├── 📄 Code.gs                  # Basic Apps Script implementation
│   ├── 📄 Code-Advanced.gs         # Enhanced version with extra features
│   └── 📄 appsscript.json          # Apps Script configuration
│
├── 📂 shortcuts/                   # iPhone Shortcuts files
│   ├── 📄 OneClickAccounting.json  # Shortcut definition/template
│   └── 📄 SETUP_GUIDE.md           # Detailed shortcut setup steps
│
├── 📂 config/                      # Configuration templates
│   ├── 📄 config.template.json     # JSON configuration template
│   └── 📄 .env.template            # Environment variables template
│
└── 📂 docs/                        # Documentation
    ├── 📄 SETUP_GUIDE.md           # Complete setup guide
    └── 📄 TROUBLESHOOTING.md       # Common issues and solutions
```

## 📋 Quick Reference

### 🚀 Getting Started
1. **Read**: [README.md](../README.md) for overview
2. **Setup**: [docs/SETUP_GUIDE.md](../docs/SETUP_GUIDE.md) for detailed instructions
3. **Test**: Run `./test.sh` to validate setup
4. **iPhone**: Follow [shortcuts/SETUP_GUIDE.md](../shortcuts/SETUP_GUIDE.md)

### 🔧 Core Components

#### Google Apps Script (`apps-script/`)
- **Code.gs**: Main implementation with AI categorization
- **Code-Advanced.gs**: Enhanced version with extra features
- **appsscript.json**: Project configuration

#### iPhone Shortcuts (`shortcuts/`)
- **OneClickAccounting.json**: Shortcut structure definition
- **SETUP_GUIDE.md**: Step-by-step iPhone setup

#### Configuration (`config/`)
- **config.template.json**: Centralized configuration
- **.env.template**: Environment variables for deployment

### 📖 Documentation (`docs/`)
- **SETUP_GUIDE.md**: Complete installation guide (30 min)
- **TROUBLESHOOTING.md**: Common issues and fixes

### 🧪 Testing
- **test.sh**: Automated system validation
- Tests project structure, JSON validity, and API endpoints

## ⚡ Quick Commands

```bash
# Test the entire system
./test.sh

# Validate JSON configuration
python3 -m json.tool config/config.template.json

# Check project completeness
find . -name "*.md" -o -name "*.json" -o -name "*.gs" | wc -l
```

## 🎯 Next Steps After Setup

1. **Deploy** Apps Script as web app
2. **Configure** iPhone shortcut with your web app URL
3. **Test** with sample expense
4. **Use** daily for expense tracking
5. **Customize** categories and features as needed

## 💡 Tips for Success

- **Start simple**: Use basic Code.gs first, upgrade to Advanced later
- **Test often**: Validate each component before moving to next
- **Keep backups**: Save working configurations
- **Read docs**: Both setup guides contain important details
- **Ask for help**: Create GitHub issues for problems

## 🔗 Key Links

- **Main Documentation**: [README.md](../README.md)
- **Setup Guide**: [docs/SETUP_GUIDE.md](../docs/SETUP_GUIDE.md)
- **Troubleshooting**: [docs/TROUBLESHOOTING.md](../docs/TROUBLESHOOTING.md)
- **iPhone Setup**: [shortcuts/SETUP_GUIDE.md](../shortcuts/SETUP_GUIDE.md)