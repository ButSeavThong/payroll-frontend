import { NextRequest, NextResponse } from 'next/server';

// Mock database
const mockAttendance = [
  {
    id: 'att-1',
    employeeId: 'emp-1',
    date: new Date().toISOString().split('T')[0],
    checkInTime: '09:00',
    checkOutTime: '17:00',
    totalHours: 8,
    overtimeHours: 0,
    status: 'COMPLETED',
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const path = request.nextUrl.pathname;

    if (path.includes('/my')) {
      return NextResponse.json(mockAttendance.slice(0, 1));
    }

    if (path.includes('/all')) {
      return NextResponse.json(mockAttendance);
    }

    return NextResponse.json(mockAttendance);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch attendance records' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname;

    if (path.includes('/check-in')) {
      const newRecord = {
        id: `att-${Math.random().toString(36).substr(2, 9)}`,
        employeeId: 'emp-2',
        date: new Date().toISOString().split('T')[0],
        checkInTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        status: 'CHECKED_IN',
      };
      mockAttendance.push(newRecord);
      return NextResponse.json(newRecord, { status: 201 });
    }

    if (path.includes('/check-out')) {
      const lastRecord = mockAttendance[mockAttendance.length - 1];
      if (lastRecord) {
        lastRecord.checkOutTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
        lastRecord.status = 'COMPLETED';
      }
      return NextResponse.json(lastRecord, { status: 200 });
    }

    return NextResponse.json(
      { error: 'Invalid attendance endpoint' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process attendance request' },
      { status: 500 }
    );
  }
}
