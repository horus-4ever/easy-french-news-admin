'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GlobalPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/articles');
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-lg text-gray-600">Redirecting to articles...</p>
    </div>
  );
}
