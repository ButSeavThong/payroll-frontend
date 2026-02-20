import { NextRequest, NextResponse } from 'next/server';

// Mock database
const mockEmployees = [
  {
    id: 'emp-1',
    userId: '1',
    firstName: 'John',
    lastName: 'Admin',
    department: 'Management',
    position: 'Administrator',
    baseSalary: 80000,
    hireDate: '2020-01-15',
    isActive: true,
  },
  {
    id: 'emp-2',
    userId: '2',
    firstName: 'Jane',
    lastName: 'Developer',
    department: 'Engineering',
    position: 'Senior Developer',
    baseSalary: 75000,
    hireDate: '2021-06-01',
    isActive: true,
  },
];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(mockEmployees);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newEmployee = {
      id: `emp-${Math.random().toString(36).substr(2, 9)}`,
      ...body,
      isActive: true,
    };
    mockEmployees.push(newEmployee);
    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    );
  }
}
