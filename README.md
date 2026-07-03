# Birthday Surprise for Betuuu 💖

A romantic interactive birthday website from **Khushu** to **Betuuu**.

## How it works

1. Landing page — "Happy Birthday Betuuu"
2. Three gift boxes open **one by one**
3. **Gift 1** → Photo + message about Jand Hanuman & the rain
4. **Gift 2** → Video + message about the rainy drive, Jurassic Park, roses & pizza
5. **Gift 3** → Photo + final message
6. Final love letter from Khushu

---

## Step 1 — Add your media files

Open the `assets` folder and add:

```
assets/
  photo1.jpg      ← first photo (Gift 1)
  video1.mp4      ← copy IMG_7623.MOV.mp4 here
  photo2.jpg      ← third photo (Gift 3)
  video-poster.jpg  ← optional thumbnail for video
```

See `assets/HOW-TO-ADD-FILES.md` for details.

---

## Step 2 — Preview on your computer

### Option A: Live Server (recommended)

1. Open this folder in **Cursor** or **VS Code**
2. Install the **Live Server** extension
3. Right-click `index.html` → **Open with Live Server**
4. Your browser opens at `http://127.0.0.1:5500`

### Option B: Open directly

Double-click `index.html` — it may work, but video/photos load more reliably with Live Server.

---

## Step 3 — Share with Betuuu (free hosting)

### Netlify (easiest)

1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Sign up free
3. Drag the entire `birthday-surprise` folder onto the Netlify dashboard
4. You get a link like `https://random-name.netlify.app`
5. Send that link to Betuuu on WhatsApp / text

### GitHub Pages

1. Create a GitHub account at [https://github.com](https://github.com)
2. Create a new repository (e.g. `birthday-betuuu`)
3. Upload all files (index.html, style.css, script.js, assets folder)
4. Go to **Settings → Pages → Source: main branch**
5. Your site will be at `https://YOUR-USERNAME.github.io/birthday-betuuu`

---

## Step 4 — Send the link

Message example:

> Happy Birthday my love Betuuu! 🎂💖
> I made something special for you — open this:
> https://your-link.netlify.app

Works on **Android**, **iPhone**, and **laptop** — no app install needed.

---

## Customize messages

Edit the text inside `index.html` in the `.message-box` and `.letter-body` sections.

## Project structure

```
birthday-surprise/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── photo1.jpg
    ├── photo2.jpg
    ├── video1.mp4
    └── HOW-TO-ADD-FILES.md
```
