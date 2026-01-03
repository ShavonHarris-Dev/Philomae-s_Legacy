# Images Directory

## Hero Image

Please save your family photo as `hero-image.jpg` in this directory.

**Recommended specifications:**
- Format: JPG or PNG
- Dimensions: 1920x1080px or larger
- File size: Under 500KB (optimized for web)
- Quality: 80-90%

## Image Optimization

To optimize your image for web:

### Using Online Tools:
- https://tinypng.com
- https://squoosh.app
- https://compressor.io

### Using Command Line:
```bash
# Install ImageMagick
brew install imagemagick  # macOS
sudo apt-get install imagemagick  # Linux

# Optimize the image
convert hero-image-original.jpg -resize 1920x1080^ -gravity center -extent 1920x1080 -quality 85 hero-image.jpg
```

## Other Images

You can add other images for your reunion here:
- `hero-image.jpg` - Main hero banner
- `logo.png` - Family logo/crest (if applicable)
- `venue.jpg` - Venue photos
- `activities/` - Activity photos
