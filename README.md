# 🏍️ BeniRide — Rides & E-Bikes in Beni, Myagdi

> The first ride-hailing app for Beni, Myagdi, Nepal.
> Book motorcycle rides, car rides, or rent e-bikes — all in one app.

---

## 🚀 STEP BY STEP SETUP GUIDE

### STEP 1 — Install Tools (do this once)
1. Download and install **Node.js** from https://nodejs.org (choose LTS version)
2. Download and install **Git** from https://git-scm.com
3. Create a free account on **GitHub** at https://github.com
4. Create a free account on **Vercel** at https://vercel.com
5. Create a free account on **Firebase** at https://firebase.google.com

---

### STEP 2 — Setup Firebase (your backend/database)
1. Go to https://console.firebase.google.com
2. Click **"Add Project"** → name it `beniride` → Continue
3. Go to **Build → Authentication** → Get Started → Enable **Email/Password**
4. Go to **Build → Firestore Database** → Create Database → Start in test mode
5. Go to **Project Settings** (gear icon) → **Your Apps** → Click Web icon `</>`
6. Name it `beniride-web` → Register App
7. **Copy the firebaseConfig object** that appears
8. Open the file `src/firebase/config.js` and paste your values in

---

### STEP 3 — Update Your Info
Open `src/data/constants.js` and update:
- `SUPPORT.whatsapp` → your WhatsApp number (format: 977-98XXXXXXXX)
- `SUPPORT.phone` → your phone number
- `SUPPORT.email` → your email
- Add/edit locations under `BENI_LOCATIONS` as needed
- Update pricing under `PRICING` if needed

---

### STEP 4 — Upload to GitHub
Open terminal/command prompt in the beniride folder and run:

```bash
git init
git add .
git commit -m "BeniRide first launch 🚀"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/beniride.git
git push -u origin main
```

(Create the repo on github.com first, then copy the URL)

---

### STEP 5 — Deploy to Vercel (your live website link)
1. Go to https://vercel.com → Login with GitHub
2. Click **"Add New Project"**
3. Select your `beniride` GitHub repository
4. Click **Deploy** → wait 2 minutes
5. Your app is LIVE at `https://beniride.vercel.app` (or similar link) 🎉

---

### STEP 6 — Run Locally (for testing on your computer)
```bash
npm install
npm start
```
Opens at http://localhost:3000

---

## 📁 FILE STRUCTURE

```
beniride/
├── src/
│   ├── firebase/
│   │   ├── config.js          ← Your Firebase keys go here
│   │   └── services.js        ← All database functions
│   ├── context/
│   │   └── AuthContext.js     ← Login/logout state
│   ├── pages/
│   │   ├── AuthPage.js        ← Login & Signup screen
│   │   └── HomePage.js        ← Main booking screen
│   ├── data/
│   │   └── constants.js       ← Locations, prices, support number
│   ├── App.js                 ← App routes
│   └── index.js               ← Entry point
├── public/
│   └── index.html
├── vercel.json                ← Vercel config
├── package.json
└── README.md
```

---

## 🗺️ HOW TO ADD MORE BENI LOCATIONS
In `src/data/constants.js`, add to the `BENI_LOCATIONS` array:
```js
{ id: "new_place", name: "New Place Name", lat: 28.XXXX, lng: 83.XXXX },
```
Get coordinates from Google Maps → right-click any location → copy coordinates.

---

## 💰 HOW TO CHANGE PRICES
In `src/data/constants.js`, update `PRICING`:
- `base` = fixed starting fare
- `perKm` = per kilometre charge
- `minFare` = minimum a rider pays

---

## 📞 SUPPORT CONTACT
Update `SUPPORT` in `src/data/constants.js` with your real WhatsApp & phone number.

---

## 🔮 COMING SOON (Future Updates)
- [ ] Driver app (separate login for drivers)
- [ ] Live GPS tracking
- [ ] eSewa / Khalti payment
- [ ] E-bike QR scan unlock
- [ ] Admin dashboard
- [ ] Push notifications
- [ ] Android & iOS app (React Native)

---

## 👨‍💻 Built by
BeniRide — Beni, Myagdi, Nepal 🏔️
