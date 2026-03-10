import { db } from '@/lib/db';
import type { UpdateUserInput } from '@/models/types';
import type { User } from '@prisma/client';

interface CreateUserData {
  email: string;
  username: string;
  name?: string;
  university?: string;
  password: string;
}

/**
 * Service for handling User business logic
 */
export const UserService = {
  /**
   * Get a user by ID
   */
  async getUserById(id: string): Promise<Omit<User, 'password'> | null> {
    const user = await db.user.findUnique({
      where: { id },
    });

    if (!user) return null;
    return user;
  },

  /**
   * Get a user by email
   */
  async getUserByEmail(
    email: string
  ): Promise<Omit<User, 'password'> | null> {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) return null;
    return user;
  },

  /**
   * Get a user by username
   */
  async getUserByUsername(
    username: string
  ): Promise<Omit<User, 'password'> | null> {
    const user = await db.user.findUnique({
      where: { username },
    });

    if (!user) return null;
    return user;
  },

  /**
   * Create a new user
   */
  async createUser(input: CreateUserData): Promise<Omit<User, 'password'>> {
    const user = await db.user.create({
      data: input,
    });

    return user;
  },

  /**
   * Update a user
   */
  async updateUser(
    id: string,
    input: UpdateUserInput
  ): Promise<Omit<User, 'password'> | null> {
    const user = await db.user.update({
      where: { id },
      data: input,
    });

    return user;
  },

  /**
   * Mark user as verified
   */
  async verifyUser(id: string): Promise<void> {
    await db.user.update({
      where: { id },
      data: { isVerified: true },
    });
  },

  /**
   * Delete a user
   */
  async deleteUser(id: string): Promise<boolean> {
    try {
      await db.user.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },
};
