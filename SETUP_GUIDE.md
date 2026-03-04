# Hosting & Setup Guide — User Study

---

## PART A: GitHub Pages Hosting (Free)

Since the videos are large MP4 files, we'll use **Git LFS** (Large File Storage) with GitHub.

### Step 1: Install Git LFS

```bash
# Windows (if not already installed)
git lfs install
```

### Step 2: Create the GitHub Repo

```bash
cd "D:\Real robot"

# Initialize repo
git init
git lfs track "*.mp4"
git add .gitattributes

# Add files
git add user_study.html
git add Real_DPO/Real_DPO/*.mp4
git add Real_OMNI/*.mp4

git commit -m "User study with videos"
```

### Step 3: Push to GitHub

1. Go to **https://github.com/new**
2. Create a new repo (e.g., `humanoid-user-study`)
3. Set it to **Public** (required for free GitHub Pages)
4. Do NOT initialize with README

```bash
git remote add origin https://github.com/YOUR_USERNAME/humanoid-user-study.git
git branch -M main
git push -u origin main
```

### Step 4: Enable GitHub Pages

1. Go to your repo on GitHub
2. **Settings** → **Pages** (left sidebar)
3. Source: **Deploy from a branch**
4. Branch: `main` / `/ (root)`
5. Click **Save**
6. Wait 1-2 minutes, your site will be at:
   ```
   https://YOUR_USERNAME.github.io/humanoid-user-study/user_study.html
   ```

### ⚠️ Important: GitHub LFS Bandwidth

- GitHub LFS free tier: **1 GB storage + 1 GB bandwidth/month**
- 42 motion pairs × ~2-5 MB each ≈ 200-400 MB storage
- Each participant viewing all videos ≈ 200-400 MB bandwidth
- **For ~3-10 participants this should be fine**
- If you need more: consider Netlify (100 GB/mo free) or your university server

### Alternative: Netlify (Recommended for larger audience)

```bash
# One command deploy
npx netlify-cli deploy --prod --dir="D:\Real robot"
```

Or just drag & drop the folder at **https://app.netlify.com/drop**

---

## PART B: Google Sheets Response Logging

This lets all participant responses automatically go to one Google Sheet — no backend server needed.

### Step 1: Create Google Sheet

1. Go to **https://sheets.google.com**
2. Click **+ Blank spreadsheet**
3. Name it: `User Study Responses`

### Step 2: Open Apps Script

1. In the spreadsheet, click **Extensions → Apps Script**
2. Delete all existing code in the editor
3. Copy & paste the ENTIRE contents of `google_apps_script.js` (included in this folder)
4. Click **Save** (💾 icon or Ctrl+S)

### Step 3: Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the gear icon ⚙️ next to "Select type" → choose **Web app**
3. Fill in:
   - **Description**: `User Study Logger`
   - **Execute as**: `Me (your@email.com)`
   - **Who has access**: `Anyone`
4. Click **Deploy**
5. Click **Authorize access** → choose your Google account → Allow
6. **Copy the Web App URL** (looks like):
   ```
   https://script.google.com/macros/s/AKfycbxxxxxxxxxx/exec
   ```

### Step 4: Paste URL into HTML

Open `user_study.html` and find this line (around line 640):

```javascript
const GOOGLE_SCRIPT_URL = ''; // ← Paste your deployed Apps Script URL here
```

Replace it with your URL:

```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxxxxxxxxxx/exec';
```

Save the file and re-deploy to GitHub Pages.

### Step 5: Test It

1. Open the study in your browser
2. Fill in a test response and submit
3. Check your Google Sheet — a new row should appear with:
   - Timestamp
   - Participant ID
   - All 126 answers (decoded to actual method names: "Ours" / "OmniControl")

### Step 6: View Results

Your Google Sheet will have columns like:

| timestamp | participantId | m115_q1 | m115_q2 | m115_q3 | m156_q1 | ... |
|-----------|---------------|---------|---------|---------|---------|-----|
| 2026-03-04T... | P01 | Ours | OmniControl | Both are similar | Ours | ... |

You can then do statistical analysis directly in Sheets or export to Excel/Python.

---

## PART C: Share with Participants

Send them the GitHub Pages URL:

```
https://YOUR_USERNAME.github.io/humanoid-user-study/user_study.html
```

That's it! They open the link, watch videos, answer questions, and responses flow to your Google Sheet automatically.

---

## Quick Checklist

- [ ] Git LFS installed
- [ ] Repo created and pushed to GitHub
- [ ] GitHub Pages enabled
- [ ] Google Sheet created
- [ ] Apps Script deployed
- [ ] URL pasted into `user_study.html`
- [ ] Test submission works
- [ ] Share link with participants
