import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const payroll = {
      id,
      employeeId: 'emp-1',
      employeeName: 'John Admin',
      month: '2024-12',
      baseSalary: 80000,
      overtimePay: 2000,
      tax: 15600,
      netSalary: 66400,
      status: 'PAID',
    };
    return NextResponse.json(payroll, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update payroll record' },
      { status: 500 }
    );
  }
}
