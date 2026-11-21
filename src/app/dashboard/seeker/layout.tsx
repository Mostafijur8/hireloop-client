import { requireRole } from '@/lib/server/auth';
import React from 'react';

const SeekerLayout = async ({ children }: { children: React.ReactNode }) => {
  await requireRole('seeker');
  return children;
};

export default SeekerLayout;
