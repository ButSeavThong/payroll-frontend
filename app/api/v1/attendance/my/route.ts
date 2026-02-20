import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const mockAttendance = [
      {
        id: 'att-1',
        employeeId: 'emp-2',
        date: new Date().toISOString().split('T')[0],
        checkInTime: '09:00',
        checkOutTime: '17:00',
        totalHours: 8,
        overtimeHours: 0,
        status: 'COMPLETED',
      },
      {
        id: 'att-2',
        employeeId: 'emp-2',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        checkInTime: '08:45',
        checkOutTime: '17:30',
        totalHours: 8.75,
        overtimeHours: 0.75,
        status: 'COMPLETED',
      },
    ];
    return NextResponse.json(mockAttendance);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch attendance records' },
      { status: 500 }
    );
  }
}
