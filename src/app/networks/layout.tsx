import CustomMap from '@/components/map/custom-map';

export default function NetworksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {children}
      <CustomMap longitude={34} latitude={44} />
    </div>
  );
}
