'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function MotionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      layout
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
    >
      {children}
    </motion.div>
  );
}
