import { requireRole } from '@/lib/server/auth';
import React from 'react';


const RecruiterLayout = async ({ children }: { children: React.ReactNode }) => {
  await requireRole('recruiter');
  return children;
};

export default RecruiterLayout;
