import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CreateItemForm } from '@/components/items/CreateItemForm';
import { CategoryService } from '@/services/category.service';
import { ItemService } from '@/services/item.service';
import type { Condition } from '@/models/types';
import { writeFile } from 'fs/promises';
import { mkdir } from 'fs/promises';
import path from 'path';

// Allowed image types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGES = 5;

export default async function NewItemPage() {
  // Check authentication - user must be logged in to create a listing
  const session = await getServerSession(authOptions);
console.log("SESSION:", session);

if (!session?.user?.id) {
  redirect('/login');
}

  const categories = await CategoryService.getAllCategories();

  // Server action to create item with authenticated user's ID
  async function createItem(formData: FormData) {
    'use server';

    // Re-verify session in server action context
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { error: 'You must be logged in to create a listing' };
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const condition = formData.get('condition') as Condition;
    const categoryId = formData.get('categoryId') as string;
    const saleType = formData.get('saleType') as 'FIXED' | 'AUCTION';
    const pickupLocation = formData.get('pickupLocation') as string;
    const isUrgent = formData.get('isUrgent') === 'true';

    // Basic validation
    if (!title || !price || !condition || !categoryId || !pickupLocation) {
      return { error: 'Please fill in all required fields' };
    }

    // Validate price is positive
    if (isNaN(price) || price < 0) {
      return { error: 'Price must be a valid positive number' };
    }

    // Process uploaded images
    const imageUrls: string[] = [];
    const imageCount = parseInt(formData.get('imageCount') as string) || 0;

    try {
      // Ensure uploads directory exists
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadsDir, { recursive: true });

      // Process each image file
      for (let i = 0; i < imageCount; i++) {
        const fileKey = `image-${i}`;
        const file = formData.get(fileKey) as File | null;

        if (file && file.size > 0) {
          // Validate file type
          if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            return { error: `Invalid file type: ${file.name}. Only JPEG, PNG, WebP, and GIF are allowed.` };
          }

          // Validate file size
          if (file.size > MAX_FILE_SIZE) {
            return { error: `File too large: ${file.name}. Maximum size is 5MB.` };
          }

          // Generate unique filename
          const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
          const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
          const fileName = `${uniqueId}.${fileExt}`;
          const filePath = path.join(uploadsDir, fileName);

          // Convert File to Buffer and save
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          await writeFile(filePath, buffer);

          // Store relative URL for database
          imageUrls.push(`/uploads/${fileName}`);
        }
      }

      // Create item using ItemService with authenticated user's ID and image URLs
      const item = await ItemService.createItem(session.user.id, {
        title,
        description: description || undefined,
        price,
        condition,
        categoryId,
        images: imageUrls,
        saleType: saleType || 'FIXED',
        pickupLocation,
        isUrgent,
      });

      // Return success with itemId instead of redirecting
    // Let client handle navigation
    return { success: true, itemId: item.id };
    } catch (error) {
      console.error('Error creating item:', error);
      return {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create listing. Please try again.',
      };
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-maroon shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-2xl font-bold text-white">
            GBU Swap
          </Link>
        </div>
      </header>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {categories.length > 0 ? 'List an Item for Sale' : 'List an Item for Sale'}
        </h1>
        <p className="text-gray-600 mb-8">
          Fill in the details below to list your item on GBU Swap.
        </p>

        <CreateItemForm
          categories={categories}
          createItemAction={createItem}
        />
      </div>
    </main>
  );
}
