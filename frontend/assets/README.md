# LeaveSync Assets

This directory contains app assets for the LeaveSync application.

## Required Assets

To complete the setup, replace these placeholder files with actual images:

### icon.png
- Size: 1024x1024 pixels
- Format: PNG with transparency
- Purpose: App icon for iOS and Android

### splash.png
- Size: 2048x2732 pixels (or similar high resolution)
- Format: PNG
- Purpose: Launch screen image

### adaptive-icon.png
- Size: 1024x1024 pixels
- Format: PNG with transparency
- Purpose: Android adaptive icon foreground

### favicon.png
- Size: 48x48 pixels (or higher)
- Format: PNG or ICO
- Purpose: Web browser favicon

## Temporary Placeholder

The current `.gitkeep` file is a placeholder. For development, you can:
1. Use the default Expo placeholders (already configured)
2. Create simple colored squares as temporary icons
3. Use a logo generator service

## Design Recommendations

For the LeaveSync brand:
- Use calendar or leave-related imagery
- Colors: Blue (#3b82f6) as primary, Green (#10b981) for normal leave
- Keep it simple and professional
- Ensure good visibility at small sizes

## Creating Placeholders Quickly

You can use free online tools:
- https://www.canva.com/ - Free icon maker
- https://www.figma.com/ - Design tool
- https://favicon.io/ - Favicon generator
- https://appicon.co/ - App icon generator

Or use command line tools like ImageMagick:
```bash
# Create a simple blue square icon
convert -size 1024x1024 xc:#3b82f6 -gravity center -pointsize 200 -fill white -annotate +0+0 'LS' icon.png
```
