import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const mockPayroll = [
      {
        id: 'payroll-2',
        employeeId: 'emp-2',
        employeeName: 'Jane Developer',
        month: '2024-12',
        baseSalary: 75000,
        overtimePay: 1500,
        tax: 15225,
        netSalary: 61275,
        status: 'PAID',
      },
    ];
    return NextResponse.json(mockPayroll);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch payroll records' },
      { status: 500 }
    );
  }
}
