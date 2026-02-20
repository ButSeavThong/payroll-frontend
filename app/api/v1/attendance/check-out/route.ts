import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const checkOutRecord = {
      id: `att-${Math.random().toString(36).substr(2, 9)}`,
      employeeId: 'emp-2',
      date: new Date().toISOString().split('T')[0],
      checkInTime: '09:00',
      checkOutTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      totalHours: 8,
      overtimeHours: 0,
      status: 'COMPLETED',
    };
    return NextResponse.json(checkOutRecord, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check out' },
      { status: 500 }
    );
  }
}
