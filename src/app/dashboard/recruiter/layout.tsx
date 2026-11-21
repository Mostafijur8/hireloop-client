import { requireRole } from '@/lib/server/auth';
import React from 'react';


const AdminLayout =async ({ children }: { children: React.ReactNode }) => {
await requireRole('admin');
  return children;
};

export default AdminLayout;
