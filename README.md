# LeaveSync 🗓️

> Beautiful, modern staff leave and public holiday calendar for Malaysian companies

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![React Native](https://img.shields.io/badge/React_Native-0.73-blue.svg)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org)

LeaveSync is a **cross-platform mobile and web application** for managing staff leave and Malaysian public holidays. Built with React Native + Expo for the frontend and Node.js + Express for the backend, it provides an intuitive, TimeTree-inspired interface with automatic connected leave detection.

![LeaveSync Banner](https://via.placeholder.com/800x200/3b82f6/ffffff?text=LeaveSync+-+Staff+Leave+Calendar)

## ✨ Key Features

### 🎨 Beautiful UI
- **Clean, modern design** using Tailwind CSS (NativeWind)
- **Mobile-first** responsive interface
- **Color-coded calendar** for easy visualization
- **Smooth animations** and intuitive interactions

### 📅 Smart Calendar
- **Shared calendar view** - All staff can view leaves and holidays
- **Month/Week/Day views** - Swipeable calendar navigation
- **Color-coded events**:
  - 🟢 Green: Normal leave
  - 🟠 Orange: Connected leave (adjacent to weekends/holidays)
  - 🔵 Blue: Public holidays
- **Interactive modals** - Tap any date to see detailed information

### 🤖 Intelligent Features
- **Automatic connected leave detection** - Identifies leave adjacent to weekends or public holidays
- **State-specific weekends** - Handles different weekend patterns (Fri-Sat vs Sat-Sun)
- **Malaysian public holidays** - Integrated with Calendarific API
- **Holiday caching** - Reduces API calls and improves performance

### 🔍 Advanced Filtering
- Filter by **staff member**
- Filter by **department**
- Filter by **leave type** (Normal/Connected)
- Filter by **state** (16 Malaysian states)

### 🚀 Easy Leave Management
- Simple leave submission form
- Date validation
- Automatic leave type detection
- Immediate calendar updates

## 🏗️ Architecture

```
LeaveSync/
├── frontend/          # React Native + Expo + NativeWind
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── screens/     # App screens
│   │   ├── services/    # API integration
│   │   └── types/       # TypeScript definitions
│   └── package.json
│
├── backend/           # Node.js + Express + MySQL
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── services/    # Business logic
│   │   ├── routes/      # API routes
│   │   └── config/      # Configuration
│   └── package.json
│
├── docs/              # Documentation
└── package.json       # Root workspace
```

## 📦 Tech Stack

### Frontend
- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and tooling
- **NativeWind** - Tailwind CSS for React Native
- **React Navigation** - Routing and navigation
- **Axios** - HTTP client
- **date-fns** - Date manipulation
- **TypeScript** - Type safety

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MySQL** - Relational database
- **TypeScript** - Type safety
- **Axios** - API requests (Calendarific)

### DevOps
- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **GitHub Pages** - Frontend hosting
- **GitHub Container Registry** - Docker images

## 🚀 Quick Start

### Option 1: GitHub Codespaces (Fastest)

1. Click the **"Code"** button on GitHub
2. Select **"Codespaces"** tab
3. Click **"Create codespace on main"**
4. Wait for automatic setup (2-3 minutes)
5. The app launches automatically! 🎉

### Option 2: Local Development

**Prerequisites:** Node.js 18+, MySQL 8.0+

```bash
# 1. Clone the repository
git clone https://github.com/mnthaqif/LeaveSync.git
cd LeaveSync

# 2. Create MySQL database
mysql -u root -p
CREATE DATABASE leavesync CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit

# 3. Run database schema
mysql -u root -p leavesync < backend/schema.sql

# 4. Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your MySQL credentials

# 5. Install dependencies and seed data
npm install
npm run seed:backend

# 6. Start development servers
npm run dev
```

**Access the app:**
- Frontend: http://localhost:8080 or http://localhost:19006
- Backend API: http://localhost:4000

📖 **Detailed setup:** See [QUICKSTART.md](QUICKSTART.md) or [docs/SETUP.md](docs/SETUP.md)

## 📱 Screenshots

| Calendar View | Leave Details | Add Leave |
|--------------|---------------|-----------|
| ![Calendar](https://via.placeholder.com/250x500/ffffff/3b82f6?text=Calendar+View) | ![Details](https://via.placeholder.com/250x500/ffffff/10b981?text=Leave+Details) | ![Add](https://via.placeholder.com/250x500/ffffff/f59e0b?text=Add+Leave) |

## 🎯 Use Cases

- **Small to Medium Companies** - Track team leave schedules
- **Remote Teams** - Coordinate time off across locations
- **Malaysian Businesses** - Built-in state-specific holidays
- **HR Departments** - Monitor leave patterns and trends
- **Project Managers** - Plan around team availability

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [QUICKSTART.md](QUICKSTART.md) | Get started in 5 minutes |
| [docs/SETUP.md](docs/SETUP.md) | Detailed setup instructions |
| [docs/API.md](docs/API.md) | API endpoint documentation |
| [docs/FEATURES.md](docs/FEATURES.md) | Complete feature list |
| [docs/CODESPACES.md](docs/CODESPACES.md) | GitHub Codespaces guide |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute |

## 🚢 Deployment

### Frontend (GitHub Pages)

The workflow automatically builds and deploys the Expo web app to GitHub Pages:

1. Push to `main` branch
2. GitHub Actions builds the web app
3. Deploys to GitHub Pages
4. Set `FRONTEND_BACKEND_URL` secret with your API URL

### Backend (Docker Container)

Build and deploy the backend as a Docker container:

```bash
# Build locally
npm run docker:backend

# Or use the pre-built image
docker pull ghcr.io/mnthaqif/leavesync-backend:latest

# Run the container
docker run -d -p 4000:4000 \
  -e MYSQL_HOST=your-mysql-host \
  -e MYSQL_USER=youruser \
  -e MYSQL_PASSWORD=yourpass \
  -e MYSQL_DATABASE=leavesync \
  -e CALENDARIFIC_API_KEY=your_api_key \
  ghcr.io/mnthaqif/leavesync-backend:latest
```

**Deployment Options:**
- Railway
- Render
- Fly.io
- DigitalOcean
- AWS ECS
- Any Docker-compatible platform

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both backend and frontend in development mode |
| `npm run seed:backend` | Seed database with sample data |
| `npm run build:frontend` | Build Expo web app for production |
| `npm run build:backend` | Compile TypeScript backend |
| `npm run docker:backend` | Build backend Docker image |
| `npm --workspace backend run dev` | Run backend only |
| `npm --workspace frontend run web` | Run frontend only |

## 🧠 Connected Leave Detection

LeaveSync automatically detects "connected leave" - leave taken adjacent to weekends or public holidays:

**Detection Rules:**
- Leave is "Connected" if the day **before** start date OR day **after** end date is:
  - A weekend (state-specific)
  - A public holiday

**State-Specific Weekends:**
- **Most states**: Saturday-Sunday
- **Johor, Kedah, Kelantan, Terengganu**: Friday-Saturday

This helps identify staff who extend holidays to create long weekends.

## 🗺️ Roadmap

### Phase 2 (Next)
- [ ] User authentication and authorization
- [ ] Role-based access control
- [ ] Leave approval workflow
- [ ] Push notifications
- [ ] School holidays integration

### Phase 3
- [ ] Dashboard with analytics
  - [ ] Leave heatmap
  - [ ] Peak leave days
  - [ ] Connected leave statistics
- [ ] Export to PDF/Excel
- [ ] Leave balance tracking

### Phase 4
- [ ] Mobile app stores (iOS + Android)
- [ ] Offline mode support
- [ ] Calendar sync (Google/Outlook)
- [ ] Multi-language support
- [ ] Dark mode theme

## 🔒 Security Features

LeaveSync implements several security measures:

- **Rate Limiting**: Prevents API abuse with configurable limits
  - 100 requests/15min for read operations
  - 20 requests/15min for write operations
  - 10 requests/hour for sensitive operations
- **Parameterized Queries**: Prevents SQL injection attacks
- **CORS Configuration**: Controls cross-origin access
- **Input Validation**: Validates all user inputs
- **Environment Variables**: Sensitive data stored securely

**Future Security Enhancements:**
- JWT authentication
- Password hashing (bcrypt)
- HTTPS enforcement
- XSS protection
- CSRF tokens

## ⚙️ Environment Variables

### Backend (.env)
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=leavesync
PORT=4000
CALENDARIFIC_API_KEY=your_api_key  # Optional
```

### Frontend
```env
EXPO_PUBLIC_API_URL=http://localhost:4000  # Auto-configured for dev
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Ways to contribute:**
- 🐛 Report bugs
- 💡 Suggest features
- 📝 Improve documentation
- 🔧 Submit pull requests
- ⭐ Star the repository

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Inspired by** [TimeTree](https://timetreeapp.com/) - for the shared calendar concept
- **Calendarific API** - for Malaysian public holiday data
- **React Native Community** - for excellent libraries and tools
- **Tailwind CSS** - for beautiful utility-first styling

## 💬 Support

- 📧 **Issues**: [GitHub Issues](https://github.com/mnthaqif/LeaveSync/issues)
- 💭 **Discussions**: [GitHub Discussions](https://github.com/mnthaqif/LeaveSync/discussions)
- 📖 **Docs**: [Documentation](docs/)

## ⭐ Show Your Support

If you find LeaveSync useful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting features
- 🔄 Sharing with others
- 🤝 Contributing code

---

**Made with ❤️ for Malaysian companies**

Built with React Native, Node.js, and modern web technologies.
