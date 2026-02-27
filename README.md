# EcoShore Backend

**Life Below Water** Beach cleanup management with waste analytics and pollution prediction.
**Classification: Public-SLIIT**

---

## Setup

**Requirements:** Node.js 18+, MongoDB 6+, Python 3.10+ (ML service)

```bash
git clone https://github.com/nirmal-404/EcoShore-Backend.git
cd EcoShore-Backend
npm install
```

Create `.env`:

```
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/ecoshore
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:4000/api/auth/google/callback
ML_SERVICE_URL=http://localhost:5001
ML_TRAIN_SECRET=ecoshore_train_secret
WEATHER_API_KEY=your_weather_api_key
```

Place `firebase-service-account.json` inside `src/config/`.

**ML service (optional):**

```bash
cd ml-service
python -m venv venv && venv\Scripts\activate
pip install -r requirements.txt && python train.py
```

**Run:**

```bash
npm run dev        # API: http://localhost:4000
                   # Swagger UI: http://localhost:4000/api-docs
cd ml-service && python app.py   # ML: http://localhost:5001
```

---

## User Roles

| Role        | Access                          |
| ----------- | ------------------------------- |
| `volunteer` | Join events, post content       |
| `organizer` | Create events and chat groups   |
| `admin`     | Full access                     |
| `agent`     | Submit waste records via portal |

---

## API Endpoints

**Base URL:** `http://localhost:4000/api`
**Auth header:** `Authorization: Bearer <token>`

### Auth

| Method | Endpoint         | Auth |
| ------ | ---------------- | ---- |
| POST   | `/auth/register` | No   |
| POST   | `/auth/login`    | No   |
| GET    | `/auth/google`   | No   |
| GET    | `/auth/me`       | Yes  |

### Beaches

| Method | Endpoint                    | Auth | Role  |
| ------ | --------------------------- | ---- | ----- |
| POST   | `/beaches`                  | Yes  | admin |
| GET    | `/beaches`                  | No   |       |
| GET    | `/beaches/severity-ranking` | No   |       |
| GET    | `/beaches/:beachId`         | No   |       |
| PUT    | `/beaches/:beachId`         | Yes  | admin |
| DELETE | `/beaches/:beachId`         | Yes  | admin |

### Waste Records

| Method         | Endpoint                                  | Auth | Role      |
| -------------- | ----------------------------------------- | ---- | --------- |
| POST           | `/waste-records/portal/submissions`       | Yes  | agent     |
| GET            | `/waste-records/portal/submissions`       | Yes  | agent     |
| POST           | `/waste-records`                          | Yes  | any       |
| GET            | `/waste-records`                          | Yes  | any       |
| GET            | `/waste-records/analytics/plastic-type`   | Yes  | any       |
| GET            | `/waste-records/analytics/monthly-trends` | Yes  | any       |
| GET/PUT/DELETE | `/waste-records/:recordId`                | Yes  | any/admin |
| PATCH          | `/waste-records/:recordId/verify`         | Yes  | any       |

### Analytics _(auth required)_

| Method | Endpoint                          |
| ------ | --------------------------------- |
| GET    | `/analytics/dashboard`            |
| GET    | `/analytics/severity-ranking`     |
| POST   | `/analytics/severity/recalculate` |
| GET    | `/analytics/trend-prediction`     |
| GET    | `/analytics/carbon-offset`        |
| GET    | `/analytics/export/json`          |
| GET    | `/analytics/export/csv`           |

### Heatmap _(auth required)_

| Method | Endpoint           | Role  |
| ------ | ------------------ | ----- |
| GET    | `/heatmap`         | any   |
| GET    | `/heatmap/health`  | any   |
| POST   | `/heatmap/refresh` | admin |

### Agents _(admin only)_

| Method | Endpoint                             |
| ------ | ------------------------------------ |
| POST   | `/agents`                            |
| GET    | `/agents`                            |
| GET    | `/agents/:agentId`                   |
| DELETE | `/agents/:agentId`                   |
| PATCH  | `/agents/:agentId/reassign/:beachId` |

### Carbon Config _(auth required)_

| Method         | Endpoint                            |
| -------------- | ----------------------------------- |
| GET            | `/carbon-config/active`             |
| POST/GET       | `/carbon-config`                    |
| GET/PUT/DELETE | `/carbon-config/:configId`          |
| PATCH          | `/carbon-config/:configId/activate` |
| POST           | `/carbon-config/reset/default`      |

### Events

| Method | Endpoint            | Auth | Role            |
| ------ | ------------------- | ---- | --------------- |
| POST   | `/events`           | Yes  | organizer/admin |
| GET    | `/events`           | No   |                 |
| GET    | `/events/:id`       | No   |                 |
| PATCH  | `/events/:id`       | Yes  | organizer/admin |
| POST   | `/events/:id/join`  | Yes  | volunteer       |
| POST   | `/events/:id/leave` | Yes  | volunteer       |
| DELETE | `/events/:id`       | Yes  | admin/volunteer |

