import Link from 'next/link';
import { Suspense } from 'react';
import { ItemCard } from '@/components/items/ItemCard';
import { CategoryFilter } from '@/components/items/CategoryFilter';
import { SearchBar } from '@/components/items/SearchBar';
import { HostelFilter } from '@/components/items/HostelFilter';
import { db } from '@/lib/db';
import { CategoryService } from '@/services/category.service';
import type { ItemWithRelations, Condition } from '@/models/types';

interface BrowseItemsPageProps {
  searchParams: {
    search?: string;
    category?: string;
    condition?: string;
    minPrice?: string;
    maxPrice?: string;
    saleType?: string;
    hostel?: string;
  };
}

async function getItems(searchParams: BrowseItemsPageProps['searchParams']): Promise<ItemWithRelations[]> {
  const where: any = {
    status: 'AVAILABLE',
  };

  // Search filter
  if (searchParams.search) {
    where.OR = [
      { title: { contains: searchParams.search, mode: 'insensitive' } },
      { description: { contains: searchParams.search, mode: 'insensitive' } },
    ];
  }

  // Category filter
  if (searchParams.category) {
    where.categoryId = searchParams.category;
  }

  // Hostel filter
  if (searchParams.hostel) {
    where.pickupLocation = { contains: searchParams.hostel, mode: 'insensitive' };
  }

  // Condition filter
  if (searchParams.condition) {
    where.condition = searchParams.condition;
  }

  // Price filters
  if (searchParams.minPrice || searchParams.maxPrice) {
    where.price = {};
    if (searchParams.minPrice) {
      where.price.gte = parseFloat(searchParams.minPrice);
    }
    if (searchParams.maxPrice) {
      where.price.lte = parseFloat(searchParams.maxPrice);
    }
  }

  // Sale type filter
  if (searchParams.saleType) {
    where.saleType = searchParams.saleType;
  }

  const items = await db.item.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
      seller: {
        select: { id: true, username: true, name: true, avatar: true },
      },
      auction: {
        select: {
          id: true,
          startingPrice: true,
          currentBid: true,
          endTime: true,
          _count: {
            select: { bids: true },
          },
        },
      },
    },
  });

  return items as ItemWithRelations[];
}

async function ItemsList({ searchParams }: { searchParams: BrowseItemsPageProps['searchParams'] }) {
  const items = await getItems(searchParams);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.length > 0 ? (
        items.map((item) => <ItemCard key={item.id} item={item} />)
      ) : (
        <div className="col-span-full text-center py-12">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p className="text-gray-500 text-lg">No items found</p>
          <p className="text-gray-400 text-sm mt-1">
            Try adjusting your filters or search terms
          </p>
          <Link
            href="/items/new"
            className="inline-block mt-4 bg-maroon text-white px-6 py-2 rounded-lg hover:bg-maroon-dark transition"
          >
            List an item
          </Link>
        </div>
      )}
    </div>
  );
}

async function CategoriesFilter() {
  const categories = await CategoryService.getAllCategories();
  return <CategoryFilter categories={categories} />;
}

export default function BrowseItemsPage({ searchParams }: BrowseItemsPageProps) {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
            <Suspense fallback={<div>Loading filters...</div>}>
              <CategoriesFilter />
            </Suspense>
            <HostelFilter currentHostel={searchParams.hostel} />
          </aside>

          {/* Items Grid */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Browse Items
            </h1>
            <Suspense fallback={<div>Loading items...</div>}>
              <ItemsList searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
