# LeaveSync API Documentation

Base URL: `http://localhost:4000/api`

## Authentication

Currently, no authentication is required. All endpoints are publicly accessible.

## Endpoints

### Health Check

```
GET /health
```

Returns API health status.

**Response:**
```json
{
  "status": "ok",
  "message": "LeaveSync API is running"
}
```

---

### Users

#### Get All Users

```
GET /api/users
```

Returns all users in the system.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Ahmad Bin Ali",
    "email": "ahmad@company.com",
    "department": "Engineering",
    "state": "Selangor"
  }
]
```

#### Get User by ID

```
GET /api/users/:id
```

Returns a specific user.

---

### Leave

#### Get All Leaves

```
GET /api/leaves
```

Query Parameters:
- `user_id` (optional): Filter by user ID
- `department` (optional): Filter by department
- `leave_type` (optional): Filter by leave type (Normal, Connected)
- `state` (optional): Filter by state
- `start_date` (optional): Filter leaves starting from this date
- `end_date` (optional): Filter leaves ending before this date

**Response:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "user_name": "Ahmad Bin Ali",
    "department": "Engineering",
    "state": "Selangor",
    "start_date": "2024-12-20",
    "end_date": "2024-12-22",
    "leave_type": "Connected",
    "notes": "Family vacation",
    "created_at": "2024-12-01T10:00:00.000Z"
  }
]
```

#### Create Leave

```
POST /api/leaves
```

**Request Body:**
```json
{
  "user_id": 1,
  "start_date": "2024-12-20",
  "end_date": "2024-12-22",
  "notes": "Family vacation"
}
```

The system automatically detects if the leave is "Connected" (adjacent to weekend/holiday).

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "user_name": "Ahmad Bin Ali",
  "department": "Engineering",
  "state": "Selangor",
  "start_date": "2024-12-20",
  "end_date": "2024-12-22",
  "leave_type": "Connected",
  "notes": "Family vacation",
  "created_at": "2024-12-01T10:00:00.000Z"
}
```

#### Delete Leave

```
DELETE /api/leaves/:id
```

Deletes a specific leave record.

---

### Public Holidays

#### Get Public Holidays by State

```
GET /api/public-holidays/:state
```

Query Parameters:
- `year` (optional): Filter by year

**Example:** `GET /api/public-holidays/Selangor?year=2024`

**Response:**
```json
[
  {
    "id": 1,
    "date": "2024-01-01",
    "state": "National",
    "holiday_name": "New Year's Day",
    "type": "National"
  }
]
```

#### Refresh Public Holidays

```
POST /api/public-holidays/refresh
```

Fetches fresh data from Calendarific API and updates the cache.

**Request Body:**
```json
{
  "state": "Selangor",
  "year": 2024
}
```

**Note:** Requires `CALENDARIFIC_API_KEY` environment variable.

---

## Connected Leave Detection

The backend automatically detects "Connected Leave" based on these rules:

1. Leave is connected if the day **before** the start date is:
   - A weekend (Sat-Sun for most states, Fri-Sat for Johor/Kedah/Kelantan/Terengganu)
   - A public holiday

2. Leave is connected if the day **after** the end date is:
   - A weekend
   - A public holiday

This allows tracking of staff who extend their leave to create long weekends.

## Error Responses

All endpoints return appropriate HTTP status codes:

- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

**Error Format:**
```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```
