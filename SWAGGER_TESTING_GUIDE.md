# Swagger API Testing Guide - EcoShore Backend

## Quick Start

### 1. Start Your Server

```bash
npm run dev
```

### 2. Access Swagger UI

Open your browser and go to:

```
http://localhost:4000/api-docs
```

### 3. Start Testing!

- All endpoints are documented with examples
- Click "Try it out" button on any endpoint
- Fill in the parameters
- Click "Execute" to test

---

## Authentication Setup

### Step 1: Register or Login

1. Navigate to **Auth** section in Swagger UI
2. Find **POST /auth/register** or **POST /auth/login**
3. Click **"Try it out"**
4. Enter request body:
5. Click **"Try it out"**
6. Enter request body:

```json
{
  "email": "volunteer@test.com",
  "password": "password123",
  "name": "Test Volunteer"
}
```

5. Click **"Execute"**
6. **Copy the token** from the response

### Step 2: Authorize Swagger

1. Click the **"Authorize"** button at the top right of Swagger UI (🔓 icon)
2. In the "Value" field, enter:
   ```
   Bearer YOUR_TOKEN_HERE
   ```
   _(Replace YOUR_TOKEN_HERE with the actual token you copied)_
3. Click **"Authorize"**
4. Click **"Close"**

Now all authenticated endpoints will use this token automatically! 🎉

---

## Environment Configuration

