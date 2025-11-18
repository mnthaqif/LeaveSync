# LeaveSync Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                           │
│                    (React Native + Expo)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  HomeScreen  │  │ AddLeaveScreen│ │  Components  │         │
│  │              │  │               │  │              │         │
│  │ - Calendar   │  │ - Form       │  │ - Calendar   │         │
│  │ - Filters    │  │ - Validation │  │ - FilterBar  │         │
│  │ - Stats      │  │              │  │ - Modals     │         │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘         │
│         │                  │                                     │
│         └──────────┬───────┘                                     │
│                    │                                             │
│         ┌──────────▼──────────┐                                │
│         │   API Service       │                                │
│         │   (Axios)           │                                │
│         └──────────┬──────────┘                                │
│                    │                                             │
└────────────────────┼─────────────────────────────────────────────┘
                     │ HTTP/JSON
                     │
┌────────────────────▼─────────────────────────────────────────────┐
│                        BACKEND LAYER                              │
│                  (Node.js + Express + TypeScript)                 │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                  API Routes (Express Router)               │  │
│  │                                                            │  │
│  │  GET    /api/users              │  Rate: 100/15min       │  │
│  │  GET    /api/users/:id          │                        │  │
│  │  GET    /api/leaves             │  Rate: 100/15min       │  │
│  │  POST   /api/leaves             │  Rate: 20/15min        │  │
│  │  DELETE /api/leaves/:id         │  Rate: 20/15min        │  │
│  │  GET    /api/public-holidays/:s │  Rate: 100/15min       │  │
│  │  POST   /api/public-holidays/ref│  Rate: 10/hour         │  │
│  └────────────────────┬──────────────────────────────────────┘  │
│                       │                                          │
│  ┌────────────────────▼──────────────────────────────────────┐  │
│  │                    Controllers                             │  │
│  │                                                            │  │
│  │  userController     leaveController  publicHolidayCtrl    │  │
│  │  - getAllUsers      - getAllLeaves   - getPublicHolidays  │  │
│  │  - getUserById      - createLeave    - refreshHolidays    │  │
│  │                     - deleteLeave                         │  │
│  └────────────────────┬──────────────────────────────────────┘  │
│                       │                                          │
│  ┌────────────────────▼──────────────────────────────────────┐  │
│  │                     Services                               │  │
│  │                                                            │  │
│  │  Connected Leave Service      Public Holiday Service      │  │
│  │  - detectConnectedLeave       - fetchAndCacheHolidays     │  │
│  │  - isWeekend                  - getPublicHolidaysByState  │  │
│  │  - isPublicHoliday                                        │  │
│  └────────────────────┬──────────────────────────────────────┘  │
│                       │                                          │
└───────────────────────┼──────────────────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────────────────┐
│                     DATABASE LAYER                                │
│                        (MySQL 8.0)                                │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────┐  │
│  │  user           │  │  leave_record    │  │ public_holiday │  │
│  ├─────────────────┤  ├──────────────────┤  ├────────────────┤  │
│  │ id (PK)         │  │ id (PK)          │  │ id (PK)        │  │
│  │ name            │  │ user_id (FK)     │  │ date           │  │
│  │ email           │  │ start_date       │  │ state          │  │
│  │ department      │  │ end_date         │  │ holiday_name   │  │
│  │ state           │  │ leave_type       │  │ type           │  │
│  │ created_at      │  │ notes            │  │ created_at     │  │
│  └────────┬────────┘  │ created_at       │  └────────────────┘  │
│           │           └──────┬───────────┘                       │
│           │                  │                                   │
│           └──────────────────┘                                   │
│                     (1:N relationship)                            │
└───────────────────────────────────────────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────────────────┐
│                   EXTERNAL SERVICES                               │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           Calendarific API (Public Holidays)             │   │
│  │                                                           │   │
│  │  https://calendarific.com/api/v2/holidays                │   │
│  │  - Malaysia public holidays                              │   │
│  │  - State-specific holidays                               │   │
│  │  - Cached in database                                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. View Calendar

