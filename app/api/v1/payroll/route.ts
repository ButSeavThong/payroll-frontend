import { NextRequest, NextResponse } from 'next/server';

// Mock database
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
];

export async function GET(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname;

    if (path.includes('/my')) {
      return NextResponse.json(mockPayroll.slice(0, 1));
    }

    if (path.includes('/all')) {
      return NextResponse.json(mockPayroll);
    }

    return NextResponse.json(mockPayroll);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch payroll records' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const path = request.nextUrl.pathname;

    if (path.includes('/generate')) {
      const newPayroll = {
        id: `payroll-${Math.random().toString(36).substr(2, 9)}`,
        employeeId: body.employeeId || 'emp-2',
        employeeName: 'Jane Developer',
        month: body.month,
        baseSalary: 75000,
        overtimePay: 1500,
        tax: 15225,
        netSalary: 61275,
        status: 'GENERATED',
      };
      mockPayroll.push(newPayroll);
      return NextResponse.json([newPayroll], { status: 201 });
    }

    return NextResponse.json(
      { error: 'Invalid payroll endpoint' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process payroll request' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname;
    const pathParts = path.split('/');
    const payrollId = pathParts[pathParts.length - 2];

    if (path.includes('/pay')) {
      const payroll = mockPayroll.find(p => p.id === payrollId);
      if (payroll) {
        payroll.status = 'PAID';
        return NextResponse.json(payroll, { status: 200 });
      }
      return NextResponse.json(
        { error: 'Payroll record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Invalid payroll endpoint' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update payroll record' },
      { status: 500 }
    );
  }
}
