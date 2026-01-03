# Setting Up Your Hero Image

## Quick Steps

1. **Save your family photo** as `hero-image.jpg` in the `/images/` folder
2. **Refresh your browser** to see the hero section with your image

## Image Requirements

### Recommended Specifications
- **Format**: JPG or PNG (JPG recommended for photos)
- **Dimensions**: 1920x1080px or larger
- **Aspect Ratio**: 16:9 (landscape)
- **File Size**: Under 500KB for optimal performance
- **Quality**: 80-85% (good balance of quality and size)

### Current Image
The beautiful family photo you provided showing multiple generations on the staircase is perfect! It features:
- Warm, inviting colors that complement the site's color scheme
- Clear focus on family members
- Good lighting and composition
- Multiple generations (perfect for a reunion theme)

## How to Save Your Image

### Option 1: Direct Save (Easiest)
1. Right-click on your family photo
2. Select "Save Image As..."
3. Navigate to this project's `/images/` folder
4. Name it exactly: `hero-image.jpg`
5. Click Save

### Option 2: From Your Computer
1. Locate your photo file on your computer
2. Copy or move it to: `/Users/kadiesbaby/philomae'sLegacy/images/`
3. Rename it to: `hero-image.jpg`

### Option 3: Optimize First (Recommended for Web)
If your image is very large (over 2MB), optimize it first:

**Using Online Tool:**
1. Go to https://squoosh.app
2. Upload your image
3. Adjust quality to 80-85%
4. Resize to 1920x1080px if larger
5. Download and save as `hero-image.jpg` in `/images/`

**Using Command Line (if you have ImageMagick):**
```bash
cd /Users/kadiesbaby/philomae\'sLegacy/images
convert your-original-photo.jpg -resize 1920x1080^ -gravity center -extent 1920x1080 -quality 85 hero-image.jpg
```

## Hero Section Features

Your hero section includes:
- **Philomae's Legacy** as the main title
- **July 18-20, 2026 • Memphis, Tennessee** as the subtitle
- Inspirational tagline: "Honoring the past, celebrating the present, inspiring the future"
- Call-to-action button that scrolls to RSVP section
- Beautiful gradient overlay that makes text readable
- Subtle zoom animation (20s cycle)
- Fully responsive for mobile devices

## Customizing the Hero

### Change the Title
Edit `index.html` around line 46:
```html
<h2 class="hero-title">Your Custom Title</h2>
```

### Change the Tagline
Edit `index.html` around line 48:
```html
<p class="hero-tagline">Your custom tagline here</p>
```

### Adjust the Overlay
Edit `styles.css` around line 140 to change the overlay darkness:
```css
.hero-overlay {
    background: linear-gradient(
        to bottom,
        rgba(61, 90, 60, 0.7) 0%,    /* Make numbers smaller for lighter overlay */
        rgba(74, 52, 40, 0.5) 50%,
        rgba(61, 90, 60, 0.8) 100%
    );
}
```

### Change Hero Height
Edit `styles.css` around line 97:
```css
.hero {
    height: 70vh;           /* Change this (70vh = 70% of viewport height) */
    min-height: 500px;      /* Minimum height */
    max-height: 800px;      /* Maximum height */
}
```

## Troubleshooting

**Image not showing?**
- Check the file name is exactly `hero-image.jpg` (case-sensitive)
- Verify the image is in `/images/` folder
- Try hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Check browser console for errors (F12)

**Image looks stretched?**
- Use an image with 16:9 aspect ratio
- Or adjust `object-fit` in CSS to `contain` instead of `cover`

**Image too large/slow?**
- Optimize the image using Squoosh or ImageMagick
- Target under 500KB file size
- Use 85% quality JPG

**Text hard to read?**
- Increase overlay opacity in CSS
- Choose a different portion of the image (adjust `object-position`)
- Add more text shadow

## Alternative Images

If you want to use different images:
- **Multiple hero images**: Set up a carousel/slideshow
- **Different image per year**: Use different images for 2026, 2027 tabs
- **Video background**: Replace with MP4 video file

Need help? Check the main README.md for more details!
