
interface JwtPayload {
    sub: string;
    scope: string;
    exp: number;
    iat: number;
    iss: string;
}

export function decodeJwt(token: string): JwtPayload {
  const base64Payload = token.split('.')[1];

  // RS256 uses base64url — must convert to standard base64 before atob()
  // base64url uses '-' instead of '+' and '_' instead of '/'
  const base64 = base64Payload
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const decoded = atob(base64);
  return JSON.parse(decoded);
}

export function extractRole(token: string): 'ADMIN' | 'EMPLOYEE' {
  const payload = decodeJwt(token);

  const scopes = payload.scope.split(' ');

  if (scopes.includes('ADMIN')) return 'ADMIN';
  if (scopes.includes('EMPLOYEE')) return 'EMPLOYEE';

  throw new Error('No valid role found in token');
}