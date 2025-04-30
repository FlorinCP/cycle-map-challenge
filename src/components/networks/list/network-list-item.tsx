import { MapPin, Briefcase } from 'lucide-react';
import { NetworkSummary } from '@/types/city-bikes';
import { ExpandingDetailButton } from '@/components/networks/list/expanding-detail-button';

export function NetworkItem({ name, location, company, href }: NetworkSummary) {
  const companies = Array.isArray(company) ? company : [company];

  return (
    <div className="border-b border-accent py-4 flex gap-1 flex-col px-6 hover:bg-accent group">
      <h2 className="self-stretch justify-start text-torea-bay-800 text-xl font-bold leading-7">
        {name}
      </h2>
      <div>
        <div className="flex items-center gap-2 text-[#71717a] mb-2">
          <MapPin className="h-6 w-6 rounded bg-torea-bay-50 p-1 text-grenadier-400" />
          <span className={'font-muted-foreground text-sm line-leading-7'}>
            {location.city}, {location.country}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#71717a]">
            <Briefcase className="h-6 w-6 rounded bg-torea-bay-50 p-1 text-grenadier-400" />
            <span className={'font-muted-foreground text-sm line-leading-7'}>
              {companies.slice(0, 2).join(', ')}
            </span>
            {companies.length > 2 && (
              <span className="inline-flex items-center justify-center h-6 w-6 rounded border border-[#f0581f] text-[#f0581f] text-xs">
                +{companies.length - 2}
              </span>
            )}
          </div>
          <ExpandingDetailButton href={href} />
        </div>
      </div>
    </div>
  );
}
