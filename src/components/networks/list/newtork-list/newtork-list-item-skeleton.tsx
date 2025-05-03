import { MapPin, Briefcase } from 'lucide-react';

export function NetworkItemSkeleton() {
  return (
    <div className="border-b border-accent py-4 flex gap-1 flex-col px-6 hover:bg-accent group">
      <h2 className="self-stretch justify-start text-torea-bay-800 text-xl font-bold animate-pulse">
        Loading network name ...
      </h2>
      <div>
        <div className="flex items-center gap-2 text-[#71717a] mb-2">
          <MapPin className="h-6 w-6 rounded bg-torea-bay-50 p-1 text-grenadier-400" />
          <span className="font-muted-foreground text-sm line-leading-7 animate-pulse">
            Loading location ...
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#71717a]">
            <Briefcase className="h-6 w-6 rounded bg-torea-bay-50 p-1 text-grenadier-400" />
            <span className="font-muted-foreground text-sm line-leading-7 animate-pulse">
              Loading company ...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
