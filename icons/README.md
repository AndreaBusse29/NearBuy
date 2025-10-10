# Icons

This directory should contain PWA icons in the following sizes:

- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## Generating Icons

You can use online tools like:
- https://www.pwabuilder.com/imageGenerator
- https://realfavicongenerator.net/

Or use a tool like ImageMagick:

```bash
# Create a simple placeholder icon (requires ImageMagick)
convert -size 512x512 xc:#2196F3 -fill white -pointsize 200 -gravity center -annotate +0+0 "NB" icon-512x512.png

# Generate other sizes
for size in 72 96 128 144 152 192 384; do
  convert icon-512x512.png -resize ${size}x${size} icon-${size}x${size}.png
done
```

## Placeholder

For development, you can create simple colored squares as placeholders until proper icons are designed.