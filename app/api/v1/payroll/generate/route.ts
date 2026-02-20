import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newPayroll = {
      id: `payroll-${Math.random().toString(36).substr(2, 9)}`,
      employeeId: body.employeeId || 'emp-2',
      employeeName: body.employeeId === 'emp-1' ? 'John Admin' : 'Jane Developer',
      month: body.month,
      baseSalary: body.employeeId === 'emp-1' ? 80000 : 75000,
      overtimePay: 1500,
      tax: body.employeeId === 'emp-1' ? 15600 : 15225,
      netSalary: body.employeeId === 'emp-1' ? 65900 : 61275,
      status: 'GENERATED',
    };
    return NextResponse.json([newPayroll], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate payroll' },
      { status: 500 }
    );
  }
}
