import NetworkList from '@/components/networks/list/network-list';

export default function NetworksPage({}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="h-max-screen flex flex-col">
      <div className="flex-grow relative overflow-hidden">
        <NetworkList />
      </div>
    </div>
  );
}
