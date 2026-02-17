# Postman Testing Guide - EcoShore Backend

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
# For Firebase integration (optional):
npm install firebase-admin
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update the values:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/ecoshore
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
```

### 3. Firebase Setup (For Chat Feature)

#### Option A: Use Mock Mode (Quick Testing)
- Chat feature works in **mock mode** by default
- No Firebase setup needed
- Messages won't persist but API endpoints work

#### Option B: Full Firebase Integration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable **Realtime Database**
4. Go to Project Settings → Service Accounts
5. Click "Generate New Private Key"
6. Save as `src/config/firebase-service-account.json`
7. Update `.env` with your Firebase Database URL
8. Install firebase-admin: `npm install firebase-admin`
9. Uncomment Firebase code in `src/providers/FirebaseChatProvider.js` (lines 27-40)

### 4. Start MongoDB
```bash
# Make sure MongoDB is running
mongod
```

### 5. Start Server
```bash
npm run dev
```

Server will run on: `http://localhost:4000`

---

## API Testing with Postman

### Base URL
```
http://localhost:4000
```

---

## 1. AUTHENTICATION (Get Token First!)

### Register User
**POST** `/auth/register`
```json
{
  "email": "volunteer@test.com",
  "password": "password123",
  "name": "Test Volunteer"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "volunteer@test.com",
    "role": "VOLUNTEER"
  }
}
```

### Login
**POST** `/auth/login`
```json
{
  "email": "volunteer@test.com",
  "password": "password123"
}
```

### Create Admin User (via MongoDB)
```bash
# In MongoDB shell or Compass
db.users.insertOne({
  email: "admin@test.com",
  password: "$2a$10$hashed_password_here",
  name: "Admin User",
  role: "ADMIN",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

---

## 2. ORGANIZER REQUEST FLOW

### Step 1: Create Organizer Request (VOLUNTEER only)
**POST** `/organizer-requests`

**Headers:**
```
Authorization: Bearer YOUR_VOLUNTEER_TOKEN
```

**Body:**
```json
{
  "reason": "I have 5 years experience organizing beach cleanups in my local community"
}
```

### Step 2: Get My Request
**GET** `/organizer-requests/me`

**Headers:**
```
Authorization: Bearer YOUR_VOLUNTEER_TOKEN
```

### Step 3: Get All Requests (ADMIN only)
**GET** `/organizer-requests?status=PENDING&page=1&limit=10`

**Headers:**
```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

### Step 4: Review Request (ADMIN only)

**Approve:**
**PATCH** `/organizer-requests/:requestId/review`

