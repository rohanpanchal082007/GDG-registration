# 🚀 GDG AITR Event Registration System

A complete event registration system built for GDG AITR with a user-friendly registration form and admin panel. Perfect for beginners learning web development with HTML, CSS, JavaScript, and Python Flask.



## ✨ Features

### 🎯 User Registration
- **Responsive Registration Form** with validation
- **Real-time form validation** (Name, Email, Phone, Year, Branch)
- **Success confirmation** after registration
- **Duplicate email prevention**
- **Mobile-friendly design**

### 👨‍💼 Admin Panel
- **View all registrations** in a beautiful table
- **Real-time statistics** (total registrations, branch-wise, year-wise)
- **Export data to CSV** with one click
- **Refresh data** without page reload
- **Admin-only access**

### 🛠️ Technical Features
- **Python Flask backend** with RESTful API
- **JSON file database** (no complex database setup needed)
- **Responsive design** works on all devices
- **Clean, beginner-friendly code**

## 📁 Project Structure

```
gdg-registration/
├── static/
│   ├── css/
│   │   ├── style.css          # Main registration page styles
│   │   └── admin.css          # Admin panel styles
│   ├── js/
│   │   ├── script.js          # Registration page JavaScript
│   │   └── admin.js           # Admin panel JavaScript
│   └── images/
│       ├── logo.png           # GDG AITR Logo
│       └── background.png     # Background image
├── templates/
│   ├── index.html             # Registration page
│   └── admin.html             # Admin panel
├── app.py                     # Flask backend server
├── requirements.txt           # Python dependencies
├── registrations.json         # Data storage (auto-created)
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.6 or higher
- pip (Python package installer)

### Installation Steps

1. **Clone or download the project**
   ```bash
   # If using git
   git clone <repository-url>
   cd gdg-registration
   
   # Or simply download and extract the ZIP file
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Add your images**
   - Place your `logo.png` in `static/images/`
   - Place your `background.png` in `static/images/`

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Access the system**
   - 🌐 **Registration Page:** http://localhost:5000
   - ⚙️ **Admin Panel:** http://localhost:5000/admin

## 📖 How to Use

### For Participants (Registration)
1. Visit http://localhost:5000
2. Fill in the registration form:
   - **Full Name** (required)
   - **Email** (required, unique)
   - **Phone** (required, 10 digits)
   - **Academic Year** (required)
   - **Branch** (required)
3. Click "Register"
4. See success confirmation message

### For Administrators
1. Visit http://localhost:5000/admin
2. View all registrations in the table
3. Check statistics at the top
4. Click "Refresh Data" to get latest registrations
5. Click "Download CSV" to export all data

## 🛠️ API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Registration page |
| `GET` | `/admin` | Admin panel |
| `POST` | `/register` | Submit registration |
| `GET` | `/api/registrations` | Get all registrations (JSON) |
| `GET` | `/download-csv` | Download registrations as CSV |



## 🔒 Data Management

### Data Storage
- Registrations are stored in `registrations.json`
- Automatic backup on each registration
- Prevents duplicate email registrations

### Data Export
- Export to CSV with timestamp
- Includes all registration fields
- Ready for Excel/Google Sheets
