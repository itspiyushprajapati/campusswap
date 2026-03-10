'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from './ImageUpload';
import type { Category } from '@prisma/client';
import type { Condition } from '@/models/types';

interface CreateItemFormProps {
  categories: Category[];
  createItemAction: (formData: FormData) => Promise<{ success: boolean; itemId: string } | { error: string }>;
}

const conditions: { value: Condition; label: string; description: string }[] = [
  { value: 'NEW', label: 'New', description: 'Never used, in original packaging' },
  { value: 'LIKE_NEW', label: 'Like New', description: 'Used briefly, no visible wear' },
  { value: 'GOOD', label: 'Good', description: 'Light wear, fully functional' },
  { value: 'FAIR', label: 'Fair', description: 'Noticeable wear but works well' },
  { value: 'POOR', label: 'Poor', description: 'Heavy wear, may need repair' },
];

// GBU Hostel locations
const pickupLocations = [
  // Boys Hostels
  { value: 'Sant Ravidas Boys Hostel', label: 'Sant Ravidas Boys Hostel' },
  { value: 'Sant Kabir Das Boys Hostel', label: 'Sant Kabir Das Boys Hostel' },
  { value: 'Birsa Munda Boys Hostel', label: 'Birsa Munda Boys Hostel' },
  { value: 'Ram Sharan Das Boys Hostel', label: 'Ram Sharan Das Boys Hostel' },
  { value: 'Shri Narayan Guru Boys Hostel', label: 'Shri Narayan Guru Boys Hostel' },
  { value: 'Tulsidas Boys Hostel', label: 'Tulsidas Boys Hostel' },
  { value: 'Guru Ghasi Das Boys Hostel', label: 'Guru Ghasi Das Boys Hostel' },
  { value: 'Malik Mohammad Jaysi Boys Hostel', label: 'Malik Mohammad Jaysi Boys Hostel' },
  { value: 'Munshi Premchand Boys Hostel', label: 'Munshi Premchand Boys Hostel' },
  { value: 'Raheem Boys Hostel', label: 'Raheem Boys Hostel' },
  { value: 'Maharshi Valmiki Boys Hostel', label: 'Maharshi Valmiki Boys Hostel' },
  // Girls Hostels
  { value: 'Savitri Bai Phule Girls Hostel', label: 'Savitri Bai Phule Girls Hostel' },
  { value: 'Rani Laxmi Bai Girls Hostel', label: 'Rani Laxmi Bai Girls Hostel' },
  { value: 'Ramabai Ambedkar Girls Hostel', label: 'Ramabai Ambedkar Girls Hostel' },
  { value: 'Mahamaya Girls Hostel', label: 'Mahamaya Girls Hostel' },
  { value: 'Mahadevi Verma Girls Hostel', label: 'Mahadevi Verma Girls Hostel' },
  { value: 'Ismat Chughtai Girls Hostel', label: 'Ismat Chughtai Girls Hostel' },
  // Married Hostel
  { value: 'Married Research Scholars Hostel', label: 'Married Research Scholars Hostel' },
];

