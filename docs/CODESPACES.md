# Using LeaveSync with GitHub Codespaces

This guide explains how to develop LeaveSync using GitHub Codespaces.

## Quick Start

1. Click the "Code" button on the GitHub repository
2. Select "Codespaces" tab
3. Click "Create codespace on main"
4. Wait for the container to build and initialize

The devcontainer will automatically:
- Install all dependencies
- Start MySQL database
- Run database migrations
- Seed sample data
- Start backend API (port 4000)
- Start Expo web server (port 8080/19006)

## Accessing the Application

- **Frontend**: Click on the "Ports" tab and open the forwarded port 8080 or 19006
- **Backend API**: Available at `http://localhost:4000`
- **Health Check**: `http://localhost:4000/health`

## Environment Variables

The devcontainer automatically configures these environment variables:

```
MYSQL_HOST=mysql
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=rootpassword
MYSQL_DATABASE=leavesync
PORT=4000
```

## Manual Commands

If you need to manually run commands:

```bash
# Install dependencies
npm install

# Seed database
npm run seed:backend

# Start development servers
npm run dev

# Start only backend
npm --workspace backend run dev

# Start only frontend
npm --workspace frontend run web
```

## Database Access

To access the MySQL database:

```bash
mysql -h mysql -u root -prootpassword leavesync
```

## Troubleshooting

### MySQL Connection Issues

If the backend can't connect to MySQL:
1. Check if MySQL container is running
2. Verify environment variables
3. Try restarting the devcontainer

### Port Forwarding Issues

If you can't access the application:
1. Check the "Ports" tab in VS Code
2. Ensure ports 4000, 8080, and 19006 are forwarded
3. Try changing port visibility to "Public"

### Reset Database

To reset and reseed the database:

```bash
cd backend
npm run seed
```