### Required .env Variables

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/ecoshore
# OR use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ecoshore

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=http://localhost:3000
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com/
NODE_ENV=development
```

### Firebase Setup (Optional - for Chat Persistence)

- **Default:** Chat works in **mock mode** (no setup needed)
- **Full Firebase:** See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for instructions

---

## Testing Workflows

### Workflow 1: User Registration & Login

1. **POST /auth/register**
   - Enter: email, password, name
   - Execute
   - Copy the token from response

2. **Authorize Swagger**
   - Click 🔓 icon → Enter `Bearer YOUR_TOKEN`
   - Now you're authenticated!

3. **POST /auth/login** (optional - test login)
   - Enter: email, password
   - Execute
   - Get a fresh token

---

### Workflow 2: Volunteer → Organizer Promotion

#### As Volunteer:

1. **POST /organizer-requests**
   - Make sure you're authorized (Bearer token set)
   - Enter reason:
   - Enter reason:

   ```json
   {
     "reason": "I have 5 years experience organizing beach cleanups"
   }
   ```

   - Execute
   - Note the request ID from response

2. **GET /organizer-requests/me**
   - Execute to check your request status
   - Status will be "PENDING"

#### As Admin:

3. **Create Admin User** (in MongoDB):

   ```javascript
   db.users.insertOne({
     email: 'admin@test.com',
     password: '$2b$10$SVfgYN3PBMve20G25f8xC.yuuIN/.vpz36CFO1vQCvCwGpbEvgcSG', // "password123"
     name: 'Admin User',
     role: 'admin',
     isDeleted: false,
     createdAt: new Date(),
     updatedAt: new Date(),
   });
   ```

4. **Login as Admin**
   - POST /auth/login with admin credentials
   - Copy the new token
   - Re-authorize Swagger with admin token

5. **GET /organizer-requests?status=PENDING**
   - Execute to see all pending requests

6. **PATCH /organizer-requests/{requestId}/review**
   - Enter the requestId from step 1
   - Enter body:

   ```json
   {
     "action": "APPROVE"
   }
   ```

   - Execute

7. **User is now promoted!** Login as volunteer again to get new token with organizer role

---

### Workflow 3: Create & Manage Events

#### As Organizer:

1. **Make sure you're authorized** with an organizer/admin token

2. **POST /events**
   - Click "Try it out"
   - Enter event details:
   - Enter event details:

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

   - Execute
   - **Note:** Event automatically creates a chat group!
   - Copy eventId and chatGroupId from response

3. **GET /events**
   - View all events (no auth required)
   - Try filters: `?status=UPCOMING&page=1&limit=10`

4. **GET /events/{eventId}**
   - View specific event details

#### As Volunteer:

5. **POST /events/{eventId}/join**
   - Authorize with volunteer token
   - Enter the eventId
   - Execute to join the event

6. **POST /events/{eventId}/leave**
   - Leave an event you joined

#### As Organizer/Admin:

7. **PATCH /events/{eventId}**
   - Update event details
   - Enter fields to update:

   ```json
   {
     "title": "Updated Event Title",
     "maxVolunteers": 75
   }
   ```

8. **DELETE /events/{eventId}**
   - Soft delete an event

---

### Workflow 4: Chat System

#### Create & Manage Chat Groups:

1. **POST /chat/groups** (Organizer/Admin only)

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
   - `EVENT_GROUP` - Event-specific (auto-created)

2. **GET /chat/groups**
   - View all your chat groups

3. **GET /chat/groups/{groupId}**
   - View specific group details

#### Send & Read Messages:

4. **POST /chat/groups/{groupId}/messages**
   - Enter groupId
   - Enter message:

   ```json
   {
     "text": "Hello everyone! Looking forward to the cleanup!",
     "mediaUrl": "https://example.com/photo.jpg"
   }
   ```

5. **GET /chat/groups/{groupId}/messages**
   - View messages (add `?limit=50` for more)

6. **PATCH /chat/groups/{groupId}/messages/{messageId}/seen**
   - Mark message as read

7. **DELETE /chat/groups/{groupId}/messages/{messageId}**
   - Delete a message (admin only)

#### Manage Members:

8. **POST /chat/groups/{groupId}/members**
   - Add member (admin only):

   ```json
   {
     "userId": "USER_ID_HERE"
   }
   ```

9. **DELETE /chat/groups/{groupId}/members/{userId}**
   - Remove member

10. **PATCH /chat/groups/{groupId}/admins**
    - Promote to admin:
    ```json
    {
      "userId": "USER_ID_HERE"
    }
    ```

---

### Workflow 5: Community Content

#### Create & Manage Posts:

1. **POST /community/posts**

   ```json
   {
     "text": "Just completed an amazing beach cleanup! Collected 50kg of plastic waste!",
     "mediaUrls": [
       "https://example.com/photo1.jpg",
       "https://example.com/photo2.jpg"
     ],
     "visibility": "PUBLIC"
   }
   ```

   **Visibility:**
   - `PUBLIC` - Everyone can see
   - `AUTHENTICATED` - Only logged-in users

2. **GET /community/posts**
   - View all posts (public endpoint)
   - Try: `?page=1&limit=10&authorId=USER_ID`

3. **GET /community/posts/{postId}**
   - View specific post

4. **PATCH /community/posts/{postId}**
   - Update your own post:
   ```json
   {
     "text": "Updated post text",
     "visibility": "AUTHENTICATED"
   }
   ```

#### Interact with Posts:

5. **POST /community/posts/{postId}/comments**

   ```json
   {
     "text": "Great work! Keep it up!"
   }
   ```

6. **GET /community/posts/{postId}/comments**
   - View all comments (`?page=1&limit=20`)

7. **POST /community/posts/{postId}/like**
   - Like a post

8. **DELETE /community/posts/{postId}/like**
   - Unlike a post

9. **POST /community/posts/{postId}/share**
   - Share a post (increments share count)

10. **DELETE /community/content/{contentId}**
    - Delete your own post or comment

---

## Swagger UI Tips

### 🔓 Authorization

- Always authorize after getting your token
- Click the lock icon next to any endpoint to see if it requires auth
- Green lock = authorized, red lock = needs authorization

### 📋 Schema Models

- Click "Schemas" at the bottom to see all data models
- Shows field types, requirements, and examples

### 💾 Try Different Responses

- Swagger shows example responses for each status code
- 200 = Success
- 400 = Bad Request
- 401 = Unauthorized
- 403 = Forbidden
- 404 = Not Found

### 🔄 Testing Multiple Users

1. Register/Login as User 1 → Copy token
2. Authorize with User 1 token → Test endpoints
3. Register/Login as User 2 → Copy new token
4. Click Authorize → Replace with User 2 token
5. Test interactions between users

---

## Common Testing Scenarios

### Scenario 1: End-to-End Event Flow

```
1. Register volunteer A
2. Register volunteer B
3. Create admin in DB
4. Volunteer A applies for organizer
5. Admin approves request
6. Organizer A creates event (chat group auto-created)
7. Volunteer B joins event
8. Both send messages in event chat
9. Create community post about event
10. Users comment and like the post
```

### Scenario 2: Role-Based Access Control

```
1. Try creating event as volunteer → Should fail (403)
2. Apply for organizer role
3. Get approved by admin
4. Login again (get new token with organizer role)
5. Try creating event again → Should succeed (200)
```

### Scenario 3: Chat Group Management

```
1. Auto-join GLOBAL_VOLUNTEER group on registration
2. Create ORGANIZER_PRIVATE group
3. Add/remove members
4. Promote members to admin
5. Send messages and mark as seen
6. Delete messages as admin
```

---

## Quick Reference

### Authentication Endpoints

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get token
- `GET /auth/google` - Google OAuth

### Organizer Requests

- `POST /organizer-requests` - Apply for organizer role
- `GET /organizer-requests/me` - Get my request
- `GET /organizer-requests` - Get all requests (admin)
- `PATCH /organizer-requests/{id}/review` - Approve/reject (admin)
- `DELETE /organizer-requests/{id}` - Delete request

### Events

- `POST /events` - Create event (organizer/admin)
- `GET /events` - List all events (public)
- `GET /events/{id}` - Get event details (public)
- `PATCH /events/{id}` - Update event (organizer/admin)
- `DELETE /events/{id}` - Delete event (organizer/admin)
- `POST /events/{id}/join` - Join event
- `POST /events/{id}/leave` - Leave event

### Chat

- `POST /chat/groups` - Create chat group (organizer/admin)
- `GET /chat/groups` - Get my groups
- `GET /chat/groups/{id}` - Get group details
- `POST /chat/groups/{id}/messages` - Send message
- `GET /chat/groups/{id}/messages` - Get messages
- `DELETE /chat/groups/{id}/messages/{msgId}` - Delete message (admin)
- `PATCH /chat/groups/{id}/messages/{msgId}/seen` - Mark as seen
- `POST /chat/groups/{id}/members` - Add member (admin)
- `DELETE /chat/groups/{id}/members/{userId}` - Remove member

### Community

- `POST /community/posts` - Create post
- `GET /community/posts` - List posts (public)
- `GET /community/posts/{id}` - Get post details
- `PATCH /community/posts/{id}` - Update post (author)
- `POST /community/posts/{id}/comments` - Add comment
- `GET /community/posts/{id}/comments` - Get comments
- `POST /community/posts/{id}/like` - Like post
- `DELETE /community/posts/{id}/like` - Unlike post
- `POST /community/posts/{id}/share` - Share post
- `DELETE /community/content/{id}` - Delete post/comment (author)

---

## Troubleshooting

### Issue: "Unauthorized" (401)

**Solution:** Click Authorize button and enter `Bearer YOUR_TOKEN`

### Issue: "Forbidden" (403)

**Solution:** Check your role. You may need organizer/admin role for this endpoint.

### Issue: Swagger UI won't load

**Solutions:**

- Check server is running: `npm run dev`
- Visit: http://localhost:4000/api-docs
- Check console for errors

### Issue: Token expired

**Solution:** Login again to get a fresh token, then re-authorize Swagger

### Issue: Can't find event/chat/post

**Solution:** Make sure you created the resource first and copied the correct ID

### Issue: Firebase errors in console

**Solution:** App runs in mock mode by default. Messages work but don't persist. See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for full integration.

---

## Additional Resources

- **Server URL:** http://localhost:4000
- **Swagger UI:** http://localhost:4000/api-docs
- **Firebase Setup:** See [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
- **Setup Status:** See [SETUP_STATUS.md](SETUP_STATUS.md)

---

## Notes

✅ **Swagger Benefits:**

- No need to manually add headers to every request
- Built-in request/response validation
- Interactive documentation
- Auto-generated examples
- Easy to test different user roles

ℹ️ **Key Points:**

- Chat works in **mock mode** by default (no Firebase needed)
- Events automatically create chat groups
- Volunteers auto-join GLOBAL_VOLUNTEER group on registration
- Role hierarchy: VOLUNTEER < ORGANIZER < ADMIN
- Most resources use soft deletes (isDeleted flag)

🚀 **Ready to Test:**

1. Start server: `npm run dev`
2. Open: http://localhost:4000/api-docs
3. Register → Get token → Authorize → Start testing!
