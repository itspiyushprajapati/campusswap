import { db } from '@/lib/db';
import type { Category } from '@prisma/client';

/**
 * Service for handling Category business logic
 */
export const CategoryService = {
  /**
   * Get all categories
   */
  async getAllCategories(): Promise<Category[]> {
    const categories = await db.category.findMany({
      orderBy: { name: 'asc' },
    });

    return categories;
  },

  /**
   * Get category by ID
   */
  async getCategoryById(id: string): Promise<Category | null> {
    const category = await db.category.findUnique({
      where: { id },
    });

    return category;
  },

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const category = await db.category.findUnique({
      where: { slug },
    });

    return category;
  },

  /**
   * Create a category (admin only)
   */
  async createCategory(data: {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
  }): Promise<Category> {
    const category = await db.category.create({
      data,
    });

    return category;
  },

  /**
   * Get category with item count
   */
  async getCategoriesWithCount(): Promise<
    Array<Category & { _count: { items: number } }>
  > {
    const categories = await db.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });

    return categories;
  },
};
