'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface UserRow {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  active: boolean;
  createdAt: string;
}

export default function UsersClient({ users }: { users: UserRow[] }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee' });

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success('User created successfully');
      setModalOpen(false);
      setForm({ name: '', email: '', password: '', role: 'employee' });
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(user: UserRow) {
    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: user.role, active: !user.active }),
      });
      if (!res.ok) throw new Error('Failed to update user');
      toast.success(`User ${!user.active ? 'activated' : 'deactivated'}`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this user?')) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success('User deleted');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 p-5">
        <p className="text-sm text-gray-500 dark:text-gray-400">{users.length} team members</p>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> Add User
        </Button>
      </div>

      <Table>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Status</Th>
            <Th className="text-right">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((u) => (
            <Tr key={u._id}>
              <Td className="font-medium text-gray-800 dark:text-gray-100">{u.name}</Td>
              <Td>{u.email}</Td>
              <Td>
                <Badge variant={u.role === 'admin' ? 'info' : 'neutral'} className="capitalize">
                  {u.role}
                </Badge>
              </Td>
              <Td>
                <Badge variant={u.active ? 'success' : 'danger'}>
                  {u.active ? 'Active' : 'Inactive'}
                </Badge>
              </Td>
              <Td className="text-right space-x-3">
                <button
                  onClick={() => toggleActive(u)}
                  className="text-xs font-medium text-primary-600 hover:underline"
                >
                  {u.active ? 'Deactivate' : 'Activate'}
                </button>
                {session?.user?.id !== u._id && (
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="text-xs font-medium text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add New User">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Full Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Select
            label="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </Select>
          <Button type="submit" className="w-full" loading={loading}>
            Create User
          </Button>
        </form>
      </Modal>
    </Card>
  );
}
