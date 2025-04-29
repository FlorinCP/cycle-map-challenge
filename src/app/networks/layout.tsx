import CustomMap from '@/components/map/custom-map';

export default function NetworksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid grid-cols-2 min-h-screen max-h-screen  w-full">
      {children}
      <CustomMap longitude={34} latitude={44} />
    </div>
  );
}
