from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pyodbc
from datetime import datetime

app = FastAPI()

# CORS - allows React to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
                   "http://localhost:8080"],

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def connect_to_mssql():
    server = ''  
    database = ''
    username = ''
    password = ''

    try:
        conn = pyodbc.connect(
            f"DRIVER={{SQL Server Native Client 11.0}};SERVER={server};DATABASE={database};UID={username};PWD={password}"
        )
        return conn
    except pyodbc.Error as ex:
        print("Database connection error:", ex)
        return None

@app.get("/api/leaves")
def get_leaves():
    conn = None
    try:
        
        conn = connect_to_mssql()
        if conn is None:
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        cursor = conn.cursor()
        
        query = """
            
SELECT DISTINCT 
                p.[Employee_Name], 
                p.Designation, 
                p.From_Date as 'From_Date',
                p.[To_Date] as 'To_Date',
                p.[NDays],
				(select count(distinct  employee_name) from [192.168.10.115].[GSLX].[dbo].[GSLLeavePlannerHCL] p where  (Designation LIKE '%Manager%' OR Designation LIKE 'Chief%' or Designation like '%Team Leader - HR%') and active = 'Y'
) as 'Total_Managers',
CASE    
        WHEN p.Department = 'IT' THEN 'IT'
        WHEN p.Department = 'Sales' THEN 'Sales'
        WHEN p.Department LIKE 'Finance%' THEN 'Finance'
        WHEN p.Department = 'Human Resources' THEN 'HR'
        WHEN p.Department LIKE 'Operations%' THEN 'Operations'
        WHEN p.Department = 'General' THEN 'General'
        WHEN p.Department = 'Transport' THEN 'Transport'
        WHEN p.Department LIKE 'C&F%' THEN 'C&F'
        ELSE p.Department  
    END AS Department,
                CASE WHEN p.[Status] ='Approved' THEN 'Approved' ELSE 'Pending' END Status
            FROM [192.168.10.115].[GSLX].[dbo].[GSLLeavePlannerHCL] p,
            [ILS].[dbo].[GSL_UAE_CALENDAR] c
            WHERE (status LIKE 'Approved' OR status LIKE '%Pending%') 
                AND c.CalendarDate BETWEEN p.from_date AND p.to_date
--                AND p.from_date <= GETDATE()+61 
--               AND p.to_date >= GETDATE()-1
                AND (Designation LIKE '%Manager%' OR Designation LIKE 'Chief%' OR Designation LIKE '%Team Leader - HR%')
        
        """
        
        cursor.execute(query)
        
        
        if cursor.description is None:
            return []
        
        
        columns = [column[0] for column in cursor.description]
        results = []
        
        
        rows = cursor.fetchall()
        
        
        for row in rows:
            row_dict = dict(zip(columns, row))
            
            # CRITICAL: Convert datetime to string format for React
            if isinstance(row_dict.get('From_Date'), datetime):
                row_dict['From_Date'] = row_dict['From_Date'].strftime('%Y-%m-%d')
            if isinstance(row_dict.get('To_Date'), datetime):
                row_dict['To_Date'] = row_dict['To_Date'].strftime('%Y-%m-%d')
            
            results.append(row_dict)
        
        return results
        
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
        
    finally:
        # Always close the connection
        if conn:
            conn.close()


