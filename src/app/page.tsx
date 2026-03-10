import Link from 'next/link';

// GBU-specific categories with icons
const categories = [
  { name: 'Books', icon: '📚', slug: 'books' },
  { name: 'Electronics', icon: '💻', slug: 'electronics' },
  { name: 'Hostel Items', icon: '🏠', slug: 'hostel-items' },
  { name: 'Cycles / Bikes', icon: '🚲', slug: 'cycles-bikes' },
  { name: 'Clothing', icon: '👕', slug: 'clothing' },
  { name: 'Room Appliances', icon: '🔌', slug: 'room-appliances' },
  { name: 'Study Materials', icon: '📝', slug: 'study-materials' },
  { name: 'Miscellaneous', icon: '📦', slug: 'miscellaneous' },
];

// GBU Hostels
const boysHostels = [
  { name: 'Sant Ravidas Boys Hostel', slug: 'Sant%20Ravidas%20Boys%20Hostel' },
  { name: 'Sant Kabir Das Boys Hostel', slug: 'Sant%20Kabir%20Das%20Boys%20Hostel' },
  { name: 'Birsa Munda Boys Hostel', slug: 'Birsa%20Munda%20Boys%20Hostel' },
  { name: 'Ram Sharan Das Boys Hostel', slug: 'Ram%20Sharan%20Das%20Boys%20Hostel' },
  { name: 'Shri Narayan Guru Boys Hostel', slug: 'Shri%20Narayan%20Guru%20Boys%20Hostel' },
  { name: 'Tulsidas Boys Hostel', slug: 'Tulsidas%20Boys%20Hostel' },
  { name: 'Guru Ghasi Das Boys Hostel', slug: 'Guru%20Ghasi%20Das%20Boys%20Hostel' },
  { name: 'Malik Mohammad Jaysi Boys Hostel', slug: 'Malik%20Mohammad%20Jaysi%20Boys%20Hostel' },
  { name: 'Munshi Premchand Boys Hostel', slug: 'Munshi%20Premchand%20Boys%20Hostel' },
  { name: 'Raheem Boys Hostel', slug: 'Raheem%20Boys%20Hostel' },
  { name: 'Maharshi Valmiki Boys Hostel', slug: 'Maharshi%20Valmiki%20Boys%20Hostel' },
];

const girlsHostels = [
  { name: 'Savitri Bai Phule Girls Hostel', slug: 'Savitri%20Bai%20Phule%20Girls%20Hostel' },
  { name: 'Rani Laxmi Bai Girls Hostel', slug: 'Rani%20Laxmi%20Bai%20Girls%20Hostel' },
  { name: 'Ramabai Ambedkar Girls Hostel', slug: 'Ramabai%20Ambedkar%20Girls%20Hostel' },
  { name: 'Mahamaya Girls Hostel', slug: 'Mahamaya%20Girls%20Hostel' },
  { name: 'Mahadevi Verma Girls Hostel', slug: 'Mahadevi%20Verma%20Girls%20Hostel' },
  { name: 'Ismat Chughtai Girls Hostel', slug: 'Ismat%20Chughtai%20Girls%20Hostel' },
];

