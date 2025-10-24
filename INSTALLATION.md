# Enrollio Support Widget - Installation Guide

## Quick Installation

Add this single line of code to your website's `<head>` section or before the closing `</body>` tag:

```html
<script src="https://your-deployed-widget-url.vercel.app/widget-install.js" async></script>
```

**Important:** Replace `your-deployed-widget-url.vercel.app` with your actual Vercel deployment URL.

## Installation Steps

### 1. Deploy Your Widget

First, deploy this widget to Vercel (or your preferred hosting):

```bash
npm run build
vercel --prod
```

### 2. Update the Widget URL

After deployment, update the `WIDGET_URL` in `public/widget-install.js` with your actual deployment URL:

```javascript
const WIDGET_URL = 'https://your-actual-domain.vercel.app';
```

### 3. Add to Your Website

Copy and paste this code into your website's HTML:

```html
<!-- Enrollio Support Widget -->
<script src="https://your-actual-domain.vercel.app/widget-install.js" async></script>
```

### Recommended Placement:

- **Option 1:** In the `<head>` section (recommended for early loading)
- **Option 2:** Before the closing `</body>` tag (for faster initial page load)

## Example Integration

### WordPress
Add the script to your theme's `header.php` or use a plugin like "Insert Headers and Footers"

### Shopify
Add to `theme.liquid` before `</body>`

### Webflow
Add to Site Settings → Custom Code → Footer Code

### HTML Website
```html
<!DOCTYPE html>
<html>
<head>
    <title>Your Website</title>
    <!-- Enrollio Support Widget -->
    <script src="https://your-actual-domain.vercel.app/widget-install.js" async></script>
</head>
<body>
    <!-- Your content -->
</body>
</html>
```

## Advanced Usage

### Controlling the Widget with JavaScript

The widget exposes a global API that you can use to control it:

```javascript
// Open the widget
window.EnrollioWidget.open();

// Close the widget
window.EnrollioWidget.close();

// Toggle the widget
window.EnrollioWidget.toggle();
```

### Example: Open widget from a custom button

```html
<button onclick="window.EnrollioWidget.open()">
  Need Help?
</button>
```

### Example: Auto-open on page load

```html
<script>
  window.addEventListener('load', function() {
    setTimeout(function() {
      window.EnrollioWidget.open();
    }, 3000); // Open after 3 seconds
  });
</script>
```

## Customization

### Positioning

By default, the widget appears in the bottom-right corner. To change the position, modify the widget's CSS in `widget-install.js`:

```javascript
container.style.cssText = `
  position: fixed;
  bottom: 20px;    // Change this
  right: 20px;     // Change this (or use 'left' instead)
  z-index: 999999;
`;
```

### Mobile Responsive

The widget is fully responsive and will adapt to mobile screens automatically.

## Troubleshooting

### Widget not appearing?
1. Check browser console for errors
2. Verify the script URL is correct
3. Ensure the widget is deployed and accessible
4. Check if any ad blockers are interfering

### Widget appears but doesn't load?
1. Check the `WIDGET_URL` in `widget-install.js` is correct
2. Verify CORS settings on your deployment
3. Check browser console for iframe errors

### Widget conflicts with other elements?
1. Adjust the `z-index` value in the script
2. Modify positioning if overlapping with other elements

## Support

For issues or questions, contact support@enrollio.ai