```
User → HomeScreen
  ↓
API Service (getLeaves, getPublicHolidays, getUsers)
  ↓
Backend API (/api/leaves, /api/public-holidays/:state, /api/users)
  ↓
Controllers (getAllLeaves, getPublicHolidays, getAllUsers)
  ↓
MySQL Database (SELECT queries)
  ↓
JSON Response
  ↓
CalendarView Component (renders color-coded events)
  ↓
User sees calendar
```

### 2. Add Leave

```
User fills form in AddLeaveScreen
  ↓
Validation (date format, date range)
  ↓
API Service (createLeave)
  ↓
Backend API (POST /api/leaves)
  ↓
leaveController.createLeave
  ↓
1. Get user's state from database
2. connectedLeaveService.detectConnectedLeave
   - Check day before start date
   - Check day after end date
   - Query public_holiday table
   - Check weekend (state-specific)
3. Determine leave_type (Normal or Connected)
4. INSERT into leave_record table
  ↓
JSON Response with created leave
  ↓
Success message to user
  ↓
Navigate back to calendar
```

### 3. Filter Calendar

```
User opens FilterBar
  ↓
Select filters (staff, department, leave_type, state)
  ↓
API Service (getLeaves with query params)
  ↓
Backend API (GET /api/leaves?user_id=1&department=Engineering)
  ↓
leaveController.getAllLeaves
  ↓
Build dynamic SQL query with filters
  ↓
MySQL Database (SELECT with WHERE clauses)
  ↓
Filtered results
  ↓
CalendarView updates with filtered data
```

### 4. Fetch Public Holidays

```
Backend starts
  ↓
Check if holidays exist in database for current year
  ↓
If not found and API key available:
  ↓
publicHolidayService.fetchAndCacheHolidays
  ↓
External API call to Calendarific
  ↓
Parse response (filter by state)
  ↓
INSERT into public_holiday table (with duplicate handling)
  ↓
Cache stored for future requests
```

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Rate Limiting                         │
│  - 100 requests/15min (general)                         │
│  - 20 requests/15min (writes)                           │
│  - 10 requests/hour (sensitive)                         │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                  Input Validation                        │
│  - Date format validation                               │
│  - Required fields check                                │
│  - Type validation                                      │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│              Parameterized Queries                       │
│  - SQL injection prevention                             │
│  - Prepared statements                                  │
│  - mysql2 with placeholders                             │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                 CORS Configuration                       │
│  - Controlled origin access                             │
│  - Credential handling                                  │
└─────────────────────────────────────────────────────────┘
```

## Deployment Architecture

### Development

```
┌──────────────────────┐
│  Developer Machine   │
│  or                  │
│  GitHub Codespaces   │
├──────────────────────┤
│                      │
│  Frontend (Expo)     │
│  :8080 or :19006     │
│                      │
│  Backend (Express)   │
│  :4000               │
│                      │
│  MySQL               │
│  :3306               │
│                      │
└──────────────────────┘
```

### Production

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Pages                          │
│               (Static Web Hosting)                       │
│  https://mnthaqif.github.io/LeaveSync/                  │
│                                                          │
│  - Expo web build                                       │
│  - Static HTML/CSS/JS                                   │
│  - API calls to backend                                 │
└─────────────────┬───────────────────────────────────────┘
                  │ HTTPS
                  │
┌─────────────────▼───────────────────────────────────────┐
│              Docker Container Host                       │
│         (Railway/Render/Fly.io/etc.)                    │
│                                                          │
│  ┌────────────────────────────────────────────┐        │
│  │     LeaveSync Backend Container            │        │
│  │  ghcr.io/mnthaqif/leavesync-backend        │        │
│  │                                             │        │
│  │  - Node.js + Express                       │        │
│  │  - Port 4000                                │        │
│  │  - Environment variables                    │        │
│  └────────────────┬───────────────────────────┘        │
└───────────────────┼────────────────────────────────────┘
                    │
┌───────────────────▼────────────────────────────────────┐
│              MySQL Database Host                        │
│         (Managed MySQL Service)                         │
│                                                         │
│  - MySQL 8.0                                            │
│  - Persistent storage                                   │
│  - Automated backups                                    │
└─────────────────────────────────────────────────────────┘
```

