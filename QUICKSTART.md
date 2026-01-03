# Quick Start Guide

Get your Family Reunion PWA up and running in 5 minutes!

## Step 1: Generate Icons (2 minutes)

1. Open `generate-icons.html` in your web browser
2. Click "Download All Icons"
3. Save all icons to the `/icons/` folder

**OR** Use your own custom icons (recommended for production).

## Step 2: Start the App (1 minute)

Choose one method:

### Using NPM (Recommended)
```bash
npm start
```

### Using Python
```bash
python -m http.server 8000
```

### Using PHP
```bash
php -S localhost:8000
```

## Step 3: Open in Browser

Navigate to: `http://localhost:8000`

## Step 4: Test PWA Features

1. Open Developer Tools (F12)
2. Go to Application tab
3. Check:
   - ✅ Service Worker is registered
   - ✅ Manifest is loaded
   - ✅ App is installable

## Step 5: Customize

### Update Event Details
Edit `index.html` lines 40-60 for your event details.

### Change Colors
Edit `styles.css` lines 10-18 for your color scheme.

### Add Payment QR Code
Replace the placeholder in `index.html` around line 250.

## Deploy (Optional)

### Quick Deploy to Netlify
```bash
# Drag and drop your folder to: https://app.netlify.com/drop
```

### Quick Deploy to Vercel
```bash
npx vercel
```

### Quick Deploy to GitHub Pages
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
# Then enable GitHub Pages in repository settings
```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Customize the content for your family
- Add your own photos and branding
- Share the URL with your family!

## Common Issues

**Icons not loading?**
- Make sure icons are in the `/icons/` folder
- Check that filenames match the manifest

**Service Worker not working?**
- You need to run on a server (not file://)
- Service Workers require HTTPS in production

**App not installing?**
- Check that you're using HTTPS (localhost works without HTTPS)
- Verify manifest.json is valid

---

That's it! You're ready to go. Enjoy your family reunion! 🎉
