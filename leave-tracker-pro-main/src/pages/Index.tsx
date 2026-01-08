import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, format, isSameMonth, isToday, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


interface leaveData {
  Employee_Name: string;
  Designation: string;
  From_Date: string;
  To_Date: string;
  NDays: number;
  Total_Managers: number;
  Department: string;
  Status: string;
}

//here the SQL DATA WILL COME DYNAMICALLY
// Mock data matching database schema (only required columns)
// const leaveData = [
//   {
//     Employee_Name: "Govindarajan Lakshminarayanan",
//     Designation: "Manager C&F",
//     From_Date: "2025-11-24",
//     To_Date: "2025-12-05",
//     Status: "Pending",
//   },
//   {
//     Employee_Name: "Rajesh Kumar",
//     Designation: "Senior Developer",
//     From_Date: "2025-11-26",
//     To_Date: "2025-11-29",
//     Status: "Approved",
//   },
//   {
//     Employee_Name: "Priya Sharma",
//     Designation: "HR Manager",
//     From_Date: "2025-12-01",
//     To_Date: "2025-12-07",
//     Status: "Approved",
//   },
//   {
//     Employee_Name: "Amit Patel",
//     Designation: "Accountant",
//     From_Date: "2025-11-28",
//     To_Date: "2025-11-30",
//     Status: "Rejected",
//   },
// ];

const Index = () => {

    // NEW: State for API data
  const [leaveData, setleaveData] = useState<leaveData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // NEW: Fetch data from API
  useEffect(() => {
    const fetchleaveData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/leaves');
        
        if (!response.ok) {
          throw new Error('Failed to fetch leave data');
        }
        
        const data = await response.json();
        setleaveData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching leave data:', err);
        setError('Failed to load leave data. Make sure your Python backend is running.');
        setLoading(false);
      }
    };

    fetchleaveData();
  }, []);
 const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth(); // 0 = Jan, 11 = Dec


const availableMonths: Date[] = [];


if (currentMonth === 0) {

  availableMonths.push(new Date(currentYear - 1, 11, 1)); 
  
  availableMonths.push(new Date(currentYear, 0, 1)); // January
  
  availableMonths.push(new Date(currentYear, 1, 1)); // February
} else {
  
  for (let month = 0; month <= currentMonth; month++) {
    availableMonths.push(new Date(currentYear, month, 1));
  }
 
  availableMonths.push(addMonths(today, 1));
}


const [currentMonthIndex, setCurrentMonthIndex] = useState(availableMonths.length - 2);
const currentDate = availableMonths[currentMonthIndex];

