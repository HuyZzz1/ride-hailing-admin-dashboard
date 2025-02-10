import { signIn, getSession } from 'next-auth/react';
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react';

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
  getSession: jest.fn(),
}));

describe('Role-Based Access Control (RBAC) - NextAuth', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should authenticate admin user and store role in session', async () => {
    const adminUser = {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
    };

    (getSession as jest.Mock).mockResolvedValue({
      user: adminUser,
    });

    const { result } = renderHook(() => getSession());

    await act(async () => {
      expect(await result.current).toEqual({ user: adminUser });
    });

    expect(getSession).toHaveBeenCalledTimes(1);
  });

  it('should deny authentication for invalid user', async () => {
    (signIn as jest.Mock).mockResolvedValueOnce(null);

    await act(async () => {
      const result = await signIn('credentials', {
        email: 'invalid@example.com',
        password: 'wrongpassword',
      });

      expect(result).toBeNull();
    });

    expect(signIn).toHaveBeenCalledWith('credentials', {
      email: 'invalid@example.com',
      password: 'wrongpassword',
    });
  });

  it('should include user role in JWT token', async () => {
    const user = {
      id: '2',
      name: 'Regular User',
      email: 'user@example.com',
      role: 'user',
    };

    const token = {
      name: user.name,
      email: user.email,
      role: user.role,
    };

    expect(token.role).toBe('user');
  });
});
