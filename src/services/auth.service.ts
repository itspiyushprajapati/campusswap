import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { UserService } from './user.service';

interface RegisterInput {
  email: string;
  username: string;
  name?: string;
  university?: string;
  password: string;
}

export const AuthService = {
  /**
   * Register a new user with password
   */
  async register(data: RegisterInput) {
    // Check if email exists
    const existingEmail = await UserService.getUserByEmail(data.email);
    if (existingEmail) {
      throw new Error('User with this email already exists');
    }

    // Check if username exists
    const existingUsername = await UserService.getUserByUsername(data.username);
    if (existingUsername) {
      throw new Error('Username already taken');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user with password
    const user = await db.user.create({
      data: {
        email: data.email,
        username: data.username,
        name: data.name,
        university: data.university,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        createdAt: true,
      },
    });

    return user;
  },

  /**
   * Validate email/password credentials
   */
  async validateCredentials(email: string, password: string) {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      image: user.avatar,
    };
  },
};
