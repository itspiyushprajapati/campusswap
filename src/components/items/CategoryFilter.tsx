'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { cn, formatPrice } from '@/lib/utils';
import type { Category } from '@prisma/client';

interface CategoryFilterProps {
  categories: Category[];
}

const conditions = [
  { value: 'NEW', label: 'New' },
  { value: 'LIKE_NEW', label: 'Like New' },
  { value: 'GOOD', label: 'Good' },
  { value: 'FAIR', label: 'Fair' },
  { value: 'POOR', label: 'Poor' },
];

const saleTypes = [
  { value: 'FIXED', label: 'Fixed Price' },
  { value: 'AUCTION', label: 'Auction' },
];

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedCategory = searchParams.get('category');
  const selectedCondition = searchParams.get('condition');
  const selectedSaleType = searchParams.get('saleType');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  function updateFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/items?${params.toString()}`);
  }

  function clearFilters() {
    router.push('/items');
  }

  const hasActiveFilters = selectedCategory || selectedCondition || selectedSaleType || minPrice || maxPrice;

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
        <div className="space-y-2">
          <button
            onClick={() => updateFilter('category', null)}
            className={cn(
              'block w-full text-left px-3 py-2 rounded-md text-sm transition',
              !selectedCategory
                ? 'bg-maroon/10 text-maroon font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            )}
          >
            All Items
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => updateFilter('category', category.slug)}
              className={cn(
                'block w-full text-left px-3 py-2 rounded-md text-sm transition',
                selectedCategory === category.slug
                  ? 'bg-maroon/10 text-maroon font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sale Type */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Sale Type</h3>
        <div className="space-y-2">
          <button
            onClick={() => updateFilter('saleType', null)}
            className={cn(
              'block w-full text-left px-3 py-2 rounded-md text-sm transition',
              !selectedSaleType
                ? 'bg-maroon/10 text-maroon font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            )}
          >
            All Types
          </button>
          {saleTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => updateFilter('saleType', type.value)}
              className={cn(
                'block w-full text-left px-3 py-2 rounded-md text-sm transition',
                selectedSaleType === type.value
                  ? 'bg-maroon/10 text-maroon font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Condition</h3>
        <div className="space-y-2">
          <button
            onClick={() => updateFilter('condition', null)}
            className={cn(
              'block w-full text-left px-3 py-2 rounded-md text-sm transition',
              !selectedCondition
                ? 'bg-maroon/10 text-maroon font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            )}
          >
            All Conditions
          </button>
          {conditions.map((cond) => (
            <button
              key={cond.value}
              onClick={() => updateFilter('condition', cond.value)}
              className={cn(
                'block w-full text-left px-3 py-2 rounded-md text-sm transition',
                selectedCondition === cond.value
                  ? 'bg-maroon/10 text-maroon font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              {cond.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">Min Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                value={minPrice || ''}
                onChange={(e) => updateFilter('minPrice', e.target.value)}
                placeholder="0"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-maroon focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Max Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                value={maxPrice || ''}
                onChange={(e) => updateFilter('maxPrice', e.target.value)}
                placeholder="Max"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-maroon focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
}
