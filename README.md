# Family Reunion 2026 - Progressive Web App

A beautiful, clean, and maintainable Progressive Web App for coordinating family reunions. Built with vanilla JavaScript, HTML5, and CSS3.

## Features

- **Real-Time Sync**: RSVPs and family tree updates appear instantly for everyone (via Firebase)
- **Event Details**: Display reunion dates, location, and costs
- **Photo Sharing**: Upload and share family photos
- **Interactive RSVP System**: Track attendance with drag-and-drop family tree
- **Family Member Support**: Add spouse and children names in a single RSVP
- **Hotel Recommendations**: Curated list of nearby accommodations
- **Payment Integration**: QR code for Zelle payments
- **Offline Support**: Works without internet connection
- **Installable**: Add to home screen on mobile devices
- **Multi-Device**: See updates across all devices in real-time

## Project Structure

```
family-reunion-pwa/
├── index.html              # Main HTML file
├── styles.css              # All styling
├── app.js                  # Application logic (with Firebase integration)
├── firebase-config.js      # Firebase configuration
├── sw.js                   # Service Worker for offline support
├── manifest.json           # PWA manifest
├── generate-icons.html     # Icon generation tool
├── FIREBASE-SETUP.md       # Firebase setup instructions
├── SETUP-HERO-IMAGE.md     # Hero image setup guide
├── icons/                  # App icons directory
│   └── .gitkeep
├── images/                 # Hero image and photos
│   └── README.md
└── README.md               # This file
```

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server for development
- (Optional) Node.js for using npm packages

### Installation

1. **Clone or download this repository**

2. **Set Up Firebase (Required for Real-Time Sync)**
   - Follow the detailed instructions in `FIREBASE-SETUP.md`
   - Takes about 10 minutes
   - Enables real-time RSVP and family tree synchronization
   - **Skip this step if you only want to test locally without real-time features**

3. **Generate Icons**
   - Open `generate-icons.html` in your browser
   - Click "Generate Icons" button
   - Download all icons and save them to the `/icons/` folder
   - OR create custom icons using a design tool (recommended)

4. **Add Your Hero Image**
   - Follow the instructions in `SETUP-HERO-IMAGE.md`
   - Save your family photo as `hero-image.jpg` in the `/images/` folder

5. **Run a Local Server**

   Using Python (built-in):
   ```bash
   # Python 3
   python -m http.server 8000

   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   Using Node.js:
   ```bash
   npx serve
   ```

   Using PHP:
   ```bash
   php -S localhost:8000
   ```

6. **Open in Browser**
   - Navigate to `http://localhost:8000`
   - The app should load with full PWA functionality
   - Check browser console (F12) for "Firebase initialized successfully" message

## Customization

### Update Event Details

Edit `index.html` to change:
- Event dates and location
- Hotel recommendations
- Carpool routes
- Pricing information

### Modify Styling

Edit `styles.css`:
- Color scheme defined in CSS variables (`:root`)
- Responsive breakpoints
- Animations and transitions

### Add Functionality

Edit `app.js`:
- All modules are clearly separated
- Each section has comments for easy navigation
- Add new features by creating new modules

### Configure PWA Settings

Edit `manifest.json`:
- App name and description
- Theme colors
- Icon paths
- Shortcuts

## Deployment

### Option 1: GitHub Pages (Free)

1. Create a GitHub repository
2. Push your code to the repository
3. Go to Settings → Pages
4. Select your main branch
5. Your app will be live at `https://yourusername.github.io/repo-name`

### Option 2: Netlify (Free)

1. Create a Netlify account
2. Drag and drop your project folder
3. Your app will be live instantly
4. Get a custom domain or use the provided one

### Option 3: Vercel (Free)

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts
4. Your app will be deployed

### Option 4: Traditional Web Hosting

1. Upload all files to your web server
2. Ensure HTTPS is enabled (required for PWA)
3. Configure your domain to point to the files

## PWA Installation

### On Mobile Devices

**iOS (Safari):**
1. Open the website
2. Tap the Share button
3. Tap "Add to Home Screen"
4. Tap "Add"

**Android (Chrome):**
1. Open the website
2. Tap the menu (three dots)
3. Tap "Add to Home Screen"
4. Tap "Add"

### On Desktop

**Chrome/Edge:**
1. Look for the install icon in the address bar
2. Click it and confirm installation
3. The app will open in its own window

## Offline Support

