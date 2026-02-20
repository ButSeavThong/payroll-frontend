import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const mockEmployee = {
      id: 'emp-2',
      userId: '2',
      firstName: 'Jane',
      lastName: 'Developer',
      department: 'Engineering',
      position: 'Senior Developer',
      baseSalary: 75000,
      hireDate: '2021-06-01',
      isActive: true,
    };
    return NextResponse.json(mockEmployee);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch employee' },
      { status: 500 }
    );
  }
}
