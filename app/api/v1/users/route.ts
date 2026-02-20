import { NextRequest, NextResponse } from 'next/server';

// Mock database
const mockUsers = [
  { id: '1', username: 'admin', email: 'admin@example.com', role: 'ADMIN', dob: '1990-01-01', gender: 'M' },
  { id: '2', username: 'employee', email: 'employee@example.com', role: 'EMPLOYEE', dob: '1995-05-15', gender: 'F' },
];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(mockUsers);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      ...body,
    };
    mockUsers.push(newUser);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