const totalEmployeesOnLeave = new Set(
  leaveData
    .filter(leave => {
      const today = format(new Date(), "yyyy-MM-dd");
      return today >= leave.From_Date && today <= leave.To_Date;
    })
    .map(l => l.Employee_Name)
).size;
  const pendingApprovals = leaveData.filter(l => l.Status === "Pending").length;
  const totalManagers: number = leaveData.length > 0 ? leaveData[0].Total_Managers : 0;
  const managersOnLeaveThisWeek = new Set(
  leaveData.filter(leave => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // End of week (Saturday)
    
    const weekStartStr = format(weekStart, "yyyy-MM-dd");
    const weekEndStr = format(weekEnd, "yyyy-MM-dd");
    
    
    return leave.From_Date <= weekEndStr && leave.To_Date >= weekStartStr;
  })
  .map(l => l.Employee_Name)
).size;

  const getEmployeesOnLeave = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return leaveData.filter(leave => {
      const fromDate = leave.From_Date;
      const toDate = leave.To_Date;
      return dateStr >= fromDate && dateStr <= toDate;
    });
  };

  const getDepartmentColor = (department: string) => {
  switch (department) {
    case "IT":
      return "bg-blue-100 text-blue-900 border-blue-200";
    case "Sales":
      return "bg-green-100 text-green-900 border-green-200";
    case "Finance":
      return "bg-purple-100 text-purple-900 border-purple-200";
    case "HR":
      return "bg-pink-100 text-pink-900 border-pink-200";
    case "Operations":
      return "bg-orange-100 text-orange-900 border-orange-200";
    case "General":
      return "bg-gray-100 text-gray-900 border-gray-200";
    case "Transport":
      return "bg-cyan-100 text-cyan-900 border-cyan-200";
    case "C&F":
      return "bg-yellow-100 text-yellow-900 border-yellow-200";
    default:
      return "bg-slate-100 text-slate-900 border-slate-200";
  }
};
/* 
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-success/20 text-success-foreground border-success/30";
      case "pending":
        return "bg-warning/20 text-warning-foreground border-warning/30";
      case "rejected":
        return "bg-destructive/20 text-destructive-foreground border-destructive/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };
*/

  const renderCalendar = (monthDate: Date) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    const startDayOfWeek = monthStart.getDay();
    const emptyCells = Array(startDayOfWeek).fill(null);

    return (
      <Card>
        <CardHeader>
  <div className="flex items-center justify-center gap-3">
    <Button
      variant="outline"
      size="icon"
      onClick={() => setCurrentMonthIndex(Math.max(0, currentMonthIndex - 1))}
      disabled={currentMonthIndex === 0}
    >
      <ChevronLeft className="h-4 w-4" />
    </Button>
    
    <CardTitle className="text-xl font-bold min-w-[200px] text-center"> 
      {format(monthDate, "MMMM yyyy")}
    </CardTitle>
    
    <Button
      variant="outline"
      size="icon"
      onClick={() => setCurrentMonthIndex(Math.min(availableMonths.length - 1, currentMonthIndex + 1))}
      disabled={currentMonthIndex === availableMonths.length - 1}
    >
      <ChevronRight className="h-4 w-4" />
    </Button>
  </div>
</CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="text-center text-xs font-semibold text-muted-foreground p-2">
                {day}
              </div>
            ))}
            {emptyCells.map((_, idx) => (
              <div key={`empty-${idx}`} className="min-h-[100px] p-1" />
            ))}
            {days.map(day => {
              const employees = getEmployeesOnLeave(day);
              const isCurrentMonth = isSameMonth(day, monthDate);
              const isTodayDate = isToday(day);
              const maxDisplay = 2;
              const displayEmployees = employees.slice(0, maxDisplay);
              const remainingCount = employees.length - maxDisplay;
              
              return (
                <TooltipProvider key={day.toISOString()}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`min-h-[100px] p-1 border rounded-lg transition-all hover:shadow-md cursor-pointer ${
                          isTodayDate ? "border-primary bg-primary/5" : "border-border"
                        } ${!isCurrentMonth ? "opacity-50" : ""}`}
                      >
                        <div className={`text-xs font-semibold mb-1 ${isTodayDate ? "text-primary" : "text-foreground"}`}>
                          {format(day, "d")}
                        </div>
                        <div className="space-y-1">
                          {displayEmployees.map((employee, idx) => (
                            <div
                              key={idx}
                              className={`text-xs p-1 rounded border ${getDepartmentColor(employee.Department)} animate-fade-in`}
                            >
                              <div className="truncate font-medium">
                                {employee.Employee_Name.split(" ")[0]}
                              </div>
                            </div>
                          ))}
                          {remainingCount > 0 && (
                            <div className="text-xs p-1 rounded bg-muted text-muted-foreground border border-border font-semibold text-center animate-fade-in">
                              +{remainingCount} more
                            </div>
                          )}
                        </div>
                      </div>
                    </TooltipTrigger>
                    {employees.length > 0 && (
                      <TooltipContent side="right" className="max-w-xs max-h-96 overflow-y-auto">
                        <div className="space-y-2">
                          <div className="font-semibold text-sm border-b pb-1">
                            {format(day, "MMM d, yyyy")} - {employees.length} employee{employees.length > 1 ? "s" : ""}
                          </div>
                          {employees.map((employee, idx) => (
                            <div key={idx} className="text-xs space-y-0.5">
                              <div className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-1 ${getDepartmentColor(employee.Department)}`}>
                                {employee.Department}
                              </div>
                              <div className="font-medium">{employee.Employee_Name}</div>
                              <div className="text-muted-foreground">
                                {employee.Designation}
                              </div>
                              
                              <div className="text-muted-foreground text-[10px]">
                                {employee.From_Date} to {employee.To_Date}
                              </div>
                              <div className = "text-muted-foreground text-[10px] font-semibold">
                                  Total: {employee.NDays} day{employee.NDays !== 1 ? 's' : ''}
                              </div>
                            
                            </div>
                          ))}
                        </div>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen p-6" style={{backgroundColor: '#d3e5f5ff'}}>
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
        <div className="flex items-center gap-4">
          <img 
            src="/logo.png" 
            alt="Company Logo" 
            className="h-16 w-auto"
          />
          <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Management Leave Tracker</h1>
          <p className="text-muted-foreground">Track GSL Manager's leave requests</p>
        </div>
        </div>
      </div>

        {/* Stats Cards */}
        

        {/* Legend */}
<Card>
  <CardContent className="py-3">
    <div className="flex flex-wrap gap-4 items-center justify-center">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-blue-100 border border-blue-200" />
        <span className="text-sm">IT</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-green-100 border border-green-200" />
        <span className="text-sm">Sales</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-purple-100 border border-purple-200" />
        <span className="text-sm">Finance</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-pink-100 border border-pink-200" />
        <span className="text-sm">HR</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-orange-100 border border-orange-200" />
        <span className="text-sm">Operations</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-gray-100 border border-gray-200" />
        <span className="text-sm">General</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-cyan-100 border border-cyan-200" />
        <span className="text-sm">Transport</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-200" />
        <span className="text-sm">C&F</span>
      </div>
    </div>
  </CardContent>
</Card>

        {/* Month Navigation */}
{/*       <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentMonthIndex(Math.max(0, currentMonthIndex - 1))}
                disabled={currentMonthIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-lg font-semibold min-w-[200px] text-center">
                {format(currentDate, "MMMM yyyy")}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentMonthIndex(Math.min(availableMonths.length - 1, currentMonthIndex + 1))}
                disabled={currentMonthIndex === availableMonths.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
*/}
        {/* Calendar View */}
        <div className="animate-fade-in">
          {renderCalendar(currentDate)}
        </div>
      </div>
    </div>
  );
};

export default Index;