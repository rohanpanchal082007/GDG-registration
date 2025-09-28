# GDG AITR Event Registration System

A Flask-based web application for managing event registrations for Google Developer Groups (GDG) AITR chapter.

## Features

- **User Registration**: Simple and intuitive registration form for events
- **Admin Authentication**: Secure login system for administrators
- **Admin Dashboard**: View all registrations with statistics
- **Data Export**: Download registration data as CSV
- **Responsive Design**: Works on desktop and mobile devices
- **Duplicate Prevention**: Prevents duplicate email registrations

## Tech Stack

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, JavaScript
- **Data Storage**: JSON file-based storage
- **Authentication**: Flask sessions

## Installation & Setup

### Prerequisites
- Python 3.7 or higher
- pip (Python package installer)

### Installation Steps

1. **Clone or download the project**
   ```bash
   cd gdg-registration
   ```

2. **Install required dependencies**
   ```bash
   pip install flask
   ```

3. **Run the application**
   ```bash
   python app.py
   ```

4. **Access the application**
   - Registration Form: http://localhost:5000
   - Admin Login: http://localhost:5000/login

## Admin Access

**Default Admin Credentials:**
- **Email**: `Admin@gdg`
- **Password**: `Gdg@2025`

> **Security Note**: Change these credentials in production by modifying the `ADMIN_EMAIL` and `ADMIN_PASSWORD` variables in `app.py`

## Project Structure

```
gdg-registration/
├── app.py                 # Main Flask application
├── registrations.json     # Data storage (auto-created)
├── seed.js               # Sample data generator
├── README.md             # This file
├── templates/
│   ├── index.html        # Registration form
│   ├── admin.html        # Admin dashboard
│   └── login.html        # Admin login page
└── static/
    ├── css/
    │   ├── style.css     # Main stylesheet
    │   └── admin.css     # Admin panel styles
    ├── js/
    │   ├── script.js     # Registration form logic
    │   └── admin.js      # Admin panel functionality
    └── images/
        ├── logo.png.png  # GDG logo
        └── background.png.png # Background image
```

## Usage

### For Event Attendees
1. Visit the registration page
2. Fill in all required information:
   - Full Name
   - Email Address
   - Phone Number
   - Academic Year
   - Branch/Department
3. Submit the form
4. Receive confirmation message

### For Administrators
1. Go to `/login` or click "Admin Login" on the main page
2. Enter admin credentials
3. View registration statistics and data
4. Download CSV reports
5. Refresh data as needed
6. Logout when done

## API Endpoints

- `GET /` - Registration form
- `POST /register` - Submit registration
- `GET /login` - Admin login page
- `POST /login` - Process admin login
- `GET /admin` - Admin dashboard (protected)
- `GET /api/registrations` - Get all registrations (protected)
- `GET /download-csv` - Download CSV export (protected)
- `GET /logout` - Admin logout

## Data Storage

Registration data is stored in `registrations.json` with the following structure:

```json
[
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "year": "3",
    "branch": "CSE",
    "timestamp": "2025-01-27T10:30:00.000000"
  }
]
```

## Security Features

- **Session-based Authentication**: Secure admin sessions
- **Input Validation**: Server-side validation for all form inputs
- **Duplicate Prevention**: Email-based duplicate registration prevention
- **Protected Routes**: Admin endpoints require authentication
- **CSRF Protection**: Form-based CSRF protection

## Customization

### Changing Admin Credentials
Edit the following lines in `app.py`:
```python
ADMIN_EMAIL = 'your-admin@email.com'
ADMIN_PASSWORD = 'your-secure-password'
```

### Modifying Form Fields
1. Update the HTML form in `templates/index.html`
2. Update validation logic in `static/js/script.js`
3. Update server-side validation in `app.py`

### Styling Changes
- Main styles: `static/css/style.css`
- Admin styles: `static/css/admin.css`

## Production Deployment

### Security Considerations
1. **Change the secret key** in `app.py`:
   ```python
   app.secret_key = 'your-production-secret-key'
   ```

2. **Update admin credentials** to secure values

3. **Disable debug mode**:
   ```python
   app.run(debug=False, host='127.0.0.1', port=5000)
   ```

4. **Use a proper database** instead of JSON files for production

5. **Implement HTTPS** for secure data transmission

### Environment Variables
Consider using environment variables for sensitive configuration:
```python
import os
app.secret_key = os.environ.get('SECRET_KEY', 'fallback-key')
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'Admin@gdg')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'Gdg@2025')
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Change the port in `app.py`: `app.run(port=5001)`

2. **Permission denied on file creation**
   - Ensure write permissions in the project directory

3. **Module not found errors**
   - Install Flask: `pip install flask`

4. **Admin login not working**
   - Verify credentials match exactly (case-sensitive)
   - Check browser console for JavaScript errors

### Logs and Debugging
- Enable debug mode for development: `debug=True`
- Check console output for error messages
- Verify file permissions for `registrations.json`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For support or questions:
- Create an issue in the repository
- Contact the GDG AITR team
- Check the troubleshooting section above

---

**GDG AITR Event Registration System v1.0**  
Built with ❤️ for the developer community