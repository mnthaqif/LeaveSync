# LeaveSync Quick Start Guide

Get LeaveSync up and running in 5 minutes!

## The Fastest Way: GitHub Codespaces

1. Click **"Code"** button on GitHub
2. Select **"Codespaces"** tab
3. Click **"Create codespace on main"**
4. Wait 2-3 minutes for automatic setup
5. The app will auto-start!

**That's it!** The frontend opens automatically in your browser. 🎉

---

## Local Development (5 Minutes)

### Prerequisites Check

```bash
# Check Node.js (need 18+)
node --version

# Check MySQL (need 8.0+)
mysql --version
```

### Setup Steps

```bash
# 1. Clone & Enter
git clone https://github.com/mnthaqif/LeaveSync.git
cd LeaveSync

# 2. Create Database
mysql -u root -p
CREATE DATABASE leavesync CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit

# 3. Run Schema
mysql -u root -p leavesync < backend/schema.sql

# 4. Configure Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your MySQL password

# 5. Install & Seed
npm install
npm run seed:backend

# 6. Start Everything
npm run dev
```

### Access App

- **Frontend**: http://localhost:8080 or http://localhost:19006
- **Backend**: http://localhost:4000

---

## What You Get

✅ Beautiful mobile-first calendar UI  
✅ 8 sample staff members  
✅ Sample leave records  
✅ Malaysian public holidays (2024-2025)  
✅ Connected leave detection  
✅ Smart filtering system  

---

## First Things to Try

1. **View Calendar** - See color-coded leaves and holidays
2. **Click a Date** - View detailed leave information
3. **Add Leave** - Test the leave submission form
4. **Apply Filters** - Filter by staff, department, or leave type
5. **Check API** - Visit http://localhost:4000/health

---

## Common Issues

### MySQL Connection Error
```bash
# Check MySQL is running
mysql -u root -p

# Verify credentials in backend/.env
nano backend/.env
```

### Port Already in Use
```bash
# Change port in backend/.env
PORT=4001

# Or kill existing process
lsof -ti:4000 | xargs kill
```

### Dependencies Error
```bash
# Clean install
rm -rf node_modules */node_modules
npm install
```

---

## Next Steps

📖 Read [SETUP.md](docs/SETUP.md) for detailed guide  
📖 Check [API.md](docs/API.md) for API documentation  
📖 See [FEATURES.md](docs/FEATURES.md) for feature list  
🚀 Deploy using [deploy.yml](.github/workflows/deploy.yml)  

---

## Need Help?

- 📧 Create an issue on GitHub
- 💬 Check existing issues for solutions
- 📚 Read the comprehensive documentation

---

**Enjoy using LeaveSync! 🎊**
