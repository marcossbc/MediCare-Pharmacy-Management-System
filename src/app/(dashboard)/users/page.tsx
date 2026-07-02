import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import UsersClient from '@/components/users/UsersClient';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  await connectDB();
  const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();

  return <UsersClient users={JSON.parse(JSON.stringify(users))} />;
}
