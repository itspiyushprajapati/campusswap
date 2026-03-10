'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const boysHostels = [
  'Sant Ravidas Boys Hostel',
  'Sant Kabir Das Boys Hostel',
  'Birsa Munda Boys Hostel',
  'Ram Sharan Das Boys Hostel',
  'Shri Narayan Guru Boys Hostel',
  'Tulsidas Boys Hostel',
  'Guru Ghasi Das Boys Hostel',
  'Malik Mohammad Jaysi Boys Hostel',
  'Munshi Premchand Boys Hostel',
  'Raheem Boys Hostel',
  'Maharshi Valmiki Boys Hostel',
];

const girlsHostels = [
  'Savitri Bai Phule Girls Hostel',
  'Rani Laxmi Bai Girls Hostel',
  'Ramabai Ambedkar Girls Hostel',
  'Mahamaya Girls Hostel',
  'Mahadevi Verma Girls Hostel',
  'Ismat Chughtai Girls Hostel',
];

const marriedHostel = 'Married Research Scholars Hostel';

interface HostelFilterProps {
  currentHostel?: string;
}

export function HostelFilter({ currentHostel }: HostelFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleHostelChange = (hostelValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (hostelValue) {
      params.set('hostel', hostelValue);
    } else {
      params.delete('hostel');
    }
    // Remove empty params
    const newParams = params.toString();
    router.push(`/items${newParams ? `?${newParams}` : ''}`);
  };

  const clearHostelFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('hostel');
    const newParams = params.toString();
    router.push(`/items${newParams ? `?${newParams}` : ''}`);
  };

  const hasHostelFilter = !!currentHostel;

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-3">Filter by Hostel</h3>

      <div className="space-y-3">
        {/* Boys Hostels Dropdown */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Boys Hostels</label>
          <select
            value={currentHostel && boysHostels.includes(currentHostel) ? currentHostel : ''}
            onChange={(e) => handleHostelChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-maroon focus:border-maroon text-sm"
          >
            <option value="">Select a boys hostel...</option>
            {boysHostels.map((hostel) => (
              <option key={hostel} value={hostel}>
                {hostel}
              </option>
            ))}
          </select>
        </div>

        {/* Girls Hostels Dropdown */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Girls Hostels</label>
          <select
            value={currentHostel && girlsHostels.includes(currentHostel) ? currentHostel : ''}
            onChange={(e) => handleHostelChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-maroon focus:border-maroon text-sm"
          >
            <option value="">Select a girls hostel...</option>
            {girlsHostels.map((hostel) => (
              <option key={hostel} value={hostel}>
                {hostel}
              </option>
            ))}
          </select>
        </div>

        {/* Married Hostel Option */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Other</label>
          <select
            value={currentHostel === marriedHostel ? marriedHostel : ''}
            onChange={(e) => handleHostelChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-maroon focus:border-maroon text-sm"
          >
            <option value="">Select...</option>
            <option value={marriedHostel}>{marriedHostel}</option>
          </select>
        </div>
      </div>

      {/* Clear Filter Button */}
      {hasHostelFilter && (
        <button
          onClick={clearHostelFilter}
          className="mt-3 text-sm text-maroon hover:text-maroon-dark hover:underline"
        >
          Clear Hostel Filter
        </button>
      )}

      {/* Active Filter Display */}
      {currentHostel && (
        <div className="mt-3 p-2 bg-maroon/10 rounded-md">
          <span className="text-sm text-maroon font-medium">
            Showing items from: {currentHostel}
          </span>
        </div>
      )}
    </div>
  );
}
