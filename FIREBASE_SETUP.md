# 🔥 Firebase Setup Guide - Quick Reference

## Where to Add Firebase API Keys

### Location 1: Environment Variables (.env)

**File:** `/.env`

Add this line:

```env
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
```

**How to get it:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click on "Realtime Database" in the left sidebar
4. Copy the database URL from the top of the page

---

### Location 2: Service Account Key (JSON file)

**File:** `/src/config/firebase-service-account.json`

**How to get it:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click the gear icon ⚙️ → Project Settings
3. Go to "Service Accounts" tab
4. Click "Generate New Private Key"
5. Save the downloaded JSON file as `firebase-service-account.json`
6. Move it to: `src/config/firebase-service-account.json`

**Example structure:**

```json
{
  "type": "service_account",
  "project_id": "ecoshore-12345",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@ecoshore-12345.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

---

## Quick Setup Steps

### Option A: Test WITHOUT Firebase (Mock Mode) ✅ RECOMMENDED FOR TESTING

**No setup needed!** The chat feature works in mock mode by default.

- ✅ All API endpoints work
- ✅ You can test with Postman immediately
- ❌ Messages won't persist in Firebase
- ❌ Real-time updates won't work

**Just start testing:**

```bash
npm run dev
```

---

### Option B: Full Firebase Integration

**Step 1:** Install firebase-admin

```bash
npm install firebase-admin
```

**Step 2:** Set up Firebase project

1. Create project at https://console.firebase.google.com/
2. Enable Realtime Database
3. Set database rules to test mode (temporary):

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**Step 3:** Download Service Account Key

- Project Settings → Service Accounts → Generate New Private Key
- Save as: `src/config/firebase-service-account.json`

**Step 4:** Update .env

```env
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
```

**Step 5:** Enable Firebase in code
Edit `src/providers/FirebaseChatProvider.js`:

**Uncomment lines 27-40:**

```javascript
// Change from:
/*
const admin = require('firebase-admin');
const serviceAccount = require('../../config/firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

this.db = admin.database();
*/

// To:
const admin = require('firebase-admin');
const serviceAccount = require('../../config/firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

this.db = admin.database();
```

**Comment out lines 43-46 (mock implementation):**

```javascript
// Comment this:
logger.warn(
  'Firebase not initialized. Using mock mode. Install firebase-admin for production.'
);
this.initialized = true;
```

**Step 6:** Restart server

```bash
npm run dev
```

---

## Testing Chat Endpoints

### 1. Create Chat Group

```http
POST http://localhost:4000/chat/groups
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Test Chat",
  "description": "Testing Firebase chat",
  "type": "ORGANIZER_PRIVATE"
}
```

### 2. Send Message

```http
POST http://localhost:4000/chat/groups/:groupId/messages
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "text": "Hello from Postman!",
  "mediaUrl": null
}
```

### 3. Get Messages

```http
GET http://localhost:4000/chat/groups/:groupId/messages?limit=50
Authorization: Bearer YOUR_TOKEN
```

---

## Troubleshooting

### Error: "Firebase not initialized"

- This is normal in mock mode
- No action needed if you want to test without Firebase
- Or follow Option B to enable Firebase

### Error: "FIREBASE_DATABASE_URL is not defined"

- Add `FIREBASE_DATABASE_URL` to your `.env` file
- Make sure you restart the server after adding it

### Error: "Cannot find module firebase-admin"

- Run: `npm install firebase-admin`

### Error: "Service account key not found"

- Download the key from Firebase Console
- Place it at: `src/config/firebase-service-account.json`
- Make sure the filename is exact

### Error: "Permission denied" from Firebase

- Update your Realtime Database rules to allow read/write
- For testing, use test mode rules (shown above)
- Remember to secure them for production!

---

## Security Notes

⚠️ **IMPORTANT:**

- ✅ `.env` file is in `.gitignore` - won't be committed
- ✅ `firebase-service-account.json` is in `.gitignore` - won't be committed
- ❌ NEVER commit these files to Git
- ❌ NEVER share your service account key publicly
- ⚠️ Change test mode rules to secure rules in production

---

## Summary

**For quick Postman testing:**

- No Firebase setup needed! Use mock mode (default)
- Just add MongoDB URI and JWT_SECRET to `.env`
- Start server and test all endpoints

**For production or full testing:**

- Add `FIREBASE_DATABASE_URL` to `.env`
- Download service account key to `src/config/firebase-service-account.json`
- Install `firebase-admin`
- Uncomment Firebase code in `FirebaseChatProvider.js`
- Restart server

**Files to update:**

1. ✅ `/.env` - Add FIREBASE_DATABASE_URL
2. ✅ `/src/config/firebase-service-account.json` - Add downloaded key
3. ✅ `/src/providers/FirebaseChatProvider.js` - Uncomment Firebase code (optional)