## Technology Stack Layers

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION                          │
│  - React Native (UI components)                         │
│  - NativeWind (Tailwind CSS styling)                    │
│  - React Navigation (routing)                           │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                   APPLICATION                            │
│  - React hooks (state management)                       │
│  - Axios (HTTP client)                                  │
│  - date-fns (date utilities)                            │
│  - TypeScript (type safety)                             │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                    API LAYER                             │
│  - Express (web framework)                              │
│  - express-rate-limit (security)                        │
│  - TypeScript (type safety)                             │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                  BUSINESS LOGIC                          │
│  - Services (connectedLeave, publicHoliday)             │
│  - Controllers (user, leave, holiday)                   │
│  - date-fns (date calculations)                         │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                  DATA ACCESS                             │
│  - mysql2 (database driver)                             │
│  - Connection pooling                                    │
│  - Prepared statements                                   │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                   DATABASE                               │
│  - MySQL 8.0                                            │
│  - InnoDB engine                                        │
│  - UTF-8 character set                                  │
└─────────────────────────────────────────────────────────┘
```

## Component Communication

### Frontend Components

```
App.tsx (Root)
  │
  ├── NavigationContainer
  │     │
  │     └── StackNavigator
  │           │
  │           ├── HomeScreen
  │           │     │
  │           │     ├── FilterBar
  │           │     │     └── Modal (Filter UI)
  │           │     │
  │           │     └── CalendarView
  │           │           └── Modal (Event Details)
  │           │
  │           └── AddLeaveScreen
  │                 └── Form (Leave Input)
  │
  └── API Service (Axios)
        └── Backend HTTP calls
```

### Backend Components

```
server.ts (Entry Point)
  │
  ├── Middleware
  │     ├── CORS
  │     ├── JSON parser
  │     └── Rate limiting
  │
  ├── Routes
  │     ├── /api/users
  │     ├── /api/leaves
  │     └── /api/public-holidays
  │
  ├── Controllers
  │     ├── userController
  │     ├── leaveController
  │     └── publicHolidayController
  │
  ├── Services
  │     ├── connectedLeaveService
  │     └── publicHolidayService
  │
  └── Database (MySQL Pool)
        └── Connection Management
```

## State Management

### Frontend State

```
HomeScreen State:
  - leaves: Leave[]
  - filteredLeaves: Leave[]
  - holidays: PublicHoliday[]
  - users: User[]
  - loading: boolean
  - refreshing: boolean
  - error: string | null

AddLeaveScreen State:
  - users: User[]
  - selectedUserId: number | null
  - startDate: string
  - endDate: string
  - notes: string
  - loading: boolean
  - loadingUsers: boolean

CalendarView State:
  - currentDate: Date
  - selectedDate: Date | null
  - modalVisible: boolean

FilterBar State:
  - showFilters: boolean
  - filters: FilterState
    - userId?: number
    - department?: string
    - leaveType?: string
    - state?: string
```

### Backend State

```
Connection Pool:
  - Active connections
  - Waiting queue
  - Connection limit: 10

Rate Limiter State:
  - IP address counters
  - Window timestamps
  - Request counts per window

Cache State:
  - Public holidays by (date, state)
  - No explicit cache, uses database
```

## Error Handling Flow

```
Error Occurs
  │
  ├── Frontend
  │     │
  │     ├── Network Error
  │     │     └── Display: "Connection Error"
  │     │
  │     ├── Validation Error
  │     │     └── Display: Alert with message
  │     │
  │     └── API Error (4xx/5xx)
  │           └── Display: error.response.data.error
  │
  └── Backend
        │
        ├── Validation Error
        │     └── Return: 400 Bad Request
        │
        ├── Not Found
        │     └── Return: 404 Not Found
        │
        ├── Rate Limit Exceeded
        │     └── Return: 429 Too Many Requests
        │
        └── Server Error
              └── Return: 500 Internal Server Error
              └── Log: console.error(error)
```

This architecture provides a scalable, maintainable, and secure foundation for the LeaveSync application.
