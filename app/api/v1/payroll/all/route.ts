import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const mockPayroll = [
      {
        id: 'payroll-1',
        employeeId: 'emp-1',
        employeeName: 'John Admin',
        month: '2024-12',
        baseSalary: 80000,
        overtimePay: 2000,
        tax: 15600,
        netSalary: 66400,
        status: 'PAID',
      },
      {
        id: 'payroll-2',
        employeeId: 'emp-2',
        employeeName: 'Jane Developer',
        month: '2024-12',
        baseSalary: 75000,
        overtimePay: 1500,
        tax: 15225,
        netSalary: 61275,
        status: 'GENERATED',
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
