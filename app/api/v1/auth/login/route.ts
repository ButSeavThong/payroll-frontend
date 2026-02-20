import { NextRequest, NextResponse } from 'next/server';

// Mock user database
const mockUsers = {
  admin: {
    password: 'admin123',
    role: 'ADMIN',
    id: '1',
  },
  employee: {
    password: 'emp123',
    role: 'EMPLOYEE',
    id: '2',
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Check credentials against mock database
    const user = mockUsers[username as keyof typeof mockUsers];

    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Generate a simple mock JWT token (in production, use a proper JWT library)
    const token = Buffer.from(
      JSON.stringify({ username, role: user.role, id: user.id })
    ).toString('base64');

    return NextResponse.json(
      {
        token,
        role: user.role,
        id: user.id,
        username,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
