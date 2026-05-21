# 🚀 BeniRide — LAUNCH STEPS

## ✅ WHAT THIS APP HAS
- 🧍 **Rider App** — Book BeniMoto, BeniCar, BeniEbike with real fare calculator
- 🏍️ **Driver App** — Go online, accept/decline ride requests, see earnings
- 📝 **Join Us** — Full application form for drivers, car owners, e-bike partners, businesses
- 🗺️ **9 Nepal cities** — Beni live, 8 cities coming soon
- 💰 **Auto fare** — Base + per km formula (you keep 80%, BeniRide gets 20%)
- 📞 **Support** — WhatsApp + phone built in

---

## 📁 STEP 1 — UPLOAD TO GITHUB

Your repo: **github.com/baniyaempire8/BeniRide-**

1. Extract this ZIP
2. Go to your GitHub repo
3. Click **"Add file" → "Upload files"**
4. Drag ALL files from the extracted folder into GitHub
5. Click **"Commit changes"**

---

## ▲ STEP 2 — DEPLOY ON VERCEL

Vercel auto-deploys when GitHub updates! Just:

1. Go to **vercel.com** → your **beni-ride** project
2. Click **Deployments** → **Redeploy**
3. Wait 2 minutes → your app is LIVE at:

**https://beni-ride.vercel.app** ✅

---

## 🌐 STEP 3 — CUSTOM DOMAIN (Optional)

To use **ride.benidash.com** (free!):

1. Vercel → beni-ride → **Settings → Domains**
2. Type: `ride.benidash.com` → Add
3. Vercel gives you a CNAME record
4. Go to your domain provider (where you bought benidash.com)
5. Add the CNAME record
6. Wait 10 minutes → **ride.benidash.com is live!**

OR buy **beniride.com** on Namecheap (~$10/year) and connect it.

---

## 📱 STEP 4 — SHARE THE APP

Once live, share the link with:
- 5–10 local drivers in Beni → ask them to sign up via "Join Us"
- Friends & family → ask them to try booking
- Post in local Facebook groups

---

## 💰 PRICING (already in app)

| Ride | Formula | Min Fare |
|------|---------|----------|
| BeniMoto | Rs. 20 + Rs. 15/km | Rs. 50 |
| BeniCar | Rs. 50 + Rs. 35/km | Rs. 120 |
| BeniEbike | Rs. 30/hour flat | — |

**Your commission: 20% of every ride**

---

## 🔮 STEP 5 — REAL BACKEND (Firebase)

When you're ready to store real data:

1. Go to **console.firebase.google.com**
2. Create project: `beniride`
3. Enable **Firestore** + **Authentication**
4. Add these to Vercel → **Settings → Environment Variables**:

```
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

5. Redeploy → real sign ups save to Firebase!

---

## 📲 STEP 6 — ANDROID APP

When ready to put on Google Play:
1. Use **Capacitor** to wrap the web app into Android
2. Build APK → upload to Google Play Console
3. Same account you used for BeniDash!

---

## 🏔️ CITY EXPANSION PLAN

| Phase | When | Cities |
|-------|------|--------|
| 1 | NOW | Beni ✅ |
| 2 | 6 months | Baglung, Pokhara |
| 3 | 1 year | Butwal, Chitwan |
| 4 | 2 years | Kathmandu, Lalitpur |
| 5 | 2028 | All Nepal 🇳🇵 |

---

## 📞 SUPPORT NUMBER

Update your WhatsApp number in the app:
Open `src/App.js` → search for `+977-980-000-0000` → replace with your real number.

---

**Built from Dallas, Texas 🇺🇸 for Beni, Myagdi, Nepal 🏔️**
*BeniRide — Nepal's ride for everyone.*
