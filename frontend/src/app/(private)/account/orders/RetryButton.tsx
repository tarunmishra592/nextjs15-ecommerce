'use client'

import { Button } from '@/components/ui/button';

export function RetryButton() {
  return (
    <Button
      variant="outline"
      className="mt-3"
      onClick={() => window.location.reload()}
    >
      Retry
    </Button>
  );
}