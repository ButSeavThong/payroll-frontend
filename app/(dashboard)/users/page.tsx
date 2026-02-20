'use client';

import { useState } from 'react';
import { useGetUsersQuery } from '@/src/feature/user/userApi';
import { CreateUserModal } from '@/src/components/create-user-modal';
import { LoadingTable } from '@/src/components/loading-table';
import { StatusBadge } from '@/src/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus } from 'lucide-react';
import { formatDate } from '@/src/lib/utils';

const ONBOARDING_STEPS = [
  { step: 1, title: 'Create User Account', description: 'Add a new user to the system' },
  { step: 2, title: 'Create Employee Profile', description: 'Link user to employee record' },
  { step: 3, title: 'Assign Department', description: 'Set employee department and position' },
  { step: 4, title: 'Configure Payroll', description: 'Set salary and payroll settings' },
  { step: 5, title: 'Start Attendance', description: 'Employee can begin check-in/out' },
];

export default function UsersPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: users, isLoading } = useGetUsersQuery();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-600 mt-1">Manage user accounts and access control</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create User
        </Button>
      </div>

      {/* Onboarding Stepper */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">User Onboarding Process</CardTitle>
          <CardDescription>Follow these steps to add a new employee</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {ONBOARDING_STEPS.map((item, index) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white text-sm font-semibold">
                  {item.step}
                </div>
                <div className="pt-1">
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
                {index < ONBOARDING_STEPS.length - 1 && (
                  <div className="absolute left-4 top-24 h-12 border-l-2 border-slate-200 mb-2" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>All registered users in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingTable columns={6} />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>DOB</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users && users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-mono text-xs">{user.id}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <StatusBadge status={user.role} />
                        </TableCell>
                        <TableCell>{user.dob ? formatDate(user.dob) : '-'}</TableCell>
                        <TableCell className="text-sm text-slate-500">
                          {user.createdAt ? formatDate(user.createdAt) : '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                        No users found. Create your first user to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateUserModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