**Headers:**
```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Body:**
```json
{
  "action": "APPROVE"
}
```

**Reject:**
```json
{
  "action": "REJECT",
  "rejectionReason": "Insufficient experience"
}
```

### Step 5: Delete Request
**DELETE** `/organizer-requests/:requestId`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

---

## 3. EVENT MANAGEMENT

### Create Event (ORGANIZER/ADMIN only)
**POST** `/events`

**Headers:**
```
Authorization: Bearer YOUR_ORGANIZER_TOKEN
```

**Body:**
```json
{
  "title": "Beach Cleanup - Santa Monica",
  "description": "Join us for a community beach cleanup event",
  "location": "Santa Monica Beach, CA",
  "coordinates": {
    "latitude": 34.0195,
    "longitude": -118.4912
  },
  "startDate": "2026-03-15T09:00:00Z",
  "endDate": "2026-03-15T13:00:00Z",
  "maxVolunteers": 50,
  "tags": ["beach-cleanup", "environment", "community"]
}
```

### Get All Events (Public)
**GET** `/events?status=UPCOMING&page=1&limit=10`

No authentication required

### Get Event by ID (Public)
**GET** `/events/:eventId`

### Update Event (Organizer/Admin only)
**PATCH** `/events/:eventId`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Body:**
```json
{
  "title": "Updated Event Title",
  "maxVolunteers": 75
}
```

### Join Event (Private)
**POST** `/events/:eventId/join`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

### Leave Event (Private)
**POST** `/events/:eventId/leave`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

### Delete Event (Organizer/Admin only)
**DELETE** `/events/:eventId`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

---

## 4. CHAT SYSTEM

### Create Chat Group (ORGANIZER/ADMIN only)
**POST** `/chat/groups`

**Headers:**
```
Authorization: Bearer YOUR_ORGANIZER_TOKEN
```

**Body:**
```json
{
  "name": "Volunteer Coordination",
  "description": "Main chat for volunteer coordination",
  "type": "ORGANIZER_PRIVATE"
}
```

**Types:**
- `GLOBAL_VOLUNTEER` - All volunteers
- `ORGANIZER_PRIVATE` - Organizers only
- `EVENT_GROUP` - Event-specific (auto-created with events)

### Get My Chat Groups
**GET** `/chat/groups`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

### Get Chat Group by ID
**GET** `/chat/groups/:groupId`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

### Add Member to Group (Admin only)
**POST** `/chat/groups/:groupId/members`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Body:**
```json
{
  "userId": "507f1f77bcf86cd799439011"
}
```

### Remove Member (Admin or Self)
**DELETE** `/chat/groups/:groupId/members/:userId`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

### Promote to Admin
**PATCH** `/chat/groups/:groupId/admins`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Body:**
```json
{
  "userId": "507f1f77bcf86cd799439011"
}
```

### Send Message
**POST** `/chat/groups/:groupId/messages`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Body:**
```json
{
  "text": "Hello everyone! Looking forward to the cleanup event!",
  "mediaUrl": "https://example.com/image.jpg"
}
```

### Get Messages
**GET** `/chat/groups/:groupId/messages?limit=50`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

### Delete Message (Admin only)
**DELETE** `/chat/groups/:groupId/messages/:messageId`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

### Mark Message as Seen
**PATCH** `/chat/groups/:groupId/messages/:messageId/seen`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

---

## 5. COMMUNITY CONTENT

### Create Post
**POST** `/community/posts`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Body:**
```json
{
  "text": "Just completed an amazing beach cleanup! Collected 50kg of plastic waste!",
  "mediaUrls": ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
  "visibility": "PUBLIC"
}
```

**Visibility:**
- `PUBLIC` - Everyone can see
- `AUTHENTICATED` - Only logged-in users

### Get All Posts (Public with optional auth)
**GET** `/community/posts?page=1&limit=10&authorId=OPTIONAL_USER_ID`

Optional Header:
```
Authorization: Bearer YOUR_TOKEN
```

### Get Post by ID
**GET** `/community/posts/:postId`

### Create Comment
**POST** `/community/posts/:postId/comments`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Body:**
```json
{
  "text": "Great work! Keep it up!"
}
```

### Get Comments
**GET** `/community/posts/:postId/comments?page=1&limit=20`

### Like Post
**POST** `/community/posts/:postId/like`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

### Unlike Post
**DELETE** `/community/posts/:postId/like`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

### Share Post
**POST** `/community/posts/:postId/share`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

### Update Post (Author only)
**PATCH** `/community/posts/:postId`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Body:**
```json
{
  "text": "Updated post text",
  "visibility": "AUTHENTICATED"
}
```

### Delete Post/Comment (Author only)
**DELETE** `/community/content/:contentId`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

---

## Testing Workflow Example

### Complete Flow: Volunteer → Organizer → Event → Chat

1. **Register as Volunteer**
   - POST `/auth/register` with volunteer details
   - Save the token

2. **Request Organizer Role**
   - POST `/organizer-requests` with reason
   - Save request ID

3. **Login as Admin** (create admin in DB first)
   - POST `/auth/login` with admin credentials
   - Save admin token

4. **Approve Request**
   - PATCH `/organizer-requests/:id/review` with APPROVE

5. **Login as Promoted Organizer**
   - POST `/auth/login` (user is now ORGANIZER)
   - Save new token

6. **Create Event**
   - POST `/events` with event details
   - Event auto-creates chat group
   - Save event ID and chatGroupId

7. **Join Event as Volunteer**
   - Login as different volunteer
   - POST `/events/:id/join`

8. **Send Chat Message**
   - POST `/chat/groups/:groupId/messages`

9. **Create Community Post**
   - POST `/community/posts`

10. **Get All Events**
    - GET `/events`

---

## Common Issues

### Issue: "Unauthorized" Error
**Solution:** Make sure you include the `Authorization: Bearer TOKEN` header

### Issue: "User not found" when testing chat
**Solution:** Make sure users exist in database before adding to chat groups

### Issue: Firebase errors
**Solution:** Use mock mode (default) for testing without Firebase setup

### Issue: "Forbidden" Error
**Solution:** Check that your user has the correct role for the endpoint

---

## Postman Environment Variables

Create these in Postman:

- `baseUrl`: `http://localhost:4000`
- `volunteerToken`: (set after volunteer login)
- `organizerToken`: (set after organizer login)
- `adminToken`: (set after admin login)
- `eventId`: (set after creating event)
- `chatGroupId`: (set after creating chat group)
- `postId`: (set after creating post)

---

## API Documentation

Swagger documentation available at:
```
http://localhost:4000/api-docs
```

---

## Notes

- **Mock Mode:** Chat feature works in mock mode without Firebase
- **Transactions:** Event creation automatically creates chat groups
- **Role Flow:** VOLUNTEER → apply → ADMIN approves → ORGANIZER
- **Auto-Groups:** Volunteers auto-added to GLOBAL_VOLUNTEER group on registration
- **Soft Deletes:** Events and posts use soft deletes (isDeleted flag)