export function CreateItemForm({
  categories,
  createItemAction,
}: CreateItemFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [saleType, setSaleType] = useState<'FIXED' | 'AUCTION'>('FIXED');

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setIsSubmitting(true);
  setError(null);

  const formData = new FormData(e.currentTarget);

  // append images
  selectedImages.forEach((image, index) => {
    formData.append(`image-${index}`, image);
  });

  formData.append("imageCount", selectedImages.length.toString());

  const result = await createItemAction(formData);

  // handle server error
  if (result && "error" in result) {
    setError(result.error);
    setIsSubmitting(false);
    return;
  }

  // success → redirect
  if (result && "success" in result) {
    router.push(`/items/${result.itemId}`);
  }
}

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon focus:border-transparent"
          placeholder="e.g., Calculus Textbook - 10th Edition"
        />
      </div>

      {/* Sale Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sale Type <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label
            className={`flex flex-col p-4 border rounded-lg cursor-pointer transition ${
              saleType === 'FIXED'
                ? 'border-maroon bg-maroon/10'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name="saleType"
              value="FIXED"
              checked={saleType === 'FIXED'}
              onChange={() => setSaleType('FIXED')}
              className="sr-only"
            />
            <span className="font-medium text-gray-900">Fixed Price</span>
            <span className="text-sm text-gray-500">Set a fixed price for your item</span>
          </label>
          <label
            className={`flex flex-col p-4 border rounded-lg cursor-pointer transition ${
              saleType === 'AUCTION'
                ? 'border-maroon bg-maroon/10'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name="saleType"
              value="AUCTION"
              checked={saleType === 'AUCTION'}
              onChange={() => setSaleType('AUCTION')}
              className="sr-only"
            />
            <span className="font-medium text-gray-900">Auction</span>
            <span className="text-sm text-gray-500">Let buyers bid on your item</span>
          </label>
        </div>
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="categoryId"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="categoryId"
          name="categoryId"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon focus:border-transparent"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Condition */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Condition <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {conditions.map((cond) => (
            <label
              key={cond.value}
              className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:border-maroon has-[:checked]:bg-maroon/10"
            >
              <input
                type="radio"
                name="condition"
                value={cond.value}
                required
                className="mt-1 text-maroon focus:ring-maroon"
              />
              <div>
                <span className="font-medium text-gray-900">{cond.label}</span>
                <p className="text-sm text-gray-500">{cond.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Price / Starting Price */}
      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {saleType === 'AUCTION' ? 'Starting Price' : 'Price'} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
            ₹
          </span>
          <input
            type="number"
            id="price"
            name="price"
            min="0"
            step="1"
            required
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon focus:border-transparent"
            placeholder="0"
          />
        </div>
        {saleType === 'AUCTION' && (
          <p className="text-sm text-gray-500 mt-1">
            Bids will start from this amount. Auction lasts 7 days.
          </p>
        )}
      </div>

      {/* Pickup Location */}
      <div>
        <label
          htmlFor="pickupLocation"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Pickup Location <span className="text-red-500">*</span>
        </label>
        <select
          id="pickupLocation"
          name="pickupLocation"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon focus:border-transparent"
        >
          <option value="">Select your hostel</option>
          <optgroup label="Boys Hostels">
            {pickupLocations
              .filter((loc) => loc.label.includes('Boys'))
              .map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
          </optgroup>
          <optgroup label="Girls Hostels">
            {pickupLocations
              .filter((loc) => loc.label.includes('Girls'))
              .map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
          </optgroup>
          <optgroup label="Other">
            {pickupLocations
              .filter((loc) => loc.label.includes('Married'))
              .map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
          </optgroup>
        </select>
      </div>

      {/* Urgent Sale Checkbox */}
      <div>
        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:border-maroon has-[:checked]:bg-maroon/10">
          <input
            type="checkbox"
            name="isUrgent"
            value="true"
            className="w-4 h-4 text-maroon focus:ring-maroon rounded"
          />
          <div>
            <span className="font-medium text-gray-900">Mark as Urgent Sale</span>
            <p className="text-sm text-gray-500">Your item will appear with an urgent badge</p>
          </div>
        </label>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon focus:border-transparent"
          placeholder="Describe your item, mention any defects, etc."
        />
      </div>

      {/* Images Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Photos <span className="text-gray-400">(Optional)</span>
        </label>
        <p className="text-sm text-gray-500 mb-4">
          Add up to 5 photos to help buyers see your item. The first photo will be the main image.
        </p>
        <ImageUpload maxImages={5} onImagesChange={setSelectedImages} />
      </div>

      {/* Submit */}
      <div className="pt-4">
        <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full">
          {saleType === 'AUCTION' ? 'Start Auction' : 'List Item'}
        </Button>
      </div>
    </form>
  );
}