The service worker caches:
- All HTML, CSS, and JavaScript files
- Google Fonts
- Uploaded photos (stored in browser)

When offline:
- Users can still view cached content
- Photos can be uploaded (will sync when online)
- RSVP data is stored locally

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 11.3+)
- Opera: Full support
- Samsung Internet: Full support

## Maintenance

### Adding New Content

1. **New Sections**: Add to `index.html` following existing patterns
2. **New Styles**: Add to `styles.css` in the appropriate section
3. **New Features**: Create a new module in `app.js`

### Updating the Service Worker

When you make changes:
1. Update the `CACHE_NAME` version in `sw.js`
2. Clear browser cache or do a hard refresh (Ctrl+Shift+R)
3. The new version will install automatically

### Data Persistence

**Firebase Realtime Database (Configured):**
- RSVP submissions sync across all devices
- Family tree placements visible to everyone
- Real-time updates appear instantly
- See `FIREBASE-SETUP.md` for configuration

**LocalStorage (Fallback):**
- Photo uploads (base64) stored locally
- Works offline when Firebase is unavailable
- Data persists in browser storage

**How it works:**
- App checks for Firebase connection on load
- If configured, saves to Firebase + shows real-time updates
- If not configured, falls back to localStorage
- No errors if Firebase is not set up

## Customizing for Your Family

### Change Colors

In `styles.css`, update the CSS variables:
```css
:root {
    --cream: #FBF8F3;        /* Background */
    --sage: #A8B5A0;         /* Accent */
    --terracotta: #D47D54;   /* Primary */
    --deep-brown: #4A3428;   /* Text */
    --gold: #D4AF37;         /* Highlights */
    --soft-pink: #E8C4B8;    /* Cards */
    --forest: #3D5A3C;       /* Headers */
}
```

### Add Payment QR Code

1. Generate a Zelle QR code from your bank
2. Save it as `qr-code.png` in the project root
3. Update the QR placeholder in `index.html`:
```html
<img src="qr-code.png" alt="Zelle QR Code" style="width: 100%; max-width: 250px;">
```

### Firebase Integration (Already Configured!)

This app uses Firebase Realtime Database for:
- ✅ Real-time RSVP synchronization
- ✅ Shared family tree across all devices
- ✅ Instant updates without page refresh
- ✅ Offline support with automatic sync

See `FIREBASE-SETUP.md` for configuration instructions.

**Alternative Backend Options:**
- Supabase for PostgreSQL backend
- MongoDB for document storage
- Custom REST API

## Troubleshooting

**Service Worker not updating:**
- Increment the cache version in `sw.js`
- Clear browser cache
- Unregister old service workers in DevTools

**Icons not showing:**
- Check that icons are in the `/icons/` directory
- Verify file names match `manifest.json`
- Use absolute paths starting with `/`

**PWA not installing:**
- Ensure site is served over HTTPS
- Check manifest.json is valid
- Verify service worker is registered

**Firebase not working / "Firebase not configured" message:**
- Make sure you completed the Firebase setup in `FIREBASE-SETUP.md`
- Verify your `firebase-config.js` has real values (not placeholders)
- Check browser console for specific Firebase errors
- Ensure your Firebase database URL matches your project
- The app will work locally without Firebase, but won't sync across devices

**RSVPs/Tree not syncing across devices:**
- Verify Firebase is properly configured
- Check internet connection on all devices
- Look for "saved to Firebase" messages in browser console
- Make sure all devices are using the same Firebase project

## License

This project is open source and available for personal and commercial use.

## Support

For questions or issues:
1. Check this README
2. Review code comments
3. Inspect browser console for errors
4. Check service worker status in DevTools

## Future Enhancements

Potential features to add:
- [x] Backend API integration (Firebase implemented!)
- [x] Real-time sync (Firebase Realtime Database)
- [ ] Real-time chat
- [ ] Calendar integration
- [ ] Email notifications
- [ ] Multiple event support
- [ ] Admin dashboard
- [ ] Photo gallery with comments
- [ ] Weather widget for event dates
- [ ] Maps integration for directions
- [ ] Photo upload to Firebase Storage

## Credits

Built with love for family reunions everywhere.

**Technologies Used:**
- Vanilla JavaScript (no frameworks)
- Firebase Realtime Database
- CSS3 with custom properties
- HTML5 with semantic markup
- Service Workers API
- Web App Manifest
- LocalStorage API (fallback)
- Drag and Drop API

---

Made with ❤️ for the Family Reunion 2026