const otherHostels = [
  { name: 'Married Research Scholars Hostel', slug: 'Married%20Research%20Scholars%20Hostel' },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-maroon overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-maroon to-maroon-dark opacity-90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            GBU Swap
          </h1>
          <p className="text-2xl text-white/90 mb-4">
            Buy, Sell, Swap on Campus
          </p>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            The easiest way for GBU students to exchange textbooks, furniture, electronics, and more. Save money and reduce waste.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/items"
              className="bg-white text-maroon px-8 py-4 rounded-lg font-semibold hover:bg-white/90 transition text-lg"
            >
              Browse Items
            </Link>
            <Link
              href="/items/new"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition text-lg"
            >
              Sell Something
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/items/new" className="text-center group cursor-pointer">
              <div className="w-16 h-16 bg-maroon/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-maroon/20 transition">
                <svg className="w-8 h-8 text-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-maroon transition">List Your Item</h3>
              <p className="text-gray-600">Take photos, add a description, and set your price in minutes.</p>
            </Link>
            <Link href="/messages" className="text-center group cursor-pointer">
              <div className="w-16 h-16 bg-maroon/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-maroon/20 transition">
                <svg className="w-8 h-8 text-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-maroon transition">Chat with Buyers</h3>
              <p className="text-gray-600">Message directly with interested buyers on campus.</p>
            </Link>
            <Link href="/items" className="text-center group cursor-pointer">
              <div className="w-16 h-16 bg-maroon/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-maroon/20 transition">
                <svg className="w-8 h-8 text-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-maroon transition">Meet & Exchange</h3>
              <p className="text-gray-600">Arrange pickup at your hostel or meeting spot on campus.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/items?category=${category.slug}`}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center hover:shadow-md hover:border-maroon/30 transition cursor-pointer group"
              >
                <span className="text-4xl mb-3 block">{category.icon}</span>
                <span className="font-medium text-gray-700 group-hover:text-maroon transition">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Hostel */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Browse by Hostel
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Find items available for pickup at your hostel or nearby. Meet sellers right where you live.
          </p>

          {/* Boys Hostels */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Boys Hostels
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {boysHostels.map((hostel) => (
                <Link
                  key={hostel.name}
                  href={`/items?hostel=${hostel.slug}`}
                  className="bg-maroon-50 hover:bg-maroon-100 border border-maroon-200 px-4 py-3 rounded-lg text-center transition group"
                >
                  <span className="text-sm font-medium text-maroon-800 group-hover:text-maroon-900">
                    {hostel.name.replace(' Boys Hostel', '')}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Girls Hostels */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
              Girls Hostels
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {girlsHostels.map((hostel) => (
                <Link
                  key={hostel.name}
                  href={`/items?hostel=${hostel.slug}`}
                  className="bg-pink-50 hover:bg-pink-100 border border-pink-200 px-4 py-3 rounded-lg text-center transition group"
                >
                  <span className="text-sm font-medium text-pink-800 group-hover:text-pink-900">
                    {hostel.name.replace(' Girls Hostel', '')}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Other Hostels */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Other
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {otherHostels.map((hostel) => (
                <Link
                  key={hostel.name}
                  href={`/items?hostel=${hostel.slug}`}
                  className="bg-purple-50 hover:bg-purple-100 border border-purple-200 px-4 py-3 rounded-lg text-center transition group"
                >
                  <span className="text-sm font-medium text-purple-800 group-hover:text-purple-900">
                    {hostel.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Campus-Smart Features
              </h2>
              <ul className="space-y-4">
                {[
                  { icon: '🏠', text: 'Hostel-based pickup locations' },
                  { icon: '🏃', text: 'Urgent sale tags for quick deals' },
                  { icon: '🏷️', text: 'Auction mode for competitive pricing' },
                  { icon: '💬', text: 'Built-in messaging system' },
                  { icon: '✓', text: 'Verified student accounts' },
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <span className="text-gray-700">{feature.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-maroon/5 rounded-2xl p-8 border border-maroon/10">
              <h3 className="text-2xl font-bold text-maroon mb-4">
                Why GBU Swap?
              </h3>
              <p className="text-gray-600 mb-4">
                GBU Swap is exclusively for Gautam Buddha University students. That means:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Prices are fair and student-friendly</li>
                <li>• Meet sellers at familiar campus locations</li>
                <li>• No shipping hassles - pickup on campus</li>
                <li>• Support your fellow students directly</li>
              </ul>
              <Link
                href="/register"
                className="inline-block mt-6 bg-maroon text-white px-6 py-3 rounded-lg font-medium hover:bg-maroon-dark transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-maroon">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Trading?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Join hundreds of GBU students already buying and selling on campus.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/register"
              className="bg-white text-maroon px-8 py-4 rounded-lg font-semibold hover:bg-white/90 transition text-lg"
            >
              Create Account
            </Link>
            <Link
              href="/items"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition text-lg"
            >
              Browse First
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
