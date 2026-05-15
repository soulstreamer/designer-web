# Designer-Web.ro - Deploy Package

⚠️ **IMPORTANT - READ FIRST**: This website **CANNOT** be opened by double-clicking `index.html`. You must use a local server (see instructions below).

---

## 🚀 Quick Start (View Locally)

### Option 1: Windows (Double-click to run)
**Method A - Python (recommended):**
1. Double-click `start-server.bat`
2. Open browser to http://localhost:8000

**Method B - Node.js:**
1. Double-click `start-node.bat`
2. Open browser to http://localhost:8000

### Option 2: Mac / Linux
1. Open terminal in this folder
2. Run: `bash start-server.sh`
3. Open browser to http://localhost:8000

### Option 3: VS Code (Easiest for developers)
1. Install "Live Server" extension
2. Right-click `index.html` → "Open with Live Server"

### Option 4: With Node.js installed
```bash
npx serve
```

### Option 5: With Python installed
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

---

## 📦 What's Included

- `index.html` - Main HTML file (will show error if opened directly)
- `assets/` - Compiled JavaScript and CSS files
- `images/` - All website images (logo, portfolio, team photos)
- `videos/` - Background videos
- Server scripts - Easy ways to run a local server

---

## 🌐 Deploy to Live Website

### Netlify (Drag & Drop - Easiest)
1. Go to https://app.netlify.com/drop
2. Drag this entire folder onto the page
3. Your site is live instantly!

### Vercel
1. Go to https://vercel.com/
2. Import this folder
3. Deploy automatically

### Any Web Host (FTP/cPanel)
1. Upload all files to your web server
2. Access your domain

### GitHub Pages
1. Upload files to a GitHub repository
2. Enable GitHub Pages in Settings

---

## ❓ Why Can't I Just Open the HTML File?

Modern websites use ES6 JavaScript modules which browsers block when opened directly from your computer (file:// protocol) due to security restrictions called **CORS** (Cross-Origin Resource Sharing). 

A local web server is required to serve the files with the proper headers.

**Error you'll see if opened directly:**
> "Cannot Open Directly - This website requires a local server"

---

## ✨ Features Included

- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Bilingual support (Romanian/English)
- ✅ Language switcher with automatic IP detection
- ✅ All animations and GSAP effects
- ✅ Video backgrounds
- ✅ Portfolio with zoom functionality
- ✅ Contact forms
- ✅ SEO optimized
- ✅ Updated email: designerwebinquiry@gmail.com
- ✅ Updated prices: 1000 RON/€200 and 1500 RON/€300

---

## 🛠️ Technical Details

- Built with React + TypeScript + Vite
- Styled with Tailwind CSS
- Animations with GSAP
- Bundled as static files
- No backend required (frontend-only)
- File size: ~700KB total (compressed)

---

## 📞 Support

For any issues or questions:
**Email:** designerwebinquiry@gmail.com

---

## 📝 License

© 2025 Designer-Web.ro. All rights reserved.