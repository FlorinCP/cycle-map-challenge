// src/components/networks/NetworkListItem.tsx
'use client'; // Mark as client component for consistency and potential future interactions

import Link from 'next/link'; // Use Next.js Link for optimized client-side navigation
import type { NetworkSummary } from '@/types/city-bikes'; // Import the type definition

// Optional imports if implementing flyTo + navigate action
// import { useMapInteractionStore } from '@/store/mapInteractionStore';
// import { useRouter } from 'next/navigation';

// Define the props the component expects
interface NetworkListItemProps {
  network: NetworkSummary;
}

export default function NetworkListItem({ network }: NetworkListItemProps) {
  // --- Optional: Hooks for flyTo + navigate action ---
  // Uncomment and use if you choose this interaction pattern instead of simple Link
  // const setFlyToTarget = useMapInteractionStore((state) => state.setFlyToTarget);
  // const router = useRouter();

  // const handleFlyToAndNavigate = (e: React.MouseEvent) => {
  //   e.preventDefault(); // Prevent standard link behavior if needed
  //   const target = {
  //     lat: network.location.latitude,
  //     lng: network.location.longitude,
  //     zoom: 12, // Adjust zoom level as desired
  //   };
  //   console.log('ListItem: Setting flyTo target and navigating');
  //   setFlyToTarget(target); // Trigger map animation via store
  //   router.push(`/networks/${network.id}`); // Navigate programmatically
  // };
  // --- End Optional ---

  // Helper to safely format company names (handles string or string[])
  const getCompanyDisplay = (
    company: string | string[] | undefined | null
  ): string => {
    if (!company) return 'N/A';
    const companies = Array.isArray(company) ? company : [company];
    return companies.filter(Boolean).join(', ') || 'N/A'; // Filter out empty/null strings
  };

  const companyDisplay = getCompanyDisplay(network.company);

  return (
    // Using Next.js Link for standard navigation. The map component
    // will react to the URL change if it's using useParams/usePathname.
    <Link
      href={`/networks/${network.id}`}
      className="block p-4 border border-gray-200 rounded-lg shadow-sm transition-all duration-200 ease-in-out hover:shadow-md hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      aria-label={`View details for ${network.name}`}
    >
      <div className="flex flex-col">
        {/* Network Name */}
        <h3 className="text-lg font-semibold text-gray-800 truncate mb-1">
          {network.name || 'Unnamed Network'}
        </h3>

        {/* Location */}
        <p className="text-sm text-gray-600 mb-1">
          {network.location.city || 'Unknown City'},{' '}
          {network.location.country?.toUpperCase() || 'Unknown Country'}
        </p>

        {/* Companies */}
        <p className="text-xs text-gray-500">
          <span className="font-medium">Operator(s):</span> {companyDisplay}
        </p>
      </div>
    </Link>

    /* --- Alternative structure for onClick={handleFlyToAndNavigate} ---
    <div
      onClick={handleFlyToAndNavigate} // Attach handler here instead of using Link's href
      className="block p-4 border border-gray-200 rounded-lg shadow-sm transition-all duration-200 ease-in-out hover:shadow-md hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 cursor-pointer"
      role="button" // Indicate it's clickable
      tabIndex={0} // Make it focusable
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleFlyToAndNavigate(e as any); }} // Basic keyboard interaction
      aria-label={`View details for ${network.name}`}
    >
        // ... same inner content (h3, p tags) ...
    </div>
    */
  );
}

// Optional: Add a display name for better debugging
NetworkListItem.displayName = 'NetworkListItem';
