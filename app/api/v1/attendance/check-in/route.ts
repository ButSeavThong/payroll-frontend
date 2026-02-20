import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const newRecord = {
      id: `att-${Math.random().toString(36).substr(2, 9)}`,
      employeeId: 'emp-2',
      date: new Date().toISOString().split('T')[0],
      checkInTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      status: 'CHECKED_IN',
    };
    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check in' },
      { status: 500 }
    );
  }
}
