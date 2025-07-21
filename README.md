# ⭐ MapleStory M - Starforce Niveau 17 Cost Tracker

A web application to track the cost of Starforce Level 17 upgrades in MapleStory M. Calculate average upgrade costs, monitor spending patterns, and import historical data from your notes.

## Features

- **Session Tracking**: Start new sessions with your initial money amount
- **Upgrade Recording**: Record money after each successful upgrade
- **Cost Analysis**: Automatic calculation of average costs per upgrade
- **Global Statistics**: View total upgrades, costs, minimum/maximum costs across all sessions
- **Data Import**: Import your existing notes in a custom text format
- **Session History**: View and manage past upgrade sessions
- **Responsive Design**: Works on desktop and mobile devices

## Usage

### Starting a New Session
1. Enter your starting money amount
2. Click "Commencer" to begin tracking
3. Record your money amount after each successful upgrade

### Recording Upgrades
- Enter your current money amount after each upgrade
- The app automatically calculates the cost difference
- View real-time statistics including average cost per upgrade

### Importing Historical Data
You can import your existing notes using this format:
```
156 754 642
136 589 642
85 819 642
--------------
821 590 556
810 698 566
```

- Each line represents money amount after an upgrade
- Dashes (`---`) separate different sessions
- Spaces in numbers are automatically handled

## Files

- `index.html` - Main application interface
- `script.js` - Core functionality and data management
- `style.css` - Responsive styling and visual design

## Data Storage

The application uses browser localStorage to persist your data:
- Current session data is saved automatically
- Completed sessions are stored in upgrade history
- All data remains local to your browser

## Statistics Tracked

### Per Session
- Starting money amount
- Number of upgrades completed
- Average cost per upgrade
- Total cost for the session

### Global (All Sessions)
- Total number of upgrades across all sessions
- Total money spent on upgrades
- Overall average cost per upgrade
- Minimum and maximum single upgrade costs

## Browser Compatibility

Compatible with all modern browsers that support:
- ES6 Classes
- LocalStorage API
- CSS Grid and Flexbox

## Getting Started

1. Download or clone the repository
2. Open `index.html` in your web browser
3. Start tracking your Starforce 17 upgrade costs!

No server or installation required - runs entirely in your browser.