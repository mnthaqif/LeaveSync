# LeaveSync Setup Guide

Complete guide to set up and run LeaveSync locally or in GitHub Codespaces.

## Prerequisites

### Local Development
- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

### Optional
- XAMPP/WAMP (for Windows users)
- Docker (for containerized deployment)

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/mnthaqif/LeaveSync.git
cd LeaveSync
```

### 2. Set Up MySQL Database

#### Option A: Using Command Line

```bash
# Log in to MySQL
mysql -u root -p

# Create database
CREATE DATABASE leavesync CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Exit MySQL
exit
```

#### Option B: Using XAMPP/phpMyAdmin

1. Start XAMPP and launch MySQL
2. Open phpMyAdmin (http://localhost/phpmyadmin)
3. Create a new database named `leavesync`
4. Set charset to `utf8mb4_unicode_ci`

### 3. Run Database Schema

```bash
# Navigate to backend directory
cd backend

# Run schema (from command line)
mysql -u root -p leavesync < schema.sql

# Or manually in MySQL client
mysql -u root -p
USE leavesync;
SOURCE /path/to/LeaveSync/backend/schema.sql;
```

### 4. Configure Environment Variables

```bash
# Copy example env file
cp backend/.env.example backend/.env

# Edit backend/.env with your settings
nano backend/.env  # or use your preferred editor
```

Update the following values:
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=leavesync
PORT=4000

# Optional: Get free API key from https://calendarific.com/
CALENDARIFIC_API_KEY=your_api_key_here
```

### 5. Install Dependencies

```bash
# Install root dependencies
npm install

# This will automatically install dependencies for both frontend and backend
```

### 6. Seed Database with Sample Data

```bash
npm run seed:backend
```

This will create:
- 8 sample users
- Sample leave records
- Malaysian public holidays for 2024-2025

### 7. Start Development Servers

```bash
# Start both backend and frontend
npm run dev
```

This command starts:
- Backend API on http://localhost:4000
- Expo web server (Metro bundler) on http://localhost:8080 or http://localhost:19006

### 8. Access the Application

- **Web App**: http://localhost:8080 or http://localhost:19006
- **Backend API**: http://localhost:4000/api
- **Health Check**: http://localhost:4000/health

## Running Individual Services

### Backend Only

```bash
npm --workspace backend run dev
```

### Frontend Only

```bash
npm --workspace frontend run web
```

### Mobile Development

```bash
cd frontend

# iOS (requires macOS and Xcode)
npm run ios

# Android (requires Android Studio and emulator/device)
npm run android
```

## Building for Production

### Frontend (Web)

```bash
cd frontend
npm run build:web
```

Output will be in `frontend/web-build/`

### Backend

```bash
cd backend
npm run build
```

Compiled files will be in `backend/dist/`

## Docker Deployment

### Build Backend Image

```bash
npm run docker:backend
```

### Run Backend Container

```bash
docker run -d -p 4000:4000 \
  -e MYSQL_HOST=your-mysql-host \
  -e MYSQL_USER=youruser \
  -e MYSQL_PASSWORD=yourpass \
  -e MYSQL_DATABASE=leavesync \
  -e CALENDARIFIC_API_KEY=your_api_key \
  leavesync-backend
```

## Troubleshooting

### Backend won't start

**Error:** `Failed to connect to database`

**Solution:**
1. Verify MySQL is running: `mysql -u root -p`
2. Check credentials in `backend/.env`
3. Ensure database `leavesync` exists
4. Check if port 3306 is accessible

### Frontend can't connect to backend

**Error:** Network request failed

**Solution:**
1. Ensure backend is running on port 4000
2. Check `frontend/src/services/api.ts` has correct API_URL
3. For mobile development, use your machine's IP instead of localhost
4. Update `EXPO_PUBLIC_API_URL` environment variable

### TypeScript errors

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules
rm -rf frontend/node_modules
rm -rf backend/node_modules
npm install
```

### Expo build errors

**Solution:**
```bash
cd frontend
rm -rf .expo
rm -rf node_modules
npm install
expo start --clear
```

### MySQL connection issues on Windows

If using XAMPP:
1. Ensure MySQL port is 3306 (not 3307)
2. Check XAMPP MySQL is running
3. Verify no other MySQL services are conflicting

## API Testing

You can test the API using curl or Postman:

```bash
# Health check
curl http://localhost:4000/health

# Get all users
curl http://localhost:4000/api/users

# Get all leaves
curl http://localhost:4000/api/leaves

# Create leave
curl -X POST http://localhost:4000/api/leaves \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "start_date": "2024-12-25",
    "end_date": "2024-12-27",
    "notes": "Christmas holiday"
  }'

# Get public holidays for Selangor
curl http://localhost:4000/api/public-holidays/Selangor?year=2024
```

## Next Steps

1. Customize the app colors in `frontend/tailwind.config.js`
2. Add your company branding
3. Update Malaysian public holidays if needed
4. Configure Calendarific API for automatic holiday updates
5. Set up authentication (coming in future version)

## Support

For issues and questions:
- Check existing GitHub Issues
- Create a new issue with detailed description
- Include error logs and environment details
