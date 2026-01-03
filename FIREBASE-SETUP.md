# Firebase Setup Guide

This guide will help you set up Firebase Realtime Database for your Family Reunion PWA, enabling real-time synchronization of RSVPs and family tree placements across all devices.

## Why Firebase?

- **Real-time updates**: Everyone sees RSVPs and tree placements instantly
- **No backend needed**: Just configuration, no server to manage
- **Free tier**: More than enough for a family reunion app
- **Offline support**: Data syncs when connection returns
- **Simple setup**: 10 minutes to get running

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "Philomae Family Reunion 2026")
4. Click **Continue**
5. Disable Google Analytics (not needed for this app) or leave it enabled
6. Click **Create project**
7. Wait for project creation to complete
8. Click **Continue** to go to your project dashboard

## Step 2: Enable Realtime Database

1. In your Firebase project dashboard, click **"Realtime Database"** in the left sidebar (under "Build")
2. Click **"Create Database"**
3. Select your database location:
   - Choose **"United States (us-central1)"** (recommended)
   - Or select a location closer to most of your family members
4. Click **Next**
5. Choose security rules:
   - Select **"Start in test mode"** for now (we'll update this later)
   - Click **Enable**
6. Your database is now created!

## Step 3: Get Your Firebase Configuration

1. In the Firebase Console, click the **gear icon** (⚙️) next to "Project Overview" in the left sidebar
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** (`</>`) to add a web app
5. Enter an app nickname (e.g., "Family Reunion Web App")
6. **Do NOT check** "Also set up Firebase Hosting" (we're using GitHub Pages or local hosting)
7. Click **"Register app"**
8. You'll see your Firebase configuration code. It looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB1a2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q",
  authDomain: "your-project-id.firebaseapp.com",
  databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:a1b2c3d4e5f6g7h8i9j0k1"
};
```

9. **Copy this entire configuration object**
10. Click **"Continue to console"**

## Step 4: Update Your firebase-config.js File

1. Open the file `firebase-config.js` in your project folder
2. Find the `firebaseConfig` object (lines 7-14)
3. **Replace the placeholder values** with your actual Firebase configuration values:

**Before:**
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

**After (example with your actual values):**
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyB1a2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q",
    authDomain: "philomae-reunion-2026.firebaseapp.com",
    databaseURL: "https://philomae-reunion-2026-default-rtdb.firebaseio.com",
    projectId: "philomae-reunion-2026",
    storageBucket: "philomae-reunion-2026.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:a1b2c3d4e5f6g7h8i9j0k1"
};
```

4. **Save the file**

## Step 5: Update Security Rules (Important!)

The default "test mode" rules allow anyone to read/write your database for 30 days. Let's update them for better security while still keeping the app open for family members:

1. In Firebase Console, go to **"Realtime Database"** in the left sidebar
2. Click the **"Rules"** tab
3. Replace the existing rules with these:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**Note:** These rules allow anyone with your app URL to read and write data. This is fine for a family reunion app that's shared among trusted family members. If you want more security (like requiring authentication), see the "Advanced Security" section below.

4. Click **"Publish"**

## Step 6: Test Your Setup

1. Open `index.html` in your browser
2. Open the browser's Developer Console (F12 or Cmd+Option+I on Mac)
3. Look for this message: `"Firebase initialized successfully"`
   - ✅ If you see it: Firebase is working!
   - ❌ If you see an error: Double-check your configuration values in `firebase-config.js`

4. Test RSVP:
   - Fill out the RSVP form and submit
   - Look for: `"RSVP saved to Firebase"`
   - Open the app in another browser or device
   - You should see the RSVP appear automatically!

5. Test Family Tree:
   - Drag an RSVP to the family tree
   - Look for: `"Tree placement saved to Firebase"`
   - Open the app in another browser or device
   - You should see the tree placement appear!

## Step 7: View Your Data in Firebase Console

1. Go to your Firebase Console
2. Click **"Realtime Database"**
3. Click the **"Data"** tab
4. You should see:
   - `rsvps/` - All RSVP submissions
   - `treePlacements/` - All family tree placements

You can manually edit or delete data here if needed.

## Troubleshooting

### Error: "Firebase not configured"

**Problem:** The app can't connect to Firebase.

**Solutions:**
1. Make sure you updated `firebase-config.js` with your actual Firebase credentials
2. Check that all values are correct (no typos, no placeholder text)
3. Make sure you saved the file after editing
4. Hard refresh your browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Error: "Permission denied"

**Problem:** Your security rules are too restrictive.

**Solutions:**
1. Go to Firebase Console → Realtime Database → Rules
2. Make sure `.read` and `.write` are both set to `true`
3. Click "Publish"
4. Refresh your app

### Data not syncing across devices

**Solutions:**
1. Check your internet connection
2. Open the browser console (F12) and look for errors
3. Make sure both devices are using the same Firebase project
4. Try hard refreshing both browsers

### "PERMISSION_DENIED: Permission denied" error

**Problem:** The database URL in your config doesn't match your actual database.

**Solutions:**
1. Go to Firebase Console → Realtime Database
2. Look at the URL in the data viewer (e.g., `https://philomae-reunion-2026-default-rtdb.firebaseio.com/`)
3. Make sure the `databaseURL` in your `firebase-config.js` **exactly matches** this URL
4. Save and refresh

## Advanced Security (Optional)

If you want to add authentication so only authorized family members can use the app:

### Option 1: Email/Password Authentication

1. Enable Authentication in Firebase Console
2. Add sign-in functionality to your app
3. Update security rules to require authentication:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

### Option 2: Anonymous Authentication

1. Enable Anonymous Authentication in Firebase Console
2. Users automatically get a temporary ID
3. Same security rules as above

### Option 3: Password-Protected Access

Use a single shared password for the family:

```json
{
  "rules": {
    ".read": "auth.uid === 'family-password-2026'",
    ".write": "auth.uid === 'family-password-2026'"
  }
}
```

Then add authentication to your app using Firebase's custom authentication.

## Data Structure

Your Firebase Realtime Database will have this structure:

```
philomae-reunion-2026/
├── rsvps/
│   ├── -N1a2b3c4d5e6f7g8
│   │   ├── id: "rsvp-1234567890"
│   │   ├── name: "John Doe"
│   │   ├── guests: "3"
│   │   ├── familyMembers: ["John Doe", "Jane Doe", "Jimmy Doe"]
│   │   └── timestamp: 1234567890000
│   └── -N1a2b3c4d5e6f7g9
│       └── ...
└── treePlacements/
    ├── -N1a2b3c4d5e6f7h0
    │   ├── id: "placement-1234567890"
    │   ├── rsvpId: "rsvp-1234567890"
    │   ├── parentZoneId: "root-zone-0"
    │   ├── familyMembers: ["John Doe", "Jane Doe", "Jimmy Doe"]
    │   └── timestamp: 1234567890000
    └── -N1a2b3c4d5e6f7h1
        └── ...
```

## Cost

Firebase's free tier ("Spark Plan") includes:
- **1 GB stored**: More than enough for this app
- **10 GB/month downloaded**: Plenty for a family reunion
- **100 simultaneous connections**: Perfect for your event

You should stay well within the free tier unless you have thousands of family members! 😊

## Backup Your Data

To export your data:

1. Go to Firebase Console → Realtime Database → Data tab
2. Click the three dots (⋮) at the top right
3. Select "Export JSON"
4. Save the file as a backup

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs/database)
- [Firebase Support](https://firebase.google.com/support)
- Check the browser console (F12) for error messages
- All error messages in the app are logged to the console

---

## Quick Checklist

✅ Created Firebase project
✅ Enabled Realtime Database
✅ Got Firebase configuration
✅ Updated `firebase-config.js` with real values
✅ Updated security rules
✅ Tested RSVP submission
✅ Tested family tree placement
✅ Verified real-time sync across devices

**You're all set! Your family reunion app now has real-time data syncing! 🎉**
