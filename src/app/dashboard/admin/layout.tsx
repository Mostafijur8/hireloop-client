import { requireRole } from '@/lib/server/auth';


const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  await requireRole('admin');
  return children;
};

export default AdminLayout;
