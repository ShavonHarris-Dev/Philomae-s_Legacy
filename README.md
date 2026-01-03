# Family Reunion 2026 - Progressive Web App

A beautiful, clean, and maintainable Progressive Web App for coordinating family reunions. Built with vanilla JavaScript, HTML5, and CSS3.

## Features

- **Event Details**: Display reunion dates, location, and costs
- **Photo Sharing**: Upload and share family photos
- **RSVP System**: Track attendance with interactive family tree
- **Hotel Recommendations**: Curated list of nearby accommodations
- **Carpool Coordination**: Share rides with family members
- **Payment Integration**: QR code for Zelle payments
- **Offline Support**: Works without internet connection
- **Installable**: Add to home screen on mobile devices

## Project Structure

```
family-reunion-pwa/
├── index.html              # Main HTML file
├── styles.css              # All styling
├── app.js                  # Application logic
├── sw.js                   # Service Worker for offline support
├── manifest.json           # PWA manifest
├── generate-icons.html     # Icon generation tool
├── icons/                  # App icons directory
│   └── .gitkeep
└── README.md              # This file
```

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server for development
- (Optional) Node.js for using npm packages

### Installation

1. **Clone or download this repository**

2. **Generate Icons**
   - Open `generate-icons.html` in your browser
   - Click "Generate Icons" button
   - Download all icons and save them to the `/icons/` folder
   - OR create custom icons using a design tool (recommended)

3. **Run a Local Server**

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

4. **Open in Browser**
   - Navigate to `http://localhost:8000`
   - The app should load with full PWA functionality

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

Currently uses localStorage for:
- RSVP submissions
- Photo uploads (base64)
- Family tree placements

To add backend support:
- Replace localStorage calls in the `Storage` module
- Add API endpoints in `app.js`
- Update service worker for background sync

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

### Add Backend Integration

For production use, consider:
- Firebase for real-time database
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
- [ ] Backend API integration
- [ ] Real-time chat
- [ ] Calendar integration
- [ ] Email notifications
- [ ] Multiple event support
- [ ] Admin dashboard
- [ ] Photo gallery with comments
- [ ] Weather widget for event dates
- [ ] Maps integration for directions

## Credits

Built with love for family reunions everywhere.

**Technologies Used:**
- Vanilla JavaScript (no frameworks)
- CSS3 with custom properties
- HTML5 with semantic markup
- Service Workers API
- Web App Manifest
- LocalStorage API

---

Made with ❤️ for the Family Reunion 2026
