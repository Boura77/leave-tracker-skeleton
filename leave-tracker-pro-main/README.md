# Employee Leave Tracker

A modern web application for tracking and managing employee leave requests with an interactive calendar view.

## Project Overview

This full-stack application helps HR and management teams visualize employee leave schedules with an intuitive calendar interface. The system pulls real-time data from an MSSQL database and displays it in a responsive, user-friendly format.

## Technologies Used

### Frontend
- **React** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful component library
- **date-fns** - Date manipulation library

### Backend
- **FastAPI** - Modern Python web framework
- **pyodbc** - MSSQL database connector
- **Uvicorn** - ASGI server

### Database
- **Microsoft SQL Server** - Enterprise database system

## Prerequisites

Before running this project, make sure you have:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Python** (v3.10 or higher) - [Download here](https://python.org/)
- **MSSQL Server** - Access to your company's database

## Installation & Setup

### Frontend Setup
```sh
# Step 1: Navigate to the frontend directory
cd leave-planner-pro-main

# Step 2: Install dependencies
npm install

# Step 3: Start the development server
npm run dev
```

The frontend will run on `http://localhost:8080` (or the port shown in terminal)

### Backend Setup
```sh
# Step 1: Navigate to the backend directory
cd leave-planner-backend

# Step 2: Create a virtual environment (optional but recommended)
python -m venv .venv
.venv\Scripts\Activate.ps1  # On Windows
# source .venv/bin/activate  # On Mac/Linux

# Step 3: Install Python dependencies
pip install fastapi uvicorn pyodbc

# Step 4: Update database credentials in main.py
# Edit the connect_to_mssql() function with your database details

# Step 5: Start the backend server
uvicorn main:app --reload
```

The backend API will run on `http://localhost:8000`

## Configuration

### Database Connection

Update the database credentials in `leave-planner-backend/main.py`:
```python
def connect_to_mssql():
    server = 'YOUR_SERVER_IP'
    database = 'YOUR_DATABASE_NAME'
    username = 'YOUR_USERNAME'
    password = 'YOUR_PASSWORD'
    # ... rest of the connection code
```

### CORS Settings

If deploying to production, update the allowed origins in `main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",  # Development
        "https://your-production-domain.com"  # Production
    ],
    # ... rest of middleware config
)
```

## Project Structure
```
leave-planner-pro-main/          # Frontend
├── src/
│   ├── components/              # Reusable UI components
│   ├── pages/
│   │   └── Index.tsx           # Main leave planner page
│   ├── App.tsx                 # Root component
│   └── main.tsx                # Entry point
├── public/                     # Static assets (logo, favicon)
└── package.json

leave-planner-backend/           # Backend
├── main.py                     # FastAPI application
└── requirements.txt            # Python dependencies (create if needed)
```

## API Endpoints

### GET `/api/leaves`
Fetches all employee leave records from the database.

**Response:**
```json
[
  {
    "Employee_Name": "John Doe",
    "Designation": "Manager",
    "From_Date": "2025-12-01",
    "To_Date": "2025-12-05",
    "NDays": 5,
    "Status": "Approved"
  }
]
```

## Features

- 📅 **Interactive Calendar View** - Visual representation of employee leaves
- 🔄 **Real-time Data** - Fetches live data from MSSQL database
- 📊 **Dashboard Stats** - Quick overview of employees on leave, pending approvals, and total leave days
- 🎨 **Responsive Design** - Works on desktop and mobile devices
- 🔍 **Tooltip Details** - Hover over calendar days for detailed leave information
- 🎯 **Status Indicators** - Color-coded leave statuses (Approved, Pending, Rejected)

## Deployment

### Frontend (IIS or Cloud)
1. Build the production version:
```sh
   npm run build
```
2. Deploy the `dist` folder to your web server

### Backend (Windows Service or Cloud)
1. Set up FastAPI as a Windows Service or deploy to cloud platform
2. Update CORS settings to allow production domain
3. Ensure database connectivity from production server

## Troubleshooting

**Issue: No data appearing in frontend**
- Check if both servers are running (frontend and backend)
- Verify CORS settings match your frontend URL
- Check browser console (F12) for errors
- Test API directly: `http://localhost:8000/api/leaves`

**Issue: Database connection failed**
- Verify database credentials in `main.py`
- Ensure SQL Server allows remote connections
- Check if ODBC Driver is installed

## Development Team

Developed by Nikhil

## License

Internal company use only

## Support

For issues or questions, contact your IT department.