### Chat Groups _(auth required)_

| Method            | Endpoint                                    | Role            |
| ----------------- | ------------------------------------------- | --------------- |
| POST              | `/chat/groups`                              | organizer/admin |
| GET               | `/chat/groups`                              | any             |
| GET               | `/chat/groups/:id`                          | any             |
| POST/DELETE/PATCH | `/chat/groups/:id/members`                  | group admin     |
| POST/GET          | `/chat/groups/:id/messages`                 | group member    |
| DELETE            | `/chat/groups/:id/messages/:messageId`      | group admin     |
| PATCH             | `/chat/groups/:id/messages/:messageId/seen` | group member    |

### Community Content

| Method      | Endpoint                        | Auth         |
| ----------- | ------------------------------- | ------------ |
| POST        | `/community/posts`              | Yes          |
| GET         | `/community/posts`              | Optional     |
| GET/PATCH   | `/community/posts/:id`          | Optional/Yes |
| POST/GET    | `/community/posts/:id/comments` | Yes/Optional |
| POST/DELETE | `/community/posts/:id/like`     | Yes          |
| POST        | `/community/posts/:id/share`    | Yes          |
| DELETE      | `/community/content/:id`        | Yes          |

### Organizer Requests

| Method | Endpoint                         | Role      |
| ------ | -------------------------------- | --------- |
| POST   | `/organizer-requests`            | volunteer |
| GET    | `/organizer-requests`            | admin     |
| GET    | `/organizer-requests/me`         | any       |
| PATCH  | `/organizer-requests/:id/review` | admin     |
| DELETE | `/organizer-requests/:id`        | any       |

### File Upload

| Method | Endpoint       | Auth | Role            |
| ------ | -------------- | ---- | --------------- |
| POST   | `/upload-file` | Yes  | organizer/admin |

### ML Microservice `http://localhost:5001`

| Method | Endpoint   | Description          |
| ------ | ---------- | -------------------- |
| GET    | `/health`  | Health check         |
| POST   | `/predict` | Pollution prediction |
| POST   | `/train`   | Retrain model        |

---

## Request / Response Examples

### Register

```http
POST /api/auth/register
Content-Type: application/json

{ "name": "Jane Doe", "email": "jane@eco.com", "password": "Pass123!" }
```

```json
// 201 Created
{
  "status": "success",
  "data": {
    "token": "<jwt>",
    "user": { "_id": "...", "email": "jane@eco.com", "role": "volunteer" }
  }
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{ "email": "jane@eco.com", "password": "Pass123!" }
```

```json
// 200 OK
{
  "status": "success",
  "data": { "token": "<jwt>", "user": { "_id": "...", "role": "volunteer" } }
}
```

### Create Beach _(admin)_

```http
POST /api/beaches
Authorization: Bearer <token>
Content-Type: application/json

{ "name": "Galle Face", "location": { "type": "Point", "coordinates": [79.84, 6.91] }, "description": "Urban beach in Colombo." }
```

```json
// 201 Created
{
  "status": "success",
  "data": {
    "beach": { "_id": "...", "name": "Galle Face", "severityScore": 0 }
  }
}
```

### Submit Waste Record _(agent)_

```http
POST /api/waste-records/portal/submissions
Authorization: Bearer <token>
Content-Type: application/json

{ "plasticType": "PET", "weight": 12.5, "source": "shoreline", "collectionDate": "2025-08-01" }
```

```json
// 201 Created
{
  "status": "success",
  "data": { "record": { "_id": "...", "plasticType": "PET", "weight": 12.5 } }
}
```

### Get Dashboard Analytics

```http
GET /api/analytics/dashboard
Authorization: Bearer <token>
```

```json
// 200 OK
{
  "status": "success",
  "data": {
    "totalWasteKg": 1540.3,
    "activeBeaches": 8,
    "totalVolunteers": 120,
    "totalEvents": 35
  }
}
```

### File Upload

```http
POST /api/upload-file
Authorization: Bearer <token>
Content-Type: multipart/form-data

// Form-data:
// file: [Selected File]
// folder: "beaches" (optional)
```

```json
// 200 OK
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/...",
    "public_id": "...",
    "resource_type": "image",
    "format": "jpg"
  }
}
```

### Error Response (all endpoints)

```json
// 400 / 401 / 403 / 404 / 500
{ "status": "fail", "message": "Descriptive error message" }
```

---

## HTTP Status Codes

| Code | Meaning          |
| ---- | ---------------- |
| 200  | Success          |
| 201  | Created          |
| 400  | Validation error |
| 401  | Unauthorized     |
| 403  | Forbidden        |
| 404  | Not found        |
| 500  | Server error     |

---

## Deployment

See [DEPLOYMENT_REPORT.md](DEPLOYMENT_REPORT.md) for deployment instructions.

## Testing

See [TESTING_REPORT.md](TESTING_REPORT.md) for testing instructions.

80% completed
