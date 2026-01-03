# Authentication System Documentation

## Overview
This application now has a complete authentication system using **localStorage** to simulate user accounts and authentication without requiring a backend server.

## Features Implemented

### 1. **Sign Up (Registration)**
- **Intern Signup** (`intern_signup.html`)
  - Fields: Name, Email, Phone, Password, College, Qualification
  - Validates all inputs before registration
  - Prevents duplicate email registrations
  - Stores user data in localStorage
  - Redirects to login page after successful registration

- **Company Signup** (`company_signup.html`)
  - Fields: Company Name, Email, Phone, Password, Industry, Location
  - Same validation and storage mechanism as intern signup
  - User type is automatically set to "company"

### 2. **Login** (`login.html`)
- Validates email and password
- Requires user type selection (Intern or Company)
- Checks credentials against localStorage data
- Sets logged-in user session
- Redirects to appropriate dashboard based on user type:
  - Interns → `intern_dashboard.html`
  - Companies → `company_dashboard.html`

### 3. **Logout**
- Available on all dashboard and profile pages
- Clears logged-in user session from localStorage
- Redirects to login page
- Shows success message

### 4. **Forgot Password** (`forgot_password.html`)
- User enters registered email
- System checks if email exists in localStorage
- If found, stores email for password reset
- Redirects to reset password page

### 5. **Reset Password** (`reset_password.html`)
- Validates that user came from forgot password flow
- Shows password strength meter
- Requires password confirmation
- Updates password in localStorage
- Redirects to login page

### 6. **Page Protection**
- All dashboard and profile pages are protected
- Automatically redirects to login if not authenticated
- Validates user type (intern vs company)
- Redirects to correct dashboard if wrong user type

## File Structure

### Core Authentication Files
- **`auth.js`** - Main authentication module with all core functions
- **`login.js`** - Login page logic
- **`intern_signup.js`** - Intern registration logic
- **`company_signup.js`** - Company registration logic
- **`forgot_password.js`** - Forgot password logic
- **`reset_password.js`** - Password reset logic
- **`profile.js`** - User profile management

### Protected Pages
- `intern_dashboard.html` / `intern_dashboard.js`
- `company_dashboard.html` / `company_dashboard.js`
- `profile.html` / `profile.js`

## localStorage Structure

### Keys Used
- `internify_users` - Array of all registered users
- `internify_loggedInUser` - Currently logged-in user object
- `internify_resetEmail` - Email for password reset flow

### User Object Structure
```javascript
{
  id: "unique_timestamp",
  email: "user@example.com",
  password: "userpassword", // Note: In production, this should be hashed
  userType: "intern" | "company",
  createdAt: "ISO_timestamp",
  
  // Intern-specific fields
  name: "John Doe",
  phone: "1234567890",
  college: "University Name",
  qualification: "B.Tech",
  skills: "HTML, CSS, JavaScript",
  
  // Company-specific fields
  companyName: "Company Name",
  industry: "IT",
  location: "City, State"
}
```

## Auth Module Functions

### User Management
- `getAllUsers()` - Get all registered users
- `saveUsers(users)` - Save users to localStorage
- `emailExists(email)` - Check if email is already registered
- `registerUser(userData)` - Register a new user
- `findUserByEmail(email)` - Find user by email

### Authentication
- `login(email, password, userType)` - Login user
- `logout()` - Logout current user
- `getCurrentUser()` - Get currently logged-in user
- `isLoggedIn()` - Check if user is logged in
- `protectPage(requiredUserType)` - Protect page from unauthorized access

### Password Management
- `updatePassword(email, newPassword)` - Update user password

### Validation
- `isValidEmail(email)` - Validate email format
- `isValidPhone(phone)` - Validate 10-digit phone number

### UI Helpers
- `showMessage(message, type)` - Show toast notification

## How to Use

### For Testing

1. **Create a Test Account**
   - Go to `login.html`
   - Click "Sign Up"
   - Choose "Intern" or "Company"
   - Fill in the form and submit
   - You'll be redirected to login

2. **Login**
   - Enter your email and password
   - Select user type (Intern or Company)
   - Click "Login"
   - You'll be redirected to your dashboard

3. **Test Forgot Password**
   - Click "Forgot Password" on login page
   - Enter your registered email
   - Set a new password
   - Login with new password

4. **Test Logout**
   - Click "Logout" in the navigation
   - You'll be redirected to login page

### Sample Test Accounts

You can create these accounts for testing:

**Intern Account:**
- Name: John Doe
- Email: john@example.com
- Password: test123
- Phone: 1234567890
- College: Test University
- Qualification: B.Tech

**Company Account:**
- Company Name: Tech Corp
- Email: company@example.com
- Password: test123
- Phone: 9876543210
- Industry: IT
- Location: Mumbai, Maharashtra

## Security Notes

⚠️ **Important**: This is a frontend-only authentication system for demonstration purposes.

**Limitations:**
- Passwords are stored in plain text in localStorage
- No server-side validation
- Data can be manipulated through browser dev tools
- No protection against XSS or other attacks
- Not suitable for production use

**For Production:**
- Use a proper backend server
- Hash passwords (bcrypt, argon2, etc.)
- Use JWT or session-based authentication
- Implement HTTPS
- Add CSRF protection
- Use secure, httpOnly cookies
- Implement rate limiting
- Add email verification
- Use proper database instead of localStorage

## Customization

### Change Storage Keys
Edit the keys in `auth.js`:
```javascript
USERS_KEY: "internify_users",
LOGGED_IN_USER_KEY: "internify_loggedInUser",
RESET_EMAIL_KEY: "internify_resetEmail",
```

### Modify Validation Rules
Edit validation functions in `auth.js`:
- `isValidEmail()` - Email pattern
- `isValidPhone()` - Phone pattern
- Password length requirements in `registerUser()` and `updatePassword()`

### Customize Messages
Edit `showMessage()` calls in individual page scripts to change notification text.

## Troubleshooting

### Can't Login
- Check if you're selecting the correct user type
- Verify email and password are correct
- Check browser console for errors
- Clear localStorage and try creating a new account

### Page Redirects Immediately
- This is normal for protected pages when not logged in
- Login first, then access the page

### Lost Password
- Use "Forgot Password" feature
- Or clear localStorage and create a new account

### Clear All Data
Open browser console and run:
```javascript
localStorage.clear();
```

## Browser Compatibility

Works in all modern browsers that support:
- localStorage
- ES6 JavaScript
- DOM manipulation

Tested on:
- Chrome/Edge (Chromium)
- Firefox
- Safari

## Future Enhancements

Possible improvements:
- Remember me functionality
- Session timeout
- Password strength requirements
- Email verification simulation
- Two-factor authentication simulation
- User profile pictures
- Account deletion
- Export/import user data
